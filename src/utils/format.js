export const formatNumber = (num) => new Intl.NumberFormat('ko-KR').format(num)
export const formatPercent = (num) => `${num > 0 ? '▲' : '▼'} ${Math.abs(num).toFixed(1)}%`
export const formatCurrency = (num) => `${formatNumber(num)}원`

export const formatDateLabel = (d = new Date()) => {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}. ${m}. ${day}.`
}

export const formatDateForAPI = (dateStr) => {
  return dateStr.replace(/\.\s*/g, '').replace(/\s/g, '')
}

