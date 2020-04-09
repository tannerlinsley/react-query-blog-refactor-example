import { usePaginatedQuery } from 'react-query'
import axios from 'axios'

export default function usePosts({ page = 0 } = {}) {
  return usePaginatedQuery(['posts', page], getPaginatedPosts)
}

async function getPaginatedPosts(key, page) {
  return axios
    .get('/api/posts', {
      params: {
        pageSize: 3,
        pageOffset: page,
      },
    })
    .then((res) => res.data)
}
