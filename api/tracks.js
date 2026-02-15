import express from "express";

import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylistsByUserAndTrackId } from "#db/queries/playlists";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.param("id", async (req, res, next, id) => {
  const idRegex = /\D/;
  if(idRegex.test(id)) {
    res.status(400).send("id must be a positive integer");
    return;
  }
  const track = await getTrackById(Number(id));
  if (!track) return res.status(404).send("Track not found.");

  req.track = track;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.track);
});


router.get("/:id/playlists", getUserFromToken, requireUser, async (req, res) => {
  const playlists = await getPlaylistsByUserAndTrackId(req.user.id, req.track.id);
  if (!playlists) return res.status(404).send("Playlists not found.");
  res.send(playlists);
});
