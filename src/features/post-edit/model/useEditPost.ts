import { useCallback } from "react"
import { useUpdatePostMutation, Post } from "../../../entities/post"

export const useEditPost = () => {
  const updatePostMutation = useUpdatePostMutation()

  const updatePost = useCallback(
    async (post: Post) => {
      return await updatePostMutation.mutateAsync({
        id: post.id,
        data: { title: post.title, body: post.body },
      })
    },
    [updatePostMutation],
  )

  return { updatePost }
}
