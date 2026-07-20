import { supabase } from '@/utils/supabase'
import type { IDataManager, IRow } from './_base'
import { deepCopy, isNumeric } from '@/utils/utils'
import type { AppExerciseDefinition } from './Exercise'

export interface AppExerciseInstance extends IRow {
  id: string
  userId: string | null
  exerciseDefinitionId: string
  exerciseDuration: number
  restDuration: number
  metric01: number | null
  metric02: number | null
  metric03: number | null
  metric04: number | null
  metric05: number | null
  metric06: number | null
  metric07: number | null
  metric08: number | null
  createdDate: Date | null
  modifiedDate: Date | null
  deleted: boolean
}

export interface DbExerciseInstance extends IRow {
  id: string
  user_id: string
  exercise_definition_id: string
  exercise_duration: number | null
  rest_duration: number | null
  metric01: number | null
  metric02: number | null
  metric03: number | null
  metric04: number | null
  metric05: number | null
  metric06: number | null
  metric07: number | null
  metric08: number | null
  created_date: string
  modified_date: string
  deleted: boolean
}

export class ExerciseInstanceManager implements IDataManager<AppExerciseInstance> {
  private constructor() {}
  private static instance: ExerciseInstanceManager | null = null
  public static getInstance(): ExerciseInstanceManager {
    if (!ExerciseInstanceManager.instance) {
      ExerciseInstanceManager.instance = new ExerciseInstanceManager()
    }
    return ExerciseInstanceManager.instance
  }

  // A mock database array to store our data
  private database: AppExerciseInstance[] = []
  private rowsLoaded: boolean = false
  private rowsLoadPromise: Promise<AppExerciseInstance[]> | null = null

  map(db: DbExerciseInstance): AppExerciseInstance {
    return {
      id: db.id,
      createdDate: new Date(db.created_date),
      modifiedDate: new Date(db.modified_date),
      exerciseDefinitionId: db.exercise_definition_id,
      exerciseDuration: db.exercise_duration ?? 0,
      restDuration: db.rest_duration ?? 0,
      metric01: db.metric01,
      metric02: db.metric02,
      metric03: db.metric03,
      metric04: db.metric04,
      metric05: db.metric05,
      metric06: db.metric06,
      metric07: db.metric07,
      metric08: db.metric08,
      deleted: db.boolean,
      userId: db.user_id,
    }
  }

  newRow(): AppExerciseInstance {
    return {
      id: crypto.randomUUID(),
      exerciseDefinitionId: '',
      exerciseDuration: 0,
      restDuration: 0,
      metric01: null,
      metric02: null,
      metric03: null,
      metric04: null,
      metric05: null,
      metric06: null,
      metric07: null,
      metric08: null,
      createdDate: null,
      modifiedDate: null,
      deleted: false,
      userId: null,
    }
  }

  cantSaveReasons(row: AppExerciseInstance): string[] {
    let reasons = []

    if (!row.exerciseDefinitionId) {
      reasons.push('Debes asociar un ejercicio.')
    }

    return reasons
  }

  canSave(row: AppExerciseInstance): boolean {
    return this.cantSaveReasons(row).length == 0
  }

  async save(row: AppExerciseInstance): Promise<void> {
    if (!this.canSave(row)) {
      throw new Error(`Validation failed: Cannot save exercise instance "${row.id}".`)
    }

    // fix metrics values
    for (let i = 0; i < 9; i++) {
      const metricValueStr = row['metric0' + i]
      if (!isNumeric(metricValueStr)) {
        row['metric0' + i] = null // dont save non-valid values like ''
      }
    }

    // check if coming row is different than current row, then skip save (no changes)
    const currentRow = this.database.find((r) => r.id === row.id)
    const dp1 = JSON.stringify(row)
    const dp2 = JSON.stringify(currentRow)
    if (currentRow !== row && dp1 === dp2) return // compare if different object-references & not equals objects

    // update/insert in db
    const { data, error } = await supabase
      .from('exercise_instance')
      .upsert({
        id: row.id,
        exercise_duration: row.exerciseDuration,
        rest_duration: row.restDuration,
        exercise_definition_id: row.exerciseDefinitionId,
        metric01: row.metric01,
        metric02: row.metric02,
        metric03: row.metric03,
        metric04: row.metric04,
        metric05: row.metric05,
        metric06: row.metric06,
        metric07: row.metric07,
        metric08: row.metric08,
      } as DbExerciseInstance)
      .select()
    if (error) throw error

    if (!data || data.length == 0) {
      throw new Error('Upsert failed: Select with 0 records.')
    }

    const newRow = this.map(data[0])

    // upsert locally
    const index = this.database.findIndex((r) => r.id === newRow.id)
    if (index !== -1) {
      this.database[index] = newRow
    } else {
      this.database.push(newRow)
    }
  }

