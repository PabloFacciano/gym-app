import type { AppExerciseMetric } from '@/backend/Exercise'

export interface DynamicKeyValue {
  [key: string]: string // Key-value pairs
}

export type AppUser = {
  id: string
  name: string | null
  email: string
  picture: string | null
}

export interface AppExerciseInstance {
  id: string
  userId: string | null
  name: string | null
  archived: boolean | null
  metrics: AppExerciseMetric[] | null
  createdDate: Date | null
  modifiedDate: Date | null
}

export type DbExerciseInstance = {
  id: string | null
  exerciseDefinitionId: string | null
  exerciseDuration: number | null
  restDuration: number | null
  effort: number | null
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
}
