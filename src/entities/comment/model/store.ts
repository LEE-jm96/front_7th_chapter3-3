import { atom } from "jotai"
import { Comment } from "./types"

// 댓글 상태 (postId를 키로 사용)
export const commentsAtom = atom<Record<number, Comment[]>>({})
export const selectedCommentAtom = atom<Comment | null>(null)

