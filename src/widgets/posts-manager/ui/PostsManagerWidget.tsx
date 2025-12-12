import { Plus } from "lucide-react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui"
import { selectedPostAtom, Post } from "../../../entities/post"
import { User, selectedUserAtom } from "../../../entities/user"
import { useCommentsQuery } from "../../../entities/comment"
import { PostTable, usePostList } from "../../../features/post-list"
import { PostSearchControls, selectedTagAtom, useTags } from "../../../features/post-search"
import { AddPostDialog, useAddPost } from "../../../features/post-add"
import { EditPostDialog, useEditPost } from "../../../features/post-edit"
import { PostDetailDialog } from "../../../features/post-detail"
import { CommentList, AddCommentDialog, EditCommentDialog, useComments } from "../../../features/comment-management"
import { UserProfileDialog } from "../../../features/user-profile"
import { Pagination } from "../../../features/pagination"
import {
  showAddDialogAtom,
  showEditDialogAtom,
  showPostDetailDialogAtom,
  showUserModalAtom,
  showAddCommentDialogAtom,
  showEditCommentDialogAtom,
} from "../model/store"
import { useUrlSync } from "../model/useUrlSync"

export const PostsManagerWidget = () => {
  // URL 동기화 (URL ↔ atoms)
  useUrlSync()

  // Atoms
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const setSelectedPost = useSetAtom(selectedPostAtom)
  const selectedPost = useAtomValue(selectedPostAtom)
  const setSelectedUser = useSetAtom(selectedUserAtom)

  // Dialog atoms
  const [showAddDialog, setShowAddDialog] = useAtom(showAddDialogAtom)
  const [showEditDialog, setShowEditDialog] = useAtom(showEditDialogAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)
  const [showUserModal, setShowUserModal] = useAtom(showUserModalAtom)
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)

  // TanStack Query hooks
  useTags() // 태그 목록 자동 로드 및 atom 동기화
  const { error, deletePost } = usePostList()
  const { addPost } = useAddPost()
  const { updatePost } = useEditPost()
  const { addComment, updateComment, deleteComment, likeComment } = useComments()

  // 댓글 쿼리 (게시물 상세 모달용)
  const { data: commentsData } = useCommentsQuery(selectedPost?.id)

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = (user: User) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  // 태그 선택 핸들러
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
  }

  // 검색 핸들러
  const handleSearch = () => {
    // searchQuery atom이 이미 업데이트되어 있으므로
    // usePostList에서 자동으로 처리됨
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostSearchControls onSearchSubmit={handleSearch} onTagChange={handleTagSelect} />

          {error && (
            <div className="flex justify-center p-4 text-red-600">
              오류가 발생했습니다: {error.message}
            </div>
          )}

          <PostTable
            onTagClick={handleTagSelect}
            onPostDetail={openPostDetail}
            onPostEdit={(post) => {
              setSelectedPost(post)
              setShowEditDialog(true)
            }}
            onPostDelete={deletePost}
            onUserClick={openUserModal}
          />

          <Pagination />
        </div>
      </CardContent>

      <AddPostDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={addPost} />

      <EditPostDialog open={showEditDialog} onOpenChange={setShowEditDialog} onSubmit={updatePost} />

      <AddCommentDialog 
        open={showAddCommentDialog} 
        onOpenChange={setShowAddCommentDialog} 
        onSubmit={addComment}
        postId={selectedPost?.id}
      />

      <EditCommentDialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog} onSubmit={updateComment} />

      <PostDetailDialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        {selectedPost && commentsData && (
          <CommentList
            postId={selectedPost.id}
            comments={commentsData.comments}
            onDeleteComment={deleteComment}
            onLikeComment={(id, postId) => {
              const comment = commentsData.comments.find((c) => c.id === id)
              if (comment) {
                // likes가 null이거나 undefined인 경우 0으로 처리
                const currentLikes = comment.likes ?? 0
                likeComment(id, postId, currentLikes)
              }
            }}
          />
        )}
      </PostDetailDialog>

      <UserProfileDialog open={showUserModal} onOpenChange={setShowUserModal} />
    </Card>
  )
}
