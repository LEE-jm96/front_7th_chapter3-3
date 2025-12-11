import { useAtomValue } from "jotai"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { selectedPostAtom } from "../../../entities/post"
import { highlightText } from "../../../shared/lib"
import { searchQueryAtom } from "../../post-search"

interface PostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

export const PostDetailDialog = ({ open, onOpenChange, children }: PostDetailDialogProps) => {
  const post = useAtomValue(selectedPostAtom)
  const searchQuery = useAtomValue(searchQueryAtom)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title || "", searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body || "", searchQuery)}</p>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
