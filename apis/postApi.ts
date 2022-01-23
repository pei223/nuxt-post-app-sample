import { fetcher } from './baseApi'

export type PostBody = {
  title: string
  content: string
  expose: boolean
}

export type Author = {
  id: number
  name: string
  email: string
  updatedAt: string
  createdAt: string
}
export type Post = {
  id: number
  title: string
  content: string
  expose: boolean
  createdAt: string
  updatedAt: string
  author: Author
}

export type PostsRes = {
  posts: Post[]
  totalPage: number
}

export const getMyPosts = async (
  accessToken: string,
  page: number
): Promise<PostsRes> => {
  const result = await fetcher.get<PostsRes>(`/posts/me?page=${page}`, {
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
  await fetcher.post(`/posts/`, postBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
