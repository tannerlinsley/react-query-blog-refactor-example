import React from 'react'
import axios from 'axios'

export default function useCreatePost() {
  const [status, setStatus] = React.useState('idle')

  const savePost = React.useCallback(async (values) => {
    try {
      setStatus('loading')
      await axios.patch(`/api/posts/${values.id}`, values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      throw err
    }
  })

  return [savePost, status]
}
