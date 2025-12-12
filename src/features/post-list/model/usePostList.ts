import { useCallback, useEffect } from "react"
import { useSetAtom, useAtomValue } from "jotai"
import {
  usePostsQuery,
  usePostsByTagQuery,
  useSearchPostsQuery,
  useDeletePostMutation,
} from "../../../entities/post"
import { useUsersQuery } from "../../../entities/user"
import { postsAtom, totalPostsAtom } from "../../../entities/post"
import { skipAtom, limitAtom, loadingAtom } from "./store"
import { sortByAtom, orderAtom, searchQueryAtom, selectedTagAtom } from "../../post-search"
import { enrichPostsWithAuthors, sortPostsByReactions } from "../../../shared/lib"

export const usePostList = () => {
  const skip = useAtomValue(skipAtom)
  const limit = useAtomValue(limitAtom)
  const sortBy = useAtomValue(sortByAtom)
  const order = useAtomValue(orderAtom)
  const searchQuery = useAtomValue(searchQueryAtom)
  const selectedTag = useAtomValue(selectedTagAtom)
  
  const setPosts = useSetAtom(postsAtom)
  const setTotal = useSetAtom(totalPostsAtom)
  const setLoading = useSetAtom(loadingAtom)

  // 검색/태그 모드 확인
  const isSearchMode = !!searchQuery
  const isTagMode = !!selectedTag && selectedTag !== "all"

  // 조건부 쿼리 실행 (모든 쿼리에 sortBy와 order 전달)
  // TanStack Query의 캐싱으로 중복 호출 방지
  // enabled를 명시적으로 true로 설정하여 항상 쿼리 실행
  const postsQuery = usePostsQuery(limit, skip, sortBy, order, true)
  const searchResults = useSearchPostsQuery(searchQuery, isSearchMode, sortBy, order)
  const tagResults = usePostsByTagQuery(selectedTag, isTagMode, sortBy, order)
  const usersQuery = useUsersQuery(0, "username,image")

  const deletePostMutation = useDeletePostMutation()

  // 현재 활성화된 쿼리 결정
  const activeQuery = isSearchMode ? searchResults : isTagMode ? tagResults : postsQuery

  // 로딩 상태 동기화
  useEffect(() => {
    setLoading(activeQuery.isLoading || usersQuery.isLoading)
  }, [activeQuery.isLoading, usersQuery.isLoading, setLoading])

  // 데이터 결합 및 atom 업데이트
  useEffect(() => {
    if (activeQuery.data && usersQuery.data) {
      // 순수함수를 사용하여 데이터 변환
      let postsWithUsers = enrichPostsWithAuthors(
        activeQuery.data.posts,
        usersQuery.data.users
      )

      // reactions 정렬은 클라이언트 사이드에서 처리 (API가 지원하지 않을 수 있음)
      if (sortBy === "reactions" && order) {
        postsWithUsers = sortPostsByReactions(postsWithUsers, order as "asc" | "desc")
      }

      setPosts(postsWithUsers)
      setTotal(activeQuery.data.total)
    }
  }, [activeQuery.data, usersQuery.data, sortBy, order, setPosts, setTotal])

  const deletePost = useCallback(
    async (id: number) => {
      try {
        await deletePostMutation.mutateAsync(id)
      } catch (error) {
        // 에러는 mutation의 onError에서 처리됨
      }
    },
    [deletePostMutation],
  )

  return {
    isLoading: activeQuery.isLoading || usersQuery.isLoading,
    error: activeQuery.error || usersQuery.error,
    deletePost,
  }
}
