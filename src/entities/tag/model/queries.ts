import { useQuery } from "@tanstack/react-query"
import { tagApi } from "../api/api"

// Query Keys
export const tagKeys = {
  all: ["tags"] as const,
}

// 태그 목록 조회
export const useTagsQuery = () => {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: () => tagApi.getTags(),
  })
}

