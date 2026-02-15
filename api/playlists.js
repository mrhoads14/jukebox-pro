import express from "express";

import requireUser from "../middleware/requireUser.js";
import requireBody from "../middleware/requireBody.js";
import getUserFromToken from "../middleware/getUserFromToken.js";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
  getPlaylistsByUserId,
  getPlaylistsByUsername
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";


const router = express.Router();
export default router;


router.get("/", getUserFromToken, requireUser, async (req, res) => {
  // GET /playlists sends array of all playlists owned by the user.
  const playlists = await getPlaylistsByUserId(req.user.id);
  res.send(playlists);
});

router.post("/", getUserFromToken, requireUser, requireBody(['name', 'description']), async (req, res) => {
  // POST /playlists creates a new playlist owned by the user.
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});


router.param("id", async (req, res, next, id) => {
  const idRegex = /\D/;
  if(idRegex.test(id)) {
    res.status(400).send("id must be a positive integer");
    return;
  }
  const playlist = await getPlaylistById(Number(id));
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});


router.get("/:id", getUserFromToken, requireUser, (req, res) => {
  // GET /playlists/:id sends 403 error if the user does not own the playlist.
  if(req.playlist.user_id !== req.user.id) {
    res.status(403).send("user does not own playlist");
    return;
  }
  res.send(req.playlist);
});

router.get("/:id/tracks", getUserFromToken, requireUser, async (req, res) => {
  // GET /playlists/:id/tracks sends 403 error if the user does not own the playlist.
  if(req.playlist.user_id !== req.user.id) {
    res.status(403).send("user does not own playlist");
    return;
  }
  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", getUserFromToken, requireUser, async (req, res) => {
  // adds a track to the playlist
  if (!req.body) return res.status(400).send("Request body is required.");
  if(req.playlist.user_id !== req.user.id) {
    res.status(403).send("user does not own playlist");
    return;
  }

  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
