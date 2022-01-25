import { DEFAULT_DATE_STR } from './common'
import { User } from './UserInfo'

export type Author = User & {
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

export type PostList = {
  posts: Post[]
  totalPage: number
}

export const DEFAULT_AUTHOR: Author = {
  id: -1,
  name: '',
  email: '',
  createdAt: DEFAULT_DATE_STR,
  updatedAt: DEFAULT_DATE_STR,
}

export const DEFAULT_POST: Post = {
  id: -1,
  title: '',
  content: '',
  expose: false,
  createdAt: DEFAULT_DATE_STR,
  updatedAt: DEFAULT_DATE_STR,
  author: DEFAULT_AUTHOR,
}
