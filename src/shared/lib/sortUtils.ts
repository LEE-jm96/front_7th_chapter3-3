import { Post } from "../../entities/post/model/types"

/**
 * 게시물을 reactions(좋아요) 기준으로 정렬하는 순수함수
 * @param posts 정렬할 게시물 배열
 * @param order 정렬 순서 ('asc' | 'desc')
 * @returns 정렬된 새로운 게시물 배열 (원본 배열은 변경하지 않음)
 */
export const sortPostsByReactions = (posts: Post[], order: "asc" | "desc"): Post[] => {
  return [...posts].sort((a, b) => {
    const aLikes = a.reactions?.likes || 0
    const bLikes = b.reactions?.likes || 0
    
    return order === "asc" ? aLikes - bLikes : bLikes - aLikes
  })
}
