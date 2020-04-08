import axios from 'axios'
import { useMutation, queryCache } from 'react-query'

export default function useSavePost() {
  return useMutation(
    (values) =>
      axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (values) => {
        const previousPost = queryCache.getQueryData(['post', values.id])

        queryCache.setQueryData(['post', values.id], (old) => ({
          ...old,
          ...values,
        }))

        return () => queryCache.setQueryData(['post', values.id], previousPost)
      },
      onError: (error, values, rollback) => rollback(),
      onSuccess: async (values) => {
        queryCache.refetchQueries('posts')
        await queryCache.refetchQueries(['post', values.id])
      },
    }
  )
}
