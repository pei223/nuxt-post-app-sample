export const convertCreatedAtForDisplay = (createdAtStr: string) => {
  const now = new Date(Date.now())
  const createdDate = new Date(Date.parse(createdAtStr))
  const diffTime = now.getTime() - createdDate.getTime()
  const dayMs = 24 * 60 * 60 * 1000

  if (diffTime < 1000 * 60 * 60) {
    return `${Math.ceil(diffTime / (1000 * 60))}分前`
  }
  if (diffTime < dayMs) {
    return `${Math.ceil((diffTime / 1000) * 60 * 60)}時間前`
  }
  if (diffTime < dayMs * 31) {
    return `${Math.ceil(diffTime / dayMs)}日前`
  }
  if (diffTime < dayMs * 365) {
    return `${
      now.getMonth() - createdDate.getMonth() > 0
        ? now.getDate() - createdDate.getMonth()
        : now.getMonth() - createdDate.getMonth() + 12
    }ヶ月`
  }
  return `${now.getFullYear() - createdDate.getFullYear()}年前`
}

export const convertToFormatDateStr = (dateStr: string) => {
  const date = new Date(Date.parse(dateStr))
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}
