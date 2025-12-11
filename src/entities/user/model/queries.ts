import { useQuery } from "@tanstack/react-query"
import { userApi } from "../api/api"

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (limit: number, select: string) => [...userKeys.lists(), { limit, select }] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
}

// 사용자 목록 조회
export const useUsersQuery = (limit: number = 0, select: string = "username,image") => {
  return useQuery({
    queryKey: userKeys.list(limit, select),
    queryFn: () => userApi.getUsers(limit, select),
  })
}

// 특정 사용자 조회
export const useUserQuery = (userId: number | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(userId!),
    queryFn: () => userApi.getUserById(userId!),
    enabled: enabled && !!userId,
  })
}

