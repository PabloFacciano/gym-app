export function deepCopy(obj: any) {
  if (obj == null) return null
  return JSON.parse(JSON.stringify(obj))
}
export function hasDuplicates(arr: any[]): boolean {
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

export function sleep(ms: number) {
  if (ms <= 0) return
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function isNumeric(val: any): boolean {
  return !isNaN(val) && val !== null && val !== ''
}

export function getRandomVibrantColor() {
  const hue = Math.floor(Math.random() * 360) // 0-360 degrees
  const saturation = 80 // Fixed at 80% for vividness
  const lightness = 60 // Fixed at 60% for brightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function orderArrByDateField(arr:any[], dateFieldName:string) {
  if (!arr || arr.length == 0) return
  arr.sort((a, b) => {
    // If both are null, treat them as equal
    if (a[dateFieldName] === null && b[dateFieldName] === null) return 0
    // If only 'a' is null, push 'a' to the end (return positive)
    if (a[dateFieldName] === null) return 1
    // If only 'b' is null, push 'b' to the end (return negative)
    if (b[dateFieldName] === null) return -1

    // Both are valid dates, subtract timestamps
    return a[dateFieldName] - b[dateFieldName]
  })
}