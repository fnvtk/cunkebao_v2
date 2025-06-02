/**
 * 格式化日期为 YYYY-MM-DD HH:MM:SS 格式
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDateShort(date: Date | number | string): string {
  const d = new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}
