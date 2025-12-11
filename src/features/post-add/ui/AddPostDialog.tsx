import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../shared/ui"
import { CreatePostDto } from "../../../entities/post"

interface AddPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreatePostDto) => Promise<any>
}

export const AddPostDialog = ({ open, onOpenChange, onSubmit }: AddPostDialogProps) => {
  const [newPost, setNewPost] = useState<CreatePostDto>({ title: "", body: "", userId: 1 })

  const handleSubmit = async () => {
    await onSubmit(newPost)
    setNewPost({ title: "", body: "", userId: 1 })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
