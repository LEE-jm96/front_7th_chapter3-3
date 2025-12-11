import { atom } from "jotai"
import { User } from "./types"

// 선택된 사용자 상태
export const selectedUserAtom = atom<User | null>(null)

