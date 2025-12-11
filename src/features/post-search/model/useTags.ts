import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { useTagsQuery, tagsAtom } from "../../../entities/tag"

export const useTags = () => {
  const { data, isLoading } = useTagsQuery()
  const setTags = useSetAtom(tagsAtom)

  // Query 데이터를 atom에 동기화
  useEffect(() => {
    if (data) {
      setTags(data)
    }
  }, [data, setTags])

  return {
    tags: data || [],
    isLoading,
  }
}

