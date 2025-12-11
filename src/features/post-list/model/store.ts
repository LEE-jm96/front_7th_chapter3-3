import { atom } from "jotai"

// 게시물 목록 관련 상태
export const loadingAtom = atom<boolean>(false)
export const skipAtom = atom<number>(0)
export const limitAtom = atom<number>(10)

