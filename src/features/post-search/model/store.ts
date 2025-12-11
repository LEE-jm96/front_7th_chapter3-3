import { atom } from "jotai"

// 검색 및 필터 상태
export const searchQueryAtom = atom<string>("")
export const sortByAtom = atom<string>("none")  // Select의 기본값과 일치
export const orderAtom = atom<string>("asc")    // Select의 기본값과 일치
export const selectedTagAtom = atom<string>("")

