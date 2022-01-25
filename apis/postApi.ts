import { Post, PostList } from '../domain/post'
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

export const updatePost = async (
  accessToken: string,
  postId: number,
  postBody: PostBody
): Promise<void> => {
  await baseApi.put(`/posts/${postId}`, postBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const findPost = async (
  accessToken: string | null,
  postId: number
): Promise<Post> => {
  if (accessToken !== '' && accessToken !== null) {
    const res = await baseApi.get<Post>(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return res.data
  } else {
    const res = await baseApi.get<Post>(`/posts/${postId}`)
    return res.data
  }
}

export const deletePost = async (
  accessToken: string | null,
  postId: number
): Promise<void> => {
  await baseApi.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
