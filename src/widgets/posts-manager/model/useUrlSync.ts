import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAtom } from "jotai"
import { skipAtom, limitAtom } from "../../../features/post-list"
import { searchQueryAtom, selectedTagAtom, sortByAtom, orderAtom } from "../../../features/post-search"
import { parsePostListParams, buildPostListUrl } from "../../../shared/lib"

/**
 * URL 파라미터와 atoms를 동기화하는 hook
 * - 초기 마운트 시 URL → atoms
 * - atoms 변경 시 → URL 업데이트
 * - 브라우저 뒤로가기/앞으로가기 시 URL → atoms
 */
export const useUrlSync = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isInitialMount = useRef(true)
  const isInitialized = useRef(false)

  // Atoms
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [order, setOrder] = useAtom(orderAtom)
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)

  // 초기 마운트 시 URL 파라미터를 먼저 읽어서 atom 설정
  useEffect(() => {
    if (isInitialized.current) return

    // 순수함수를 사용하여 URL 파라미터 파싱
    const urlParams = parsePostListParams(location.search)

    // atom 설정 (동기적으로 실행되지만 다음 렌더에서 반영됨)
    setSkip(urlParams.skip)
    setLimit(urlParams.limit)
    setSearchQuery(urlParams.search)
    setSortBy(urlParams.sortBy)
    setOrder(urlParams.order)
    setSelectedTag(urlParams.tag)

    isInitialized.current = true

    // 다음 렌더 사이클에서 초기 마운트 완료로 표시
    setTimeout(() => {
      isInitialMount.current = false
    }, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 상태 변경 시 URL 업데이트
  useEffect(() => {
    if (isInitialMount.current) return

    // 순수함수를 사용하여 URL 생성
    const queryString = buildPostListUrl({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      order,
      tag: selectedTag,
    })
    navigate(`?${queryString}`, { replace: true })
  }, [skip, limit, sortBy, order, selectedTag, navigate, searchQuery])

  // URL 변경 감지 (뒤로가기/앞으로가기)
  useEffect(() => {
    if (isInitialMount.current) return

    // 순수함수를 사용하여 URL 파라미터 파싱
    const urlParams = parsePostListParams(location.search)
    setSkip(urlParams.skip)
    setLimit(urlParams.limit)
    setSearchQuery(urlParams.search)
    setSortBy(urlParams.sortBy)
    setOrder(urlParams.order)
    setSelectedTag(urlParams.tag)
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setOrder, setSelectedTag])
}
