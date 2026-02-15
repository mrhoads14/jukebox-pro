import db from "#db/client";

export async function createPlaylist(name, description, userId) {
  const sql = `
  INSERT INTO playlists
    (name, description, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [name, description, userId]);
  return playlist;
}

export async function getPlaylists() {
  const sql = `
  SELECT *
  FROM playlists;
  `;
  const { rows: playlists } = await db.query(sql);
  return playlists;
}


export async function getPlaylistsByUserId(userId) {
  const sql = `
  SELECT playlists.*
  FROM playlists
  JOIN users ON playlists.user_id = users.id
  WHERE users.id = $1;
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}

export async function getPlaylistsByUsername(username) {
  const sql = `
  SELECT playlists.*
  FROM playlists
  JOIN users ON playlists.user_id = users.id
  WHERE users.username = $1;
  `;
  const { rows: playlists } = await db.query(sql, [username]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1;
  `;
  try {
    const { rows: [playlist] } = await db.query(sql, [id]);
    return playlist;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const getPlaylistsByUserAndTrackId = async (userId, trackId) => {
  const sql = `
  SELECT playlists.*
  FROM playlists
  JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
  WHERE playlists.user_id = $1 AND playlists_tracks.track_id = $2;
  `;
  try {
    const { rows: playlists } = await db.query(sql, [userId, trackId]);
    return playlists;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
