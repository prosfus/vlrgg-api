import express from "express";
import {
  getEvents,
  getMatch,
  getMatchResults,
  getPlayers,
  getRankings,
  getUpcomingMatches,
  getVCT,
} from "../controllers/controller.js";

const router = express.Router();

// Get Team Rankings
router.get("/rankings/:region", getRankings);

// Get All Players
router.get("/players", getPlayers);

// Get All Ongoing Events or Specific Event
router.get("/events", getEvents);

router.get("/vct", getVCT);

// Get Specific Event
// router.get("/events/:url", getEvent);

// Get Upcoming matches
router.get("/matches/upcoming", getUpcomingMatches);

// Get Completed Match Results
router.get("/matches/results", getMatchResults);

// Get Specific Match Info
router.get("/matches/:url", getMatch);

export default router;
