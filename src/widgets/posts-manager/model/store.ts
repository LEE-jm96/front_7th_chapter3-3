import { atom } from "jotai"

// 다이얼로그 상태
export const showAddDialogAtom = atom<boolean>(false)
export const showEditDialogAtom = atom<boolean>(false)
export const showPostDetailDialogAtom = atom<boolean>(false)
export const showUserModalAtom = atom<boolean>(false)
export const showAddCommentDialogAtom = atom<boolean>(false)
export const showEditCommentDialogAtom = atom<boolean>(false)

// 새 댓글 추가를 위한 postId
export const newCommentPostIdAtom = atom<number | null>(null)

