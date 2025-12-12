import { Post } from "../../entities/post/model/types"
import { User } from "../../entities/user/model/types"

/**
 * 게시물 배열에 작성자 정보를 추가하는 순수함수
 * @param posts 게시물 배열
 * @param users 사용자 배열
 * @returns 작성자 정보가 추가된 새로운 게시물 배열 (원본 배열은 변경하지 않음)
 */
export const enrichPostsWithAuthors = (posts: Post[], users: User[]): Post[] => {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }))
}
