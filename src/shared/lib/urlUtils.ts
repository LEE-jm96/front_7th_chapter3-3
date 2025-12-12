/**
 * 게시물 목록 URL 파라미터 타입
 */
export interface PostListParams {
  skip: number
  limit: number
  search: string
  sortBy: string
  order: string
  tag: string
}

/**
 * URL search string을 파싱하여 PostListParams 객체로 변환하는 순수함수
 * @param search URL search string (예: "?skip=0&limit=10&search=test")
 * @returns 파싱된 파라미터 객체
 */
export const parsePostListParams = (search: string): PostListParams => {
  const params = new URLSearchParams(search)
  return {
    skip: parseInt(params.get("skip") || "0", 10),
    limit: parseInt(params.get("limit") || "10", 10),
    search: params.get("search") || "",
    sortBy: params.get("sortBy") || "none",
    order: params.get("order") || "asc",
    tag: params.get("tag") || "",
  }
}

/**
 * PostListParams 객체를 URL query string으로 변환하는 순수함수
 * @param params 파라미터 객체 (부분 객체도 가능)
 * @returns URL query string (예: "skip=0&limit=10&search=test")
 */
export const buildPostListUrl = (params: Partial<PostListParams>): string => {
  const urlParams = new URLSearchParams()
  
  if (params.skip !== undefined && params.skip > 0) {
    urlParams.set("skip", params.skip.toString())
  }
  if (params.limit !== undefined && params.limit !== 10) {
    urlParams.set("limit", params.limit.toString())
  }
  if (params.search) {
    urlParams.set("search", params.search)
  }
  if (params.sortBy && params.sortBy !== "none") {
    urlParams.set("sortBy", params.sortBy)
  }
  if (params.order && params.order !== "asc") {
    urlParams.set("order", params.order)
  }
  if (params.tag) {
    urlParams.set("tag", params.tag)
  }
  
  return urlParams.toString()
}
