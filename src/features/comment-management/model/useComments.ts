import { useCallback } from "react"
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  CreateCommentDto,
} from "../../../entities/comment"

export const useComments = () => {
  const createCommentMutation = useCreateCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()

  const addComment = useCallback(
    async (data: CreateCommentDto) => {
      return await createCommentMutation.mutateAsync(data)
    },
    [createCommentMutation],
  )

  const updateComment = useCallback(
    async (comment: { id: number; body: string; postId: number }) => {
      return await updateCommentMutation.mutateAsync({
        id: comment.id,
        data: { body: comment.body },
      })
    },
    [updateCommentMutation],
  )

  const deleteComment = useCallback(
    async (id: number, postId: number) => {
      await deleteCommentMutation.mutateAsync({ id, postId })
    },
    [deleteCommentMutation],
  )

  const likeComment = useCallback(
    async (id: number, postId: number, currentLikes: number) => {
      await likeCommentMutation.mutateAsync({
        id,
        postId,
        likes: currentLikes + 1,
      })
    },
    [likeCommentMutation],
  )

  return {
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}
