/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅하는 순수함수
 * @param date Date 객체, ISO 문자열, 또는 타임스탬프
 * @returns 포맷팅된 날짜 문자열 (예: "2024.01.15")
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ""
  }
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}.${month}.${day}`
}

/**
 * 날짜를 YYYY-MM-DD HH:mm:ss 형식으로 포맷팅하는 순수함수
 * @param date Date 객체, ISO 문자열, 또는 타임스탬프
 * @returns 포맷팅된 날짜시간 문자열 (예: "2024-01-15 14:30:00")
 */
export const formatDateTime = (date: Date | string | number): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ""
  }
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  const seconds = String(d.getSeconds()).padStart(2, "0")
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 날짜를 상대적 시간으로 포맷팅하는 순수함수 (예: "3일 전", "2시간 전")
 * @param date Date 객체, ISO 문자열, 또는 타임스탬프
 * @returns 상대적 시간 문자열
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  const d = new Date(date)
  if (isNaN(d.getTime())) {
    return ""
  }
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)
  
  if (years > 0) return `${years}년 전`
  if (months > 0) return `${months}개월 전`
  if (weeks > 0) return `${weeks}주 전`
  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return "방금 전"
}
