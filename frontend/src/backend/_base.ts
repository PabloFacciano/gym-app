// A basic structure for our data rows
export interface IRow {
  id: string
  [key: string]: any
}

// The interface defining the required operations
export interface IDataManager<T extends IRow> {
  newRow(): T
  getById(id: string): Promise<T | null>
  save(row: T, isNew: boolean): Promise<void>
  delete(row: T): Promise<void>
  canSave(row: T): boolean
  cantSaveReasons(row: T): string[]
}
