import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM clients WHERE id = ${id}`
    return res.json(rows[0])
  }

  if (req.method === 'PATCH') {
    const fields = req.body
    const sets = Object.entries(fields).map(([k, v], i) => `"${k}" = $${i + 2}`).join(', ')
    const values = [id, ...Object.values(fields)]
    const { rows } = await sql.query(`UPDATE clients SET ${sets} WHERE id = $1 RETURNING *`, values)
    return res.json(rows[0])
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM clients WHERE id = ${id}`
    return res.json({ ok: true })
  }
}