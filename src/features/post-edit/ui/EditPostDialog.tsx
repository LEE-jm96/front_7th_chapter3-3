import { useEffect, useState } from "react"
import { useAtomValue } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { Post, selectedPostAtom } from "../../../entities/post"

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (post: Post) => Promise<any>
}

export const EditPostDialog = ({ open, onOpenChange, onSubmit }: EditPostDialogProps) => {
  const post = useAtomValue(selectedPostAtom)
  const [editedPost, setEditedPost] = useState<Post | null>(null)

  useEffect(() => {
    if (post) {
      setEditedPost(post)
    }
  }, [post])

  const handleSubmit = async () => {
    if (editedPost) {
      await onSubmit(editedPost)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={editedPost?.title || ""}
            onChange={(e) => setEditedPost(editedPost ? { ...editedPost, title: e.target.value } : null)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={editedPost?.body || ""}
            onChange={(e) => setEditedPost(editedPost ? { ...editedPost, body: e.target.value } : null)}
          />
          <Button onClick={handleSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
