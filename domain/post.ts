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

export type PostList = {
  posts: Post[]
  totalPage: number
}
