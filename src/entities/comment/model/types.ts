export interface Comment {
  id: number
  body: string
  postId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

export interface CommentsResponse {
  comments: Comment[]
  total: number
  skip: number
  limit: number
}

export interface CreateCommentDto {
  body: string
  postId: number
  userId: number
}

export interface UpdateCommentDto {
  body?: string
  likes?: number
}

