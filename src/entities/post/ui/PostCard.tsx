import { ThumbsDown, ThumbsUp } from "lucide-react"
import { Post } from "../model/types"

interface PostCardProps {
  post: Post
  searchQuery?: string
  selectedTag?: string
  onTagClick?: (tag: string) => void
  highlightText?: (text: string, highlight: string) => React.ReactNode
}

export const PostCard = ({ post, searchQuery = "", selectedTag = "", onTagClick, highlightText }: PostCardProps) => {
  const renderText = (text: string) => {
    if (highlightText) {
      return highlightText(text, searchQuery)
    }
    return text
  }

  return (
    <div className="space-y-1">
      <div>{renderText(post.title)}</div>
      <div className="flex flex-wrap gap-1">
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
              selectedTag === tag
                ? "text-white bg-blue-500 hover:bg-blue-600"
                : "text-blue-800 bg-blue-100 hover:bg-blue-200"
            }`}
            onClick={() => onTagClick?.(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export const PostReactions = ({ post }: { post: Post }) => {
  return (
    <div className="flex items-center gap-2">
      <ThumbsUp className="w-4 h-4" />
      <span>{post.reactions?.likes || 0}</span>
      <ThumbsDown className="w-4 h-4" />
      <span>{post.reactions?.dislikes || 0}</span>
    </div>
  )
}

