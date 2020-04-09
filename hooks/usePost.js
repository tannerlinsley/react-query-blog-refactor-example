import React from 'react'
import axios from 'axios'

const context = React.createContext()

export function PostContext({ children }) {
  const [posts, setPosts] = React.useState({})
  const activePromisesRef = React.useRef({})

  const setPost = React.useCallback(
    (id, updater) =>
      setPosts((old) => ({
        ...old,
        [id]: typeof updater === 'function' ? updater(old[id] || {}) : updater,
      })),
    [setPosts]
  )

  const refetch = React.useCallback(
    async (postId) => {
      if (!postId) {
        return
      }

      if (!activePromisesRef.current[postId]) {
        activePromisesRef.current[postId] = (async () => {
          try {
            setPost(postId, (old) => ({
              ...old,
              status: 'loading',
            }))

            const post = await axios
              .get(`/api/posts/${postId}`)
              .then((res) => res.data)

            setPost(postId, (old) => ({
              ...old,
              status: 'success',
              error: undefined,
              data: post,
            }))
          } catch (err) {
            setPost(postId, (old) => ({
              ...old,
              status: 'error',
              error: err,
            }))
          } finally {
            activePromisesRef.current[postId] = false
          }
        })()
      }

      return activePromisesRef.current[postId]
    },
    [setPost]
  )

  const contextValue = React.useMemo(() => ({
    posts,
    refetch,
  }))

  return <context.Provider value={contextValue}>{children}</context.Provider>
}

export default function usePost(postId) {
  const { posts, refetch: refetchById } = React.useContext(context)

  const { data: post, status, error } = posts[postId] || { status: 'loading' }

  const refetch = React.useCallback(async () => refetchById(postId), [
    refetchById,
    postId,
  ])

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
