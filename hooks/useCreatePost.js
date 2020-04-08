import axios from 'axios'
import { useMutation, queryCache } from 'react-query'

export default function useCreatePost() {
  return useMutation(
    (values) => axios.post('/api/posts', values).then((res) => res.data),
    {
      onMutate: (values) => {
        const previousPosts = queryCache.getQueryData('posts')

        queryCache.setQueryData('posts', (old) => [
          ...old,
          {
            id: 'temp',
            ...values,
          },
        ])

        return () => queryCache.setQueryData('posts', previousPosts)
      },
      onError: (error, values, rollback) => rollback(),
      onSuccess: () => queryCache.refetchQueries('posts'),
    }
  )
}
