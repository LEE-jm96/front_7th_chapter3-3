import { User } from "../model/types"

interface UserAvatarProps {
  user?: User
  onClick?: (user: User) => void
}

export const UserAvatar = ({ user, onClick }: UserAvatarProps) => {
  if (!user) return null

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer"
      onClick={() => onClick?.(user)}
    >
      <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
      <span>{user.username}</span>
    </div>
  )
}

