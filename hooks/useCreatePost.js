import React from 'react'
import axios from 'axios'

export default function useCreatePost() {
  const [status, setStatus] = React.useState('idle')

  const createPost = React.useCallback(async (values) => {
    try {
      setStatus('loading')
      await axios.post('/api/posts', values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      throw err
    }
  })

  return [createPost, status]
}
