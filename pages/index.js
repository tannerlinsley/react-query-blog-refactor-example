import React from 'react'

import { Wrapper, Sidebar, Main } from '../components/styled'
import PostForm from '../components/PostForm'

import usePosts from '../hooks/usePosts'
import useInfinitePosts from '../hooks/useInfinitePosts'
import usePost from '../hooks/usePost'
import useCreatePost from '../hooks/useCreatePost'
import useSavePost from '../hooks/useSavePost'
import useDeletePost from '../hooks/useDeletePost'

function App() {
  const [activePostId, setActivePostId] = React.useState()

  return (
    <Wrapper>
      <Sidebar>
        <a href="#" onClick={() => setActivePostId()}>
          All Posts
        </a>
        <hr />
        <Stats setActivePostId={setActivePostId} />
      </Sidebar>
      <Main>
        {activePostId ? (
          <Post activePostId={activePostId} setActivePostId={setActivePostId} />
        ) : (
          <Posts setActivePostId={setActivePostId} />
        )}
      </Main>
    </Wrapper>
  )
}

function Posts({ setActivePostId }) {
  const {
    status,
    data: postPages,
    error,
    isFetching,
    isFetchingMore,
    canFetchMore,
    fetchMore,
  } = useInfinitePosts()

  const [createPost, { status: createPostStatus }] = useCreatePost()

  return (
    <section>
      <div>
        <div>
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : status === 'error' ? (
            <span>Error: {error.message}</span>
          ) : (
            <>
              <h3>
                Posts{' '}
                {isFetching && !isFetchingMore ? (
                  <small>Updating...</small>
                ) : null}
              </h3>
              <div>
                {postPages.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.items.map((post) => (
                      <div key={post.id}>
                        <a href="#" onClick={() => setActivePostId(post.id)}>
                          {post.title}
                        </a>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <br />
              <button onClick={() => fetchMore()} disabled={!canFetchMore}>
                {isFetchingMore
                  ? 'Loading more...'
                  : canFetchMore
                  ? 'Load More'
                  : 'Nothing more to load'}
              </button>
            </>
          )}
        </div>
      </div>
      <hr />
      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={createPost}
            submitText={
              createPostStatus === 'loading'
                ? 'Saving...'
                : createPostStatus === 'error'
                ? 'Error!'
                : createPostStatus === 'success'
                ? 'Saved!'
                : 'Create Post'
            }
          />
        </div>
      </div>
    </section>
  )
}

function Post({ activePostId, setActivePostId }) {
  const { status, data: post, error, isFetching } = usePost(activePostId)
  const [savePost, { status: savePostStatus }] = useSavePost()
  const [deletePost, { status: deletePostStatus }] = useDeletePost()

  const onDelete = async () => {
    deletePost(post.id)
    setActivePostId()
  }

  return (
    <>
      {status === 'loading' ? (
        <span>Loading...</span>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <div>
          <h3>
            {post.title} {isFetching ? <small> Updating...</small> : null}
          </h3>
          <small>{post.id}</small>
          <div>
            <p>Post ID: {post.content}</p>
          </div>

          <hr />

          <PostForm
            initialValues={post}
            onSubmit={savePost}
            submitText={
              savePostStatus === 'loading'
                ? 'Saving...'
                : savePostStatus === 'error'
                ? 'Error!'
                : savePostStatus === 'success'
                ? 'Saved!'
                : 'Update Post'
            }
          />

          <br />

          <button onClick={onDelete}>
            {deletePostStatus === 'loading' ? '...' : 'Delete Post'}
          </button>
        </div>
      )}
    </>
  )
}

function Stats({ setActivePostId }) {
  const { data: posts, status: postsStatus, error: postsError } = usePosts()

  const [postId, setPostId] = React.useState()
  const { data: post, status: postStatus, error: postError } = usePost(postId)

  return (
    <div>
      <div>
        Total Posts:{' '}
        {postsStatus === 'loading'
          ? '...'
          : postsStatus === 'error'
          ? postsError.message
          : posts.length}
      </div>
      <hr />
      <div>
        <div>
          Search Post ID:{' '}
          <input value={postId} onChange={(e) => setPostId(e.target.value)} />
        </div>
        <br />
        {postId ? (
          <div>
            {postStatus === 'loading' ? (
              <span>Loading...</span>
            ) : postStatus === 'error' ? (
              <span>Error: {postError.message}</span>
            ) : (
              <div>
                <small>Found:</small>
                <br />
                <a href="#" onClick={() => setActivePostId(post.id)}>
                  {post.title}
                </a>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default App
