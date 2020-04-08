import React from 'react'
import axios from 'axios'

export default function usePosts() {
  const [posts, setPosts] = React.useState([])
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const refetch = async () => {
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
    refetch()
  }, [])

  return {
    posts,
    status,
    error,
    refetch,
  }
}
