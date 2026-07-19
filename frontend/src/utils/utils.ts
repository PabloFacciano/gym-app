export function deepCopy(obj: any) {
  if (obj == null) return null
  return JSON.parse(JSON.stringify(obj))
}
export function hasDuplicates(arr: any[]) {
  if (!arr || arr.length <= 1) return false
  return new Set(arr).size !== arr.length
}

export function tryJsonParse(obj: string, defaultObj: any) {
  try {
    return JSON.parse(obj)
  } catch (error) {
    console.error('tryJsonParse failed', error)
    return defaultObj
  }
}

export function sleep(ms:number) {
  if (ms <= 0) return
  return new Promise((resolve) => setTimeout(resolve, ms));
}
