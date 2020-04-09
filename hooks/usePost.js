import { useQuery } from 'react-query'
import axios from 'axios'

export const fetchPost = (key, postId) =>
  axios.get(`/api/posts/${postId}`).then((res) => res.data)

export default function usePost(postId) {
  return useQuery(postId && ['post', postId], fetchPost)
}
