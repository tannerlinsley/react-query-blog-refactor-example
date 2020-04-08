import React from 'react'
import axios from 'axios'

import { Wrapper, Sidebar, Main } from '../components/styled'

import usePosts from '../hooks/usePosts'
import usePost from '../hooks/usePost'
import useCreatePost from '../hooks/useCreatePost'
import useSavePost from '../hooks/useSavePost'

function App() {
  const [activePostId, setActivePostId] = React.useState()

  return (
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
          <Post activePostId={activePostId} setActivePostId={setActivePostId} />
        ) : (
          <Posts setActivePostId={setActivePostId} />
        )}
      </Main>
    </Wrapper>
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
          <PostForm onSubmit={onSubmit} />
          <div>
            {createPostStatus === 'loading'
              ? 'Saving...'
              : createPostStatus === 'error'
              ? 'Error!'
              : createPostStatus === 'success'
              ? 'Saved!'
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function Post({ activePostId }) {
  const { status, post, error, refetch } = usePost(activePostId)
  const [savePost, savePostStatus] = useSavePost()

  const onSubmit = async (values) => {
    try {
      await savePost(values)
      refetch()
    } catch (err) {
      console.error(err)
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

          <PostForm initialValues={post} onSubmit={onSubmit} />
          <div>
            {savePostStatus === 'loading'
              ? 'Saving...'
              : savePostStatus === 'error'
              ? 'Error!'
              : savePostStatus === 'success'
              ? 'Saved!'
              : null}
          </div>
        </div>
      )}
    </>
  )
}

const defaultFormValues = {
  title: '',
  content: '',
}

function PostForm({ onSubmit, initialValues = defaultFormValues }) {
  const [values, setValues] = React.useState(initialValues)

  const setValue = (field, value) =>
    setValues((old) => ({ ...old, [field]: value }))

  const handleSubmit = (e) => {
    setValues(defaultFormValues)
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title</label>
      <div>
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={(e) => setValue('title', e.target.value)}
          required
        />
      </div>
      <br />
      <label htmlFor="content">Content</label>
      <div>
        <textarea
          type="text"
          name="content"
          value={values.content}
          onChange={(e) => setValue('content', e.target.value)}
          required
        />
      </div>
      <br />
      <button type="submit">Submit</button>
    </form>
  )
}

function Stats() {
  const { posts, status } = usePosts()
  return <div>Total Posts: {status === 'loading' ? '...' : posts.length}</div>
}

export default App
