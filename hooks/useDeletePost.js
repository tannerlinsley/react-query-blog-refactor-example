import axios from 'axios'
import { useMutation, queryCache } from 'react-query'

export default function useDeletePost() {
  return useMutation(
    (postId) => axios.delete(`/api/posts/${postId}`).then((res) => res.data),
    {
      onMutate: (postId) => {
        const previousPosts = queryCache.getQueryData('posts')

        queryCache.setQueryData('posts', (old) =>
          old.filter((d) => d.id !== postId)
        )

        return () => queryCache.setQueryData('posts', previousPosts)
      },
      onError: (error, values, rollback) => rollback(),
      onSuccess: () => queryCache.refetchQueries('posts'),
    }
  )
}
