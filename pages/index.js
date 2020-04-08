import React from 'react'

import { Wrapper, Sidebar, Main } from '../components/styled'
import PostForm from '../components/PostForm'

import usePosts from '../hooks/usePosts'
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
  const { status, data: posts, error, refetch, isFetching } = usePosts()
  const [createPost, createPostStatus] = useCreatePost()

  const onSubmit = async (values) => {
    try {
      await createPost(values)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

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
              <h3>Posts {isFetching ? <small>Updating...</small> : null}</h3>
              <div>
                {posts.map((post) => (
                  <div key={post.id}>
                    <a href="#" onClick={() => setActivePostId(post.id)}>
                      {post.title}
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <hr />
      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={onSubmit}
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
  const { status, data: post, error, refetch, isFetching } = usePost(
    activePostId
  )
  const [savePost, savePostStatus] = useSavePost()
  const [deletePost, deletePostStatus] = useDeletePost()

  const onSubmit = async (values) => {
    try {
      await savePost(values)
      refetch()
    } catch (err) {
      console.error(err)
    }
  }

  const onDelete = async () => {
    if (post.id) {
      try {
        await deletePost(post.id)
        setActivePostId()
      } catch (err) {
        console.error(err)
      }
    }
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
            {post.title} {isFetching ? <small>Updating...</small> : null}
          </h3>
          <small>{post.id}</small>
          <div>
            <p>Post ID: {post.content}</p>
          </div>

          <hr />

          <PostForm
            initialValues={post}
            onSubmit={onSubmit}
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
