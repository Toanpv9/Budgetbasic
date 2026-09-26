const numberFormat = new Intl.NumberFormat('en-US')

export const formatVnd = (value) => `${numberFormat.format(Math.round(value || 0))} VND`

export const formatNumber = (value) => numberFormat.format(Math.round(value || 0))

export const parseAmount = (text) => {
  const clean = String(text ?? '').replace(/[,\s]/g, '')
  if (clean === '' || !/^\d+(\.\d+)?$/.test(clean)) return NaN
  return Number(clean)
}
