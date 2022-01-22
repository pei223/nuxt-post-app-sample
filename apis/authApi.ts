import { fetcher } from './baseApi'

export type LoginBody = {
  name: string
  password: string
}

export type LoginRes = {
  token: string
  id: number
  name: string
  email: string
}

export type SignupBody = {
  name: string
  password: string
  email: string
}

export const loginRequest = async (body: LoginBody): Promise<LoginRes> => {
  const result = await fetcher.post<LoginRes>('/auth/login', body)
  return result.data
}

export const signupRequest = async (body: SignupBody): Promise<LoginRes> => {
  const result = await fetcher.post<LoginRes>(`/auth/signup`, body)
  return result.data
}
