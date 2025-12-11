import { atom } from "jotai"
import { Post } from "./types"

// 게시물 목록 상태
export const postsAtom = atom<Post[]>([])
export const totalPostsAtom = atom<number>(0)
export const selectedPostAtom = atom<Post | null>(null)

