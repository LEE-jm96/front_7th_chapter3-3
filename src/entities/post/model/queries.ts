import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSetAtom } from "jotai"
import { postApi } from "../api/api"
import { CreatePostDto, UpdatePostDto } from "./types"
import { postsAtom } from "./store"

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (limit: number, skip: number, sortBy?: string, order?: string) =>
    [...postKeys.lists(), { limit, skip, sortBy, order }] as const,
  search: (query: string) => [...postKeys.all, "search", query] as const,
  byTag: (tag: string) => [...postKeys.all, "tag", tag] as const,
}

// 게시물 목록 조회
export const usePostsQuery = (limit: number, skip: number, sortBy?: string, order?: string, enabled: boolean = true) => {
  // "none"이나 빈 문자열은 undefined로 변환
  // reactions는 클라이언트 사이드에서 정렬하므로 API에는 전달하지 않음
  const normalizedSortBy = sortBy && sortBy !== "none" && sortBy !== "reactions" ? sortBy : undefined
  // reactions 정렬 시에는 order를 API에 전달하지 않음 (클라이언트에서 처리)
  const normalizedOrder = normalizedSortBy && order && order !== "" ? order : undefined
  
  return useQuery({
    queryKey: postKeys.list(limit, skip, sortBy, order), // 쿼리 키에는 원본 값 사용 (캐시 구분)
    queryFn: () => postApi.getPosts(limit, skip, normalizedSortBy, normalizedOrder),
    enabled,
  })
}

// 게시물 검색
export const useSearchPostsQuery = (query: string, enabled: boolean = true, sortBy?: string, order?: string) => {
  // reactions는 클라이언트 사이드에서 정렬
  const normalizedSortBy = sortBy && sortBy !== "none" && sortBy !== "reactions" ? sortBy : undefined
  const normalizedOrder = normalizedSortBy && order && order !== "" ? order : undefined
  
  return useQuery({
    queryKey: [...postKeys.search(query), { sortBy, order }], // 쿼리 키에는 원본 값 사용
    queryFn: () => postApi.searchPosts(query, normalizedSortBy, normalizedOrder),
    enabled: enabled && !!query,
  })
}

// 태그별 게시물 조회
export const usePostsByTagQuery = (tag: string, enabled: boolean = true, sortBy?: string, order?: string) => {
  // reactions는 클라이언트 사이드에서 정렬
  const normalizedSortBy = sortBy && sortBy !== "none" && sortBy !== "reactions" ? sortBy : undefined
  const normalizedOrder = normalizedSortBy && order && order !== "" ? order : undefined
  
  return useQuery({
    queryKey: [...postKeys.byTag(tag), { sortBy, order }], // 쿼리 키에는 원본 값 사용
    queryFn: () => postApi.getPostsByTag(tag, normalizedSortBy, normalizedOrder),
    enabled: enabled && !!tag && tag !== "all",
  })
}

// 게시물 추가 (낙관적 업데이트)
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient()
  const setPosts = useSetAtom(postsAtom)

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.createPost(data),
    // 낙관적 업데이트
    onMutate: async (newPost) => {
      // 진행 중인 리페칭 취소
      await queryClient.cancelQueries({ queryKey: postKeys.all })

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData(postKeys.all)

      // 임시 ID 생성 (음수로 만들어서 실제 ID와 구분)
      const tempId = -Math.floor(Math.random() * 1000000)

      // 낙관적 업데이트 (즉시 UI 반영)
      setPosts((prev) => [{ id: tempId, ...newPost, reactions: { likes: 0, dislikes: 0 } } as any, ...prev])

      return { previousPosts, tempId }
    },
    // 성공 시 서버 응답으로 교체
    onSuccess: (data, _variables, context) => {
      if (context?.tempId) {
        // 임시 게시물을 서버 응답으로 교체
        setPosts((prev) => {
          const filtered = prev.filter((post) => post.id !== context.tempId)
          return [data, ...filtered]
        })
      } else {
        // fallback: invalidateQueries 사용
        queryClient.invalidateQueries({ queryKey: postKeys.all })
      }
    },
    // 에러 시 롤백
    onError: (err, _newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
      // atom도 롤백
      if (context?.tempId) {
        setPosts((prev) => prev.filter((post) => post.id !== context.tempId))
      }
      console.error("게시물 추가 실패:", err)
    },
  })
}

// 게시물 수정 (낙관적 업데이트)
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()
  const setPosts = useSetAtom(postsAtom)

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostDto }) => postApi.updatePost(id, data),
    // 낙관적 업데이트
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all })

      const previousPosts = queryClient.getQueryData(postKeys.all)

      // 즉시 UI 업데이트
      setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...data } : post)))

      return { previousPosts }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
    onError: (err, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
      console.error("게시물 수정 실패:", err)
    },
  })
}

// 게시물 삭제 (낙관적 업데이트)
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()
  const setPosts = useSetAtom(postsAtom)

  return useMutation({
    mutationFn: (id: number) => postApi.deletePost(id),
    // 낙관적 업데이트
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all })

      const previousPosts = queryClient.getQueryData(postKeys.all)

      // 즉시 UI에서 제거
      setPosts((prev) => prev.filter((post) => post.id !== id))

      return { previousPosts }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
    },
    onError: (err, _id, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.all, context.previousPosts)
      }
      console.error("게시물 삭제 실패:", err)
    },
  })
}
