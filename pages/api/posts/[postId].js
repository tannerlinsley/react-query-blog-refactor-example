import db from '../../../db'
import { sleep } from '../../../utils'

const failureRate = 0.5

export default async (req, res) => {
  await sleep(500)

  try {
    if (req.method === 'GET') {
      return await GET(req, res)
    } else if (req.method === 'PATCH') {
      return await PATCH(req, res)
    } else if (req.method === 'DELETE') {
      return await DELETE(req, res)
    }
  } catch (err) {
    console.error(err)
    res.status(500)
    res.json({ message: 'An unknown error occurred!' })
  }
}

async function GET(req, res) {
  const {
    query: { postId },
  } = req

  const row = db.posts.find((d) => d.id === postId)

  if (!row) {
    res.status(404)
    return res.send('Not found')
  }

  res.json(row)
}

async function PATCH(req, res) {
  const {
    query: { postId },
    body,
  } = req

  if (Math.random() > failureRate) {
    res.status(500)
    res.json({ message: 'An unknown error occurred!' })
    return
  }

  const row = db.posts.find((d) => d.id === postId)

  if (!row) {
    res.status(404)
    return res.send('Not found')
  }

  delete body.id

  const newRow = {
    ...row,
    ...body,
  }

  db.posts = db.posts.map((d) => (d.id === postId ? newRow : d))

  res.json(newRow)
}

async function DELETE(req, res) {
  const {
    query: { postId },
  } = req

  if (Math.random() > failureRate) {
    res.status(500)
    res.json({ message: 'An unknown error occurred!' })
    return
  }

  const row = db.posts.find((d) => d.id === postId)

  if (!row) {
    res.status(404)
    return res.send('Not found')
  }

  db.posts = db.posts.filter((d) => d.id !== postId)

  res.status(200)
  res.send('Resource Deleted')
}
