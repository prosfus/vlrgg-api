import { Response, Request } from "express";
import {
  scrapeMatch,
  scrapeMatchResults,
  scrapePlayers,
  scrapeTeams,
  scrapeUpcomingMatches,
} from "../vlr-scraper.js";
import { getAllVct } from "../getAllVct.js";
import { scrapeEvent, scrapeEvents } from "../vlr-scraper-ts.js";

// @desc   GET rankings
// @route  GET /api/rankings/:region
// @access Public
const getRankings = async (req: Request, res: Response) => {
  const rankings = await scrapeTeams(req.params.region);
  res.status(200).json(rankings);
};

// @desc   GET players
// @route  GET /api/players
// @access Public
const getPlayers = async (req: Request, res: Response) => {
  const players = await scrapePlayers();
  res.status(200).json(players);
};

// @desc   GET events
// @route  GET /api/events
// @access Public
const getEvents = async (req: Request, res: Response) => {
  const url = req.query.url as string;
  if (url) {
    console.log(url);
    const event = await scrapeEvent(url);
    res.status(200).json(event);
    return;
  }
  const events = await scrapeEvents();
  res.status(200).json(events);
};

// @desc   GET event
// @route  GET /api/events/:url
// @access Public
/*const getEvent = async (req: Request, res: Response) => {
  console.log(req.query.url);
  res.status(200);
  return;
  const event = await scrapeEvent(req.params.url);
  res.status(200).json(event);
};*/

// @desc   GET upcoming matches
// @route  GET /api/matches/upcoming
// @access Public
const getUpcomingMatches = async (req: Request, res: Response) => {
  const upcomingMatches = await scrapeUpcomingMatches();
  res.status(200).json(upcomingMatches);
};

// @desc   GET match results
// @route  GET /api/matches/results
// @access Public
const getMatchResults = async (req: Request, res: Response) => {
  const upcomingMatches = await scrapeMatchResults();
  res.status(200).json(upcomingMatches);
};

// @desc   GET match
// @route  GET /api/matches/:url
// @access Public
const getMatch = async (req: Request, res: Response) => {
  const match = await scrapeMatch(req.params.url);
  res.status(200).json(match);
};

// @desc   GET vct
// @route  GET /api/vct
// @access Public
const getVCT = async (req: Request, res: Response) => {
  console.log("Getting VCT...");
  const vct = await getAllVct();
  res.status(200).json(vct);
};

export {
  getRankings,
  getPlayers,
  getEvents,
  getUpcomingMatches,
  getMatchResults,
  getMatch,
  getVCT,
};
