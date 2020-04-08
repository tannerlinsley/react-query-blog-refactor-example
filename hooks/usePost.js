import React from 'react'
import axios from 'axios'

export default function usePost(postId) {
  const [post, setPost] = React.useState()
  const [error, setError] = React.useState()
  const [status, setStatus] = React.useState('loading')

  const refetch = React.useCallback(async () => {
    if (!postId) {
      return
    }

    try {
      setStatus('loading')

      const post = await axios
        .get(`/api/posts/${postId}`)
        .then((res) => res.data)

      setPost(post)
      setError()
      setStatus('success')
    } catch (err) {
      setError(err)
      setStatus('error')
    }
  }, [postId])

  React.useEffect(() => {
    refetch()
  }, [refetch])

  return {
    post,
    status,
    error,
    refetch,
  }
}
