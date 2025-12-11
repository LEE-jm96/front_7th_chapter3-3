import { Comment, CommentsResponse, CreateCommentDto, UpdateCommentDto } from "../model/types"

export const commentApi = {
  // 게시물의 댓글 가져오기
  getCommentsByPostId: async (postId: number): Promise<CommentsResponse> => {
    const response = await fetch(`/api/comments/post/${postId}`)
    return response.json()
  },

  // 댓글 추가
  createComment: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await fetch("/api/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 댓글 수정
  updateComment: async (id: number, data: UpdateCommentDto): Promise<Comment> => {
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 댓글 부분 수정 (좋아요 등)
  patchComment: async (id: number, data: UpdateCommentDto): Promise<Comment> => {
    // DummyJSON API는 PATCH를 지원하지 않으므로 PUT 사용
    const response = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`댓글 좋아요 실패: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  // 댓글 삭제
  deleteComment: async (id: number): Promise<void> => {
    await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    })
  },
}

