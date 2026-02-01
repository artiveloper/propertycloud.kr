/**
 * 숫자를 억 단위로 반올림하여 "약 X억" 형태로 반환
 */
export function formatToEok(value: number): string {
  const eok = Math.round(value / 100_000_000)
  return `약 ${eok}억`
}

/**
 * 숫자를 억 단위로 반올림하여 "X억" 형태로 반환 (짧은 버전)
 */
export function formatToEokShort(value: number): string {
  const eok = Math.round(value / 100_000_000)
  return `${eok}억`
}
