import bcrypt from "bcrypt";

import db from "#db/client";


export const createUser = async ({ username, password }) => {
  const sql = `
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING *;
  `;
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows: [user] } = await db.query(sql, [username, hashedPassword]);
  return user;
}



export const getUserByUsernamePassword = async ({ username, password }) => {
  const sql = `
  SELECT * FROM users WHERE username = $1;
  `;
  try {
    const { rows: [user] } = await db.query(sql, [username]);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('error in query: ', err);
    throw err;
  }
}
