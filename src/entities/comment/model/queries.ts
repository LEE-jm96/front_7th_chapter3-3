import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commentApi } from "../api/api"
import { CreateCommentDto, UpdateCommentDto } from "./types"

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => [...commentKeys.all, "post", postId] as const,
}

// 게시물별 댓글 조회
export const useCommentsQuery = (postId: number | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: commentKeys.byPost(postId!),
    queryFn: () => commentApi.getCommentsByPostId(postId!),
    enabled: enabled && !!postId,
  })
}

// 댓글 추가 (낙관적 업데이트)
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentApi.createComment(data),
    // 낙관적 업데이트
    onMutate: async (newComment) => {
      const queryKey = commentKeys.byPost(newComment.postId!)
      await queryClient.cancelQueries({ queryKey })

      const previousComments = queryClient.getQueryData(queryKey)
      const tempId = `temp-${Date.now()}` // 임시 ID 생성

      // 즉시 UI에 추가 (likes는 항상 0으로 시작)
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        comments: [
          ...(old?.comments || []),
          { 
            id: tempId, 
            ...newComment, 
            likes: 0,  // 명시적으로 0 설정
            user: { id: newComment.userId, username: "You" } 
          },
        ],
      }))

      return { previousComments, postId: newComment.postId!, tempId }
    },
    onSuccess: (data, _variables, context) => {
      // 서버 응답 데이터로 캐시 직접 업데이트 (invalidate 대신)
      if (context?.postId && context?.tempId) {
        queryClient.setQueryData(commentKeys.byPost(context.postId), (old: any) => {
          if (!old) return old
          // 임시 댓글을 서버 응답 댓글로 교체
          // 서버 응답에 likes가 없으면 기본값 0 설정
          const serverComment = {
            ...data,
            likes: data.likes ?? 0,
          }
          const filteredComments = old.comments.filter((c: any) => c.id !== context.tempId)
          return {
            ...old,
            comments: [...filteredComments, serverComment],
          }
        })
      }
    },
    onError: (err, newComment, context) => {
      if (context?.previousComments && newComment.postId) {
        queryClient.setQueryData(commentKeys.byPost(newComment.postId), context.previousComments)
      }
      console.error("댓글 추가 실패:", err)
    },
  })
}

// 댓글 수정
export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCommentDto }) => commentApi.updateComment(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(data.postId) })
    },
    onError: (err) => {
      console.error("댓글 수정 실패:", err)
    },
  })
}

// 댓글 좋아요 (낙관적 업데이트)
// DummyJSON API는 댓글 좋아요를 지원하지 않으므로 클라이언트 사이드에서만 처리
export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, likes, postId }: { id: number; likes: number; postId: number }) => {
      // DummyJSON API가 댓글 좋아요를 지원하지 않으므로 클라이언트에서만 처리
      // 실제 서버 API가 있다면 여기서 호출
      // try {
      //   const response = await commentApi.patchComment(id, { likes })
      //   return response
      // } catch (error) {
      //   throw error
      // }
      
      // 클라이언트 사이드에서만 처리 (서버 동기화 없음)
      // 낙관적 업데이트만으로 충분
      return Promise.resolve({ id, likes, postId } as any)
    },
    // 낙관적 업데이트
    onMutate: async ({ id, likes, postId }) => {
      const queryKey = commentKeys.byPost(postId)
      await queryClient.cancelQueries({ queryKey })

      const previousComments = queryClient.getQueryData(queryKey)

      // 즉시 likes 증가 표시
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        comments: old?.comments?.map((c: any) => (c.id === id ? { ...c, likes } : c)),
      }))

      return { previousComments, postId }
    },
    // 클라이언트 사이드에서만 처리하므로 onSuccess는 불필요
    // onMutate에서 이미 업데이트되었음
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPost(variables.postId), context.previousComments)
      }
      console.error("댓글 좋아요 실패:", err)
    },
  })
}

// 댓글 삭제 (낙관적 업데이트)
export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postId: _postId }: { id: number; postId: number }) => commentApi.deleteComment(id),
    // 낙관적 업데이트
    onMutate: async ({ id, postId }) => {
      const queryKey = commentKeys.byPost(postId)
      await queryClient.cancelQueries({ queryKey })

      const previousComments = queryClient.getQueryData(queryKey)

      // 즉시 UI에서 제거
      queryClient.setQueryData(queryKey, (old: any) => ({
        ...old,
        comments: old?.comments?.filter((c: any) => c.id !== id),
      }))

      return { previousComments }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byPost(variables.postId) })
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPost(variables.postId), context.previousComments)
      }
      console.error("댓글 삭제 실패:", err)
    },
  })
}
