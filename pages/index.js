import React from 'react'
import axios from 'axios'

import { Wrapper, Sidebar, Main } from '../components/styled'

function App() {
  const [activePostId, setActivePostId] = React.useState()

  return (
    <Wrapper>
      <Sidebar>
        <a href="#" onClick={() => setActivePostId()}>
          All Posts
        </a>
        <hr />
        {/* <Stats /> */}
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
  const [posts, setPosts] = React.useState([])
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const fetchPosts = async () => {
    try {
      setStatus('loading')
      const posts = await axios.get('/api/posts').then((res) => res.data)
      setPosts(posts)
      setError()
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }

  React.useEffect(() => {
    fetchPosts()
  }, [])

  const [initialValues, setInitialValues] = React.useState({})
  const [mutationStatus, setMutationStatus] = React.useState('idle')

  const onSubmit = async (values) => {
    try {
      setMutationStatus('loading')
      await axios.post('/api/posts', values)
      setInitialValues({})
      setMutationStatus('success')
      fetchPosts()
    } catch (err) {
      setMutationStatus('error')
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
            {mutationStatus === 'loading'
              ? 'Saving...'
              : mutationStatus === 'error'
              ? 'Error!'
              : mutationStatus === 'success'
              ? 'Saved!'
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function Post({ activePostId, setActivePostId }) {
  const [post, setPost] = React.useState()
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const fetchPost = async () => {
    try {
      setStatus('loading')

      const post = await axios
        .get(`/api/posts/${activePostId}`)
        .then((res) => res.data)

      setPost(post)
      setError()
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }

  React.useEffect(() => {
    fetchPost()
  }, [])

  const [mutationStatus, setMutationStatus] = React.useState('idle')

  const onSubmit = async (values) => {
    try {
      setMutationStatus('loading')
      await axios.patch(`/api/posts/${values.id}`, values)
      setMutationStatus('success')
      fetchPost()
    } catch (err) {
      setMutationStatus('error')
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
            {mutationStatus === 'loading'
              ? 'Saving...'
              : mutationStatus === 'error'
              ? 'Error!'
              : mutationStatus === 'success'
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
  return <div>Total Posts: ???</div>
}

export default App
