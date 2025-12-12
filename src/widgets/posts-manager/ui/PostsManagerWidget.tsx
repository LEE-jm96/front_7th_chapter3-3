import { useEffect, useRef } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui"
import { selectedPostAtom, Post } from "../../../entities/post"
import { User, selectedUserAtom } from "../../../entities/user"
import { useCommentsQuery } from "../../../entities/comment"
import { PostTable, usePostList, skipAtom, limitAtom } from "../../../features/post-list"
import { PostSearchControls, searchQueryAtom, selectedTagAtom, sortByAtom, orderAtom, useTags } from "../../../features/post-search"
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
import { parsePostListParams, buildPostListUrl } from "../../../shared/lib"

export const PostsManagerWidget = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isInitialMount = useRef(true)
  const isInitialized = useRef(false)

  // Atoms
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [order, setOrder] = useAtom(orderAtom)
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

  // 초기 마운트 시 URL 파라미터를 먼저 읽어서 atom 설정
  useEffect(() => {
    if (isInitialized.current) return
    
    // 순수함수를 사용하여 URL 파라미터 파싱
    const urlParams = parsePostListParams(location.search)
    
    // atom 설정 (동기적으로 실행되지만 다음 렌더에서 반영됨)
    setSkip(urlParams.skip)
    setLimit(urlParams.limit)
    setSearchQuery(urlParams.search)
    setSortBy(urlParams.sortBy)
    setOrder(urlParams.order)
    setSelectedTag(urlParams.tag)
    
    isInitialized.current = true
    
    // 다음 렌더 사이클에서 초기 마운트 완료로 표시
    setTimeout(() => {
      isInitialMount.current = false
    }, 0)
  }, [])

  // TanStack Query hooks (atom이 초기화된 후에 호출)
  useTags() // 태그 목록 자동 로드 및 atom 동기화
  const { error, deletePost } = usePostList()
  const { addPost } = useAddPost()
  const { updatePost } = useEditPost()
  const { addComment, updateComment, deleteComment, likeComment } = useComments()
  
  // 댓글 쿼리 (게시물 상세 모달용)
  const { data: commentsData } = useCommentsQuery(selectedPost?.id)

  // URL 업데이트
  const updateURL = () => {
    // 순수함수를 사용하여 URL 생성
    const queryString = buildPostListUrl({
      skip,
      limit,
      search: searchQuery,
      sortBy,
      order,
      tag: selectedTag,
    })
    navigate(`?${queryString}`)
  }

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


  // 상태 변경 시 URL 업데이트
  useEffect(() => {
    if (isInitialMount.current) return
    updateURL()
  }, [skip, limit, sortBy, order, selectedTag])

  // URL 변경 감지 (뒤로가기/앞으로가기)
  useEffect(() => {
    if (isInitialMount.current) return

    // 순수함수를 사용하여 URL 파라미터 파싱
    const urlParams = parsePostListParams(location.search)
    setSkip(urlParams.skip)
    setLimit(urlParams.limit)
    setSearchQuery(urlParams.search)
    setSortBy(urlParams.sortBy)
    setOrder(urlParams.order)
    setSelectedTag(urlParams.tag)
  }, [location.search])

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
