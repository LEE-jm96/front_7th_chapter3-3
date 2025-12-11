import { useCallback } from "react"
import { useCreatePostMutation } from "../../../entities/post"

export const useAddPost = () => {
  const createPostMutation = useCreatePostMutation()

  const addPost = useCallback(
    async (data: any) => {
      return await createPostMutation.mutateAsync(data)
    },
    [createPostMutation],
  )

  return { addPost }
}
