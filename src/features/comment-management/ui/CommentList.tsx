import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useSetAtom, useAtomValue } from "jotai"
import { Button } from "../../../shared/ui"
import { Comment, selectedCommentAtom } from "../../../entities/comment"
import { highlightText } from "../../../shared/lib"
import { searchQueryAtom } from "../../post-search"
import { showAddCommentDialogAtom, showEditCommentDialogAtom, newCommentPostIdAtom } from "../../../widgets/posts-manager"

interface CommentListProps {
  postId: number
  comments: Comment[]
  onDeleteComment: (id: number, postId: number) => void
  onLikeComment: (id: number, postId: number) => void
}

export const CommentList = ({ postId, comments, onDeleteComment, onLikeComment }: CommentListProps) => {
  const searchQuery = useAtomValue(searchQueryAtom)
  const setShowAddCommentDialog = useSetAtom(showAddCommentDialogAtom)
  const setShowEditCommentDialog = useSetAtom(showEditCommentDialogAtom)
  const setSelectedComment = useSetAtom(selectedCommentAtom)
  const setNewCommentPostId = useSetAtom(newCommentPostIdAtom)

  const handleAddComment = () => {
    setNewCommentPostId(postId)
    setShowAddCommentDialog(true)
  }

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
