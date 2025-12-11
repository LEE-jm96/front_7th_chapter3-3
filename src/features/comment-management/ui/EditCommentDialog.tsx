import { useState, useEffect } from "react"
import { useAtomValue } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { selectedCommentAtom } from "../../../entities/comment"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (comment: any) => Promise<any>
}

export const EditCommentDialog = ({ open, onOpenChange, onSubmit }: EditCommentDialogProps) => {
  const comment = useAtomValue(selectedCommentAtom)
  const [editedComment, setEditedComment] = useState<any>(null)

  useEffect(() => {
    if (comment) {
      setEditedComment(comment)
    }
  }, [comment])

  const handleSubmit = async () => {
    if (editedComment) {
      await onSubmit(editedComment)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={editedComment?.body || ""}
            onChange={(e) => setEditedComment(editedComment ? { ...editedComment, body: e.target.value } : null)}
          />
          <Button onClick={handleSubmit}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
