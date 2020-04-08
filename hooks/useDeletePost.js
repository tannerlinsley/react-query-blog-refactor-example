import React from 'react'
import axios from 'axios'

export default function useDeletePost() {
  const [status, setStatus] = React.useState('idle')

  const deletePost = React.useCallback(async (postId) => {
    try {
      setStatus('loading')
      await axios.delete(`/api/posts/${postId}`)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      throw err
    }
  })

  return [deletePost, status]
}
