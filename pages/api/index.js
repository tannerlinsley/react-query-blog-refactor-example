import shortid from 'shortid'
import db from '../../db'

//

export default async (req, res) => {
  try {
    if (req.method === 'GET') {
      return await GET(req, res)
    } else if (req.method === 'POST') {
      return await POST(req, res)
    }
  } catch (err) {
    console.error(err)
    res.status(500)
    res.json({ message: 'An unknown error occurred!' })
  }
}

async function GET(req, res) {
  const {
    query: { pageOffset, pageSize },
  } = req

  const posts = db.posts.map(d => ({
    ...d,
    content: undefined // Don't return content in list calls
  }))

  if (Number(pageSize)) {
    const start = Number(pageSize) * Number(pageOffset)
    const end = start + Number(pageSize)
    const page = posts.slice(start, end)

    return res.json({
      items: page,
      nextPageOffset: posts.length > end ? Number(pageOffset) + 1 : undefined,
    })
  }

  res.json(posts)
}

async function POST(req, res) {
  const row = {
    id: shortid.generate(),
    ...req.body,
  }

  db.posts.push(row)

  res.json(row)
}