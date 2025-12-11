import { useState, useEffect } from "react"
import { useAtomValue } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { CreateCommentDto } from "../../../entities/comment"
import { newCommentPostIdAtom } from "../../../widgets/posts-manager"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCommentDto) => Promise<any>
  postId?: number | null
}

export const AddCommentDialog = ({ open, onOpenChange, onSubmit, postId: propPostId }: AddCommentDialogProps) => {
  const atomPostId = useAtomValue(newCommentPostIdAtom)
  // props로 전달된 postId를 우선 사용, 없으면 atom에서 가져옴
  const postId = propPostId !== undefined ? propPostId : atomPostId
  const [newComment, setNewComment] = useState<CreateCommentDto>({ body: "", postId: 0, userId: 1 })

  // 다이얼로그가 열릴 때마다 postId 업데이트
  useEffect(() => {
    if (open && postId !== null && postId !== undefined && postId > 0) {
      setNewComment((prev) => ({ ...prev, postId }))
    }
  }, [open, postId])

  // 다이얼로그가 닫힐 때 초기화
  useEffect(() => {
    if (!open) {
      setNewComment({ body: "", postId: 0, userId: 1 })
    }
  }, [open])

  const handleSubmit = async () => {
    // postId 유효성 검사
    if (!newComment.postId || newComment.postId <= 0) {
      console.error("유효한 postId가 필요합니다:", newComment.postId)
      return
    }

    if (!newComment.body.trim()) {
      console.error("댓글 내용을 입력해주세요")
      return
    }

    try {
      // 낙관적 업데이트 후 즉시 다이얼로그 닫기
      onSubmit(newComment).catch((error) => {
        console.error("댓글 추가 실패:", error)
      })
      // mutation이 완료되기 전에 다이얼로그 닫기 (낙관적 업데이트로 이미 UI에 반영됨)
      setNewComment({ body: "", postId: 0, userId: 1 })
      onOpenChange(false)
    } catch (error) {
      console.error("댓글 추가 실패:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
