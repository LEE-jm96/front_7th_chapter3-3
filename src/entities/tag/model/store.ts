import { atom } from "jotai"
import { Tag } from "./types"

// 태그 목록 상태
export const tagsAtom = atom<Tag[]>([])

