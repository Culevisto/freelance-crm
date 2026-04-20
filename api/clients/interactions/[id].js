import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'DELETE') {
    await sql`DELETE FROM interactions WHERE id = ${id}`
    return res.json({ ok: true })
  }
}