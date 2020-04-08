import React from 'react'

import { Wrapper, Sidebar, Main } from '../components/styled'
import PostForm from '../components/PostForm'

import usePosts, { PostsContext } from '../hooks/usePosts'
import usePost from '../hooks/usePost'
import useCreatePost from '../hooks/useCreatePost'
import useSavePost from '../hooks/useSavePost'
import useDeletePost from '../hooks/useDeletePost'

function App() {
  const [activePostId, setActivePostId] = React.useState()

  return (
    <PostsContext>
      <Wrapper>
        <Sidebar>
          <a href="#" onClick={() => setActivePostId()}>
            All Posts
          </a>
          <hr />
          <Stats />
        </Sidebar>
        <Main>
          {activePostId ? (
            <Post
              activePostId={activePostId}
              setActivePostId={setActivePostId}
            />
          ) : (
            <Posts setActivePostId={setActivePostId} />
          )}
        </Main>
      </Wrapper>
    </PostsContext>
  )
}

function Posts({ setActivePostId }) {
  const { status, posts, error, refetch } = usePosts()
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
        <h3>Posts</h3>
        <div>
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : status === 'error' ? (
            <span>Error: {error.message}</span>
          ) : (
            <div>
              {posts.map((post) => (
                <div key={post.id}>
                  <a href="#" onClick={() => setActivePostId(post.id)}>
                    {post.title}
                  </a>
                </div>
              ))}
            </div>
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
  const { status, post, error, refetch } = usePost(activePostId)
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
          <h3>{post.title}</h3>
          <div>
            <p>{post.content}</p>
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

function Stats() {
  const { posts, status } = usePosts()
  return <div>Total Posts: {status === 'loading' ? '...' : posts.length}</div>
}

export default App