  async delete(row: AppExerciseInstance): Promise<void> {
    // update in supabase
    const { error } = await supabase
      .from('exercise_instance')
      .update({ deleted: true })
      .eq('id', row.id)
    if (error) throw error

    // update locally
    this.database = this.database.filter((r) => r.id !== row.id)
  }

  async getRows(force: boolean = false): Promise<AppExerciseInstance[]> {
    if (!force && this.rowsLoaded) {
      return [...this.database]
    }
    if (this.rowsLoadPromise) {
      return this.rowsLoadPromise
    }

    this.rowsLoadPromise = (async () => {
      // get from supabase
      let { data: exercise_instance, error } = await supabase
        .from('exercise_instance')
        .select('*')
        .eq('deleted', false)
      if (error) throw error

      // ETL
      this.database = []
      exercise_instance?.forEach((exercise: DbExerciseInstance) => {
        this.database.push(this.map(exercise))
      })
      this.rowsLoaded = true

      return [...this.database]
    })()

    return this.rowsLoadPromise
  }

  async getById(id: string): Promise<AppExerciseInstance | null> {
    // search locally
    const found = deepCopy(this.database.find((exercise) => exercise.id === id))
    if (found) return found

    // get from supabase
    const { data, error } = await supabase
      .from('exercise_instance')
      .select()
      .eq('id', id)
      .eq('deleted', false)
    if (error) throw error

    if (!data || data.length === 0) throw new Error('No row found')

    const newRow = this.map(data[0])
    this.database.push(newRow)
    return newRow
  }

  async getByDate(date: Date): Promise<AppExerciseInstance[]> {
    date.setHours(0, 0, 0, 0)

    // search locally
    let rows = this.database.filter((row) => {
      const isSameDate: boolean =
        (row.createdDate &&
          row.createdDate?.getUTCFullYear() == date.getUTCFullYear() &&
          row.getUTCMonth() === date.getUTCMonth() &&
          row.getUTCDate() === date.getUTCDate()) ??
        false
      return isSameDate
    })
    if (rows && rows.length > 0) {
      return rows
    }

    // return current promise
    if (this.rowsLoadPromise) {
      return this.rowsLoadPromise
    }

    const endDate = new Date() // Current date and time
    endDate.setDate(date.getDate() + 1)
    endDate.setHours(0, 0, 0, 0)

    // ask supabase
    this.rowsLoadPromise = (async () => {
      // get from supabase
      let { data: exercise_instance, error } = await supabase
        .from('exercise_instance')
        .select('*')
        .gte('created_at', date.toISOString()) // Start Date (Inclusive)
        .lte('created_at', endDate.toDateString()) // End Date (Inclusive)
        .eq('deleted', false)
      if (error) throw error

      // ETL
      let resultRows: AppExerciseInstance[] = []
      exercise_instance?.forEach((exercise: DbExerciseInstance) => {
        const newExercise = this.map(exercise)
        resultRows.push(newExercise)
        this.database.push(newExercise)
      })

      return [...resultRows]
    })()

    return this.rowsLoadPromise
  }

  getNewByExerciseDefinition(exercise: AppExerciseDefinition): AppExerciseInstance {
    const row = this.newRow()

    row.exerciseDefinitionId = exercise.id

    if (exercise.metrics && exercise.metrics.length > 0) {
      for (let i = 0; i < exercise.metrics.length; i++) {
        if (i >= 9) {
          console.warn('Exceeded metric count supported. count=' + exercise.metrics.length)
          break
        }
        const metric = exercise.metrics[i]
        row['metric0' + i] = metric?.defaultValue
      }
    }

    return row
  }
}
