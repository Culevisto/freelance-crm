import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { clientId } = req.query
    const { rows } = await sql`
      SELECT * FROM interactions WHERE "clientId" = ${clientId} ORDER BY date DESC`
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { clientId, type, text } = req.body
    const { rows } = await sql`
      INSERT INTO interactions ("clientId", type, text, date)
      VALUES (${clientId}, ${type}, ${text}, ${new Date().toISOString().slice(0,10)})
      RETURNING *`
    return res.json(rows[0])
  }
}