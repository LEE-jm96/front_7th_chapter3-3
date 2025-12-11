import { Post, PostsResponse, CreatePostDto, UpdatePostDto } from "../model/types"

export const postApi = {
  // 게시물 목록 가져오기
  getPosts: async (
    limit: number,
    skip: number,
    sortBy?: string,
    order?: string,
  ): Promise<PostsResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: skip.toString(),
    })
    
    if (sortBy && sortBy !== "none") {
      params.set("sortBy", sortBy)
    }
    if (order) {
      params.set("order", order)  // sortOrder → order로 변경
    }
    
    const response = await fetch(`/api/posts?${params.toString()}`)
    return response.json()
  },

  // 게시물 검색
  searchPosts: async (query: string, sortBy?: string, order?: string): Promise<PostsResponse> => {
    const params = new URLSearchParams({ q: query })
    if (sortBy && sortBy !== "none") {
      params.set("sortBy", sortBy)
    }
    if (order) {
      params.set("order", order)
    }
    const response = await fetch(`/api/posts/search?${params.toString()}`)
    return response.json()
  },

  // 태그별 게시물 가져오기
  getPostsByTag: async (tag: string, sortBy?: string, order?: string): Promise<PostsResponse> => {
    const params = new URLSearchParams()
    if (sortBy && sortBy !== "none") {
      params.set("sortBy", sortBy)
    }
    if (order) {
      params.set("order", order)
    }
    const queryString = params.toString()
    const url = `/api/posts/tag/${tag}${queryString ? `?${queryString}` : ""}`
    const response = await fetch(url)
    return response.json()
  },

  // 게시물 추가
  createPost: async (data: CreatePostDto): Promise<Post> => {
    const response = await fetch("/api/posts/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 게시물 수정
  updatePost: async (id: number, data: UpdatePostDto): Promise<Post> => {
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<void> => {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    })
  },
}

