import { sql } from '@vercel/postgres'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM clients ORDER BY id`
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { name, email, company, phone, service, plan, status, budget, deadline, notes } = req.body
    const { rows } = await sql`
      INSERT INTO clients (name, email, company, phone, service, plan, status, budget, paid, "createdAt", deadline, notes)
      VALUES (${name}, ${email}, ${company}, ${phone}, ${service}, ${plan}, ${status}, ${budget}, 0, ${new Date().toISOString().slice(0,10)}, ${deadline}, ${notes})
      RETURNING *`
    return res.json(rows[0])
  }
}