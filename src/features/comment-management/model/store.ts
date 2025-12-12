import { atom } from "jotai"

// 댓글 관련 다이얼로그 상태
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)

// 새 댓글 추가를 위한 postId
export const newCommentPostIdAtom = atom<number | null>(null)
