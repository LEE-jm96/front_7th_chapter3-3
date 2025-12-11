import { Tag } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib"

export const tagApi = {
  // 태그 목록 가져오기
  getTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/tags`)
    return response.json()
  },
}

