import bcrypt from "bcrypt";

import db from "#db/client";


export const createUser = async (username, password) => {
  const sql = `
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING *;
  `;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows: [user] } = await db.query(sql, [username, hashedPassword]);
  return user;
}
