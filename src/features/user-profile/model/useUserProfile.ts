import { useCallback } from "react"
import { useSetAtom } from "jotai"
import { useUserQuery, selectedUserAtom } from "../../../entities/user"

export const useUserProfile = (userId?: number) => {
  const setSelectedUser = useSetAtom(selectedUserAtom)
  const { data: user, isLoading } = useUserQuery(userId, !!userId)

  const fetchUser = useCallback(
    async (id: number) => {
      // useUserQuery가 자동으로 fetch하므로 여기서는 atom만 업데이트
      const userQuery = useUserQuery(id)
      if (userQuery.data) {
        setSelectedUser(userQuery.data)
      }
    },
    [setSelectedUser],
  )

  return {
    user,
    loading: isLoading,
    fetchUser,
  }
}
