import { User, UsersResponse } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib"

export const userApi = {
  // 사용자 목록 가져오기
  getUsers: async (limit: number = 0, select: string = "username,image"): Promise<UsersResponse> => {
    const response = await fetch(`${API_BASE_URL}/users?limit=${limit}&select=${select}`)
    return response.json()
  },

  // 특정 사용자 정보 가져오기
  getUserById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`)
    return response.json()
  },
}

