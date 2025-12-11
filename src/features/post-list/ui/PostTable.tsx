import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { useAtomValue } from "jotai"
import { Post, postsAtom } from "../../../entities/post"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib"
import { searchQueryAtom, selectedTagAtom } from "../../post-search"
import { User } from "../../../entities/user"
import { loadingAtom } from "../model/store"

interface PostTableProps {
  onTagClick: (tag: string) => void
  onPostDetail: (post: Post) => void
  onPostEdit: (post: Post) => void
  onPostDelete: (id: number) => void
  onUserClick: (user: User) => void
}

export const PostTable = ({
  onTagClick,
  onPostDetail,
  onPostEdit,
  onPostDelete,
  onUserClick,
}: PostTableProps) => {
  const posts = useAtomValue(postsAtom)
  const searchQuery = useAtomValue(searchQueryAtom)
  const selectedTag = useAtomValue(selectedTagAtom)
  const isLoading = useAtomValue(loadingAtom)

  if (isLoading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  if (!posts || posts.length === 0) {
    return <div className="flex justify-center p-4">게시물이 없습니다.</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="text-sm">
              {post.id < 0 ? (
                <span className="text-gray-400 italic">임시</span>
              ) : (
                post.id
              )}
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div>{highlightText(post.title, searchQuery)}</div>

                <div className="flex flex-wrap gap-1">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                        selectedTag === tag
                          ? "text-white bg-blue-500 hover:bg-blue-600"
                          : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                      }`}
                      onClick={() => onTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {post.author && (
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onUserClick(post.author!)}>
                  <img src={post.author.image} alt={post.author.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author.username}</span>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.reactions?.likes || 0}</span>
                <ThumbsDown className="w-4 h-4" />
                <span>{post.reactions?.dislikes || 0}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => onPostDetail(post)}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onPostEdit(post)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onPostDelete(post.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
