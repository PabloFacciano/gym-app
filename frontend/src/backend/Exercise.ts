import { supabase } from '@/utils/supabase'
import type { IDataManager, IRow } from './_base'
import { deepCopy, hasDuplicates, orderArrByDateField, tryJsonParse } from '@/utils/utils'

export interface AppExerciseMetric {
  name: string
  defaultValue: string | null
  measure: string | null
}

export interface AppExerciseDefinition extends IRow {
  id: string
  userId: string | null
  name: string | null
  archived: boolean | null
  metrics: AppExerciseMetric[] | null
  deleted: boolean | null
  createdDate: Date | null
  modifiedDate: Date | null
}

export interface DbExerciseDefinition extends IRow {
  id: string
  user_id: string
  name: string | null
  archived: boolean | null
  metrics: string | null
  deleted: boolean
  created_date: string
  modified_date: string
}

export class ExerciseManager implements IDataManager<AppExerciseDefinition> {
  private constructor() {}
  private static instance: ExerciseManager | null = null
  public static getInstance(): ExerciseManager {
    if (!ExerciseManager.instance) {
      ExerciseManager.instance = new ExerciseManager()
    }
    return ExerciseManager.instance
  }

  // A mock database array to store our data
  private database: AppExerciseDefinition[] = []
  private rowsLoaded: boolean = false
  private rowsLoadPromise: Promise<AppExerciseDefinition[]> | null = null

  map(db: DbExerciseDefinition): AppExerciseDefinition {
    return {
      id: db.id,
      archived: db.archived,
      deleted: db.deleted,
      metrics: tryJsonParse(db.metrics ?? '[]', []),
      name: db.name,
      userId: db.user_id,
      createdDate: new Date(db.created_date),
      modifiedDate: new Date(db.modified_date),
    }
  }

  newRow(): AppExerciseDefinition {
    return {
      id: crypto.randomUUID(),
      name: '',
      metrics: [
        {
          name: 'Esfuerzo',
          defaultValue: '10',
          measure: '',
        },
        {
          name: 'Repeticiones',
          defaultValue: '30',
          measure: '',
        },
        {
          name: 'Peso',
          defaultValue: '10',
          measure: 'kg',
        },
      ],
      userId: null,
      archived: false,
      deleted: false,
      createdDate: null,
      modifiedDate: null,
    }
  }

  cantSaveReasons(row: AppExerciseDefinition): string[] {
    let reasons = []

    if (!row.name || row.name.trim() == '') {
      reasons.push('Completar Nombre de ejercicio.')
    }

    if (this.database.some((exercise) => exercise.id !== row.id && exercise.name === row.name)) {
      reasons.push('Otro ejercicio ya tiene este nombre.')
    }

    // required metric fields
    const hasEmpty = row.metrics?.some((metric) => !metric.name)
    if (hasEmpty) {
      reasons.push('Completar Nombre de las métricas.')
    }

    //
    const metricNames = row.metrics?.map((metric) => metric.name) ?? []
    if (hasDuplicates(metricNames)) {
      reasons.push('Los nombres de las métricas no pueden repetirse.')
    }

    return reasons
  }

  canSave(row: AppExerciseDefinition): boolean {
    return this.cantSaveReasons(row).length == 0
  }

  async save(row: AppExerciseDefinition): Promise<void> {
    if (!this.canSave(row)) {
      throw new Error(`Validation failed: Cannot save exercise "${row.name}".`)
    }

    // remove empty metrics rows
    while (this.hasEmptyMetric(row)) {
      row.metrics?.splice(
        row.metrics?.findIndex((metric) => !(metric.name || metric.measure || metric.defaultValue)),
        1,
      )
    }

    // trim extra spaces
    row.name = (row.name ?? '').trim()
    row.metrics?.forEach((metric) => {
      metric.name = (metric.name ?? '').trim()
      metric.measure = (metric.measure ?? '').trim()
    })

    // check again after values had posibly changed
    if (!this.canSave(row)) return

    // check if coming row is different than current row, then skip save (no changes)
    const currentRow = this.database.find((r) => r.id === row.id)
    const dp1 = JSON.stringify(row)
    const dp2 = JSON.stringify(currentRow)
    if (currentRow !== row && dp1 === dp2) return // compare if different object-references & not equals objects

    // update/insert in db
    const { data, error } = await supabase
      .from('exercise_definition')
      .upsert({
        id: row.id,
        archived: row.archived,
        metrics: JSON.stringify(row.metrics ?? '[]'),
        name: row.name,
      } as DbExerciseDefinition)
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

    orderArrByDateField(this.database, 'createdDate')
  }

  async delete(row: AppExerciseDefinition): Promise<void> {
    // update in supabase
    const { error } = await supabase
      .from('exercise_definition')
      .update({ deleted: true })
      .eq('id', row.id)
    if (error) throw error

    // update locally
    this.database = this.database.filter((r) => r.id !== row.id)
  }

  async getRows(force: boolean = false): Promise<AppExerciseDefinition[]> {
    if (!force && this.rowsLoaded) {
      return [...this.database]
    }
    if (this.rowsLoadPromise) {
      return this.rowsLoadPromise
    }

    this.rowsLoadPromise = (async () => {
      // get from supabase
      let { data: exercise_definition, error } = await supabase
        .from('exercise_definition')
        .select('*')
        .eq('deleted', false)
        .order('name', { ascending: true })
      if (error) throw error

      // ETL
      this.database = []
      exercise_definition?.forEach((exercise: DbExerciseDefinition) => {
        this.database.push(this.map(exercise))
      })
      this.rowsLoaded = true

      return [...this.database]
    })()

    return this.rowsLoadPromise
  }

  async getById(id: string): Promise<AppExerciseDefinition | null> {
    // search locally
    const found = deepCopy(this.database.find((exercise) => exercise.id === id))
    if (found) return found

    // get from supabase
    const { data, error } = await supabase
      .from('exercise_definition')
      .select()
      .eq('id', id)
      .eq('deleted', false)
    if (error) throw error

    if (!data || data.length === 0) throw new Error('No row found')

    const newRow = this.map(data[0])
    this.database.push(newRow)
    return newRow
  }

  hasEmptyMetric(row: AppExerciseDefinition): boolean {
    if (!row.metrics) return false
    const hasEmpty = row.metrics?.some(
      (metric) => !(metric.name || metric.measure || metric.defaultValue),
    )
    return hasEmpty ?? false
  }

  hasMetrics(row: AppExerciseDefinition): boolean {
    return (row && row.metrics && row.metrics.length > 0) ?? false
  }

  addMetric(row: AppExerciseDefinition) {
    if (this.hasEmptyMetric(row)) return
    row.metrics?.push({
      name: '',
      measure: '',
      defaultValue: '',
    })
  }

  deleteMetric(row: AppExerciseDefinition, index: number) {
    if (!row?.metrics) return
    row?.metrics?.splice(index, 1)
  }
}
