import { PostList } from '../domain/post'
import { baseApi } from './baseApi'

export type PostBody = {
  title: string
  content: string
  expose: boolean
}

export const getMyPosts = async (
  accessToken: string,
  page: number
): Promise<PostList> => {
  const result = await baseApi.get<PostList>(`/posts/me?page=${page}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return result.data
}

export const registerPost = async (
  accessToken: string,
  postBody: PostBody
): Promise<void> => {
  await baseApi.post(`/posts/`, postBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
