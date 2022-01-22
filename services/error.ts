export const ERROR_CODE = {
  networkError: 1,
  unexpectedApiError: 2,
  notFound: 3,
  notAxiosError: 999,
} as const

export type ErrorCode = typeof ERROR_CODE[keyof typeof ERROR_CODE]

export type ErrorFormat = {
  path: string
  code: ErrorCode
}

export const genErrorPath = (path: string, errorCode: ErrorCode) => {
  return `/error?id=${path}-${errorCode}`
}

export const parseErrorId = (id: string): ErrorFormat => {
  const fields = id.split('-')
  return {
    path: fields[0],
    code: Number(fields[1]) as ErrorCode,
  }
}
