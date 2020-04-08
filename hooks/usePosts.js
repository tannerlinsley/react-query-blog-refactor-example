import { useQuery } from 'react-query'
import axios from 'axios'

export default function usePosts() {
  return useQuery('posts', () =>
    axios.get('/api/posts').then((res) => res.data)
  )
}
