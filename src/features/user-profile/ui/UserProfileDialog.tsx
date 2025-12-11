import { useEffect } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { selectedUserAtom, useUserQuery } from "../../../entities/user"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const UserProfileDialog = ({ open, onOpenChange }: UserProfileDialogProps) => {
  const selectedUser = useAtomValue(selectedUserAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)
  
  // 선택된 사용자의 상세 정보 가져오기
  const { data: userDetail } = useUserQuery(selectedUser?.id, open && !!selectedUser?.id)

  // 상세 정보가 로드되면 atom 업데이트
  useEffect(() => {
    if (userDetail) {
      setSelectedUser(userDetail)
    }
  }, [userDetail, setSelectedUser])

  const user = userDetail || selectedUser

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img src={user?.image} alt={user?.username} className="w-24 h-24 rounded-full mx-auto" />
          <h3 className="text-xl font-semibold text-center">{user?.username}</h3>
          <div className="space-y-2">
            <p>
              <strong>이름:</strong> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <strong>나이:</strong> {user?.age}
            </p>
            <p>
              <strong>이메일:</strong> {user?.email}
            </p>
            <p>
              <strong>전화번호:</strong> {user?.phone}
            </p>
            <p>
              <strong>주소:</strong> {user?.address?.address}, {user?.address?.city}, {user?.address?.state}
            </p>
            <p>
              <strong>직장:</strong> {user?.company?.name} - {user?.company?.title}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
