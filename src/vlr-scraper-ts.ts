import axios from "axios";
import { Event } from "./getAllVct.js";
import * as cheerio from "cheerio";
import { EventData, Standing, Team } from "./models.js";

export async function scrapeEvents() {
  let events = [] as Event[];
  // Fetch the data
  const { data } = await axios.get(`https://www.vlr.gg/events`);

  // Load up the html
  const $ = cheerio.load(data);
  const item = $("div#wrapper");

  // Extract the data that we need

  $(item)
    .find(
      "#wrapper > div.col-container > div > div.events-container > div:nth-child(1) > a"
    )
    .each((index, element) => {
      events.push({
        event_name: $(element).find("div.event-item-title").text().trim(),
        event_logo:
          $(element).find("div.event-item-thumb img").attr("src") ?? "",
        event_url: "www.vlr.gg" + $(element).attr("href"),
        prize_pool: $(element)
          .find("div.mod-prize")
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim(),
        dates: $(element)
          .find("div.mod-dates")
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim(),
        region:
          $(element).find("div.mod-location i").attr("class")?.slice(-2) ?? "",
      });
    });
  console.log("All events: ", events.length);
  return events;
}

export async function scrapeEvent(event_url: string) {
  // Fetch the data
  let eventInfo = {
    standings: [] as Standing[],
    teams: [] as Team[],
    upcoming_matches: [] as EventData["upcoming_matches"],
    latest_results: [] as EventData["latest_results"],
  } as EventData;
  const { data } = await axios.get(`https://${event_url}`); // Load up the html
  const $ = cheerio.load(data);
  const item = $("div#wrapper"); // Extract the data that we need
  eventInfo.event_name = $(item)
    .find(
      "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.event-desc > div > h1"
    )
    .text()
    .trim();
  eventInfo.event_url = event_url;
  eventInfo.event_logo =
    $(item)
      .find(
        "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.wf-avatar.event-header-thumb > div > img"
      )
      .attr("src") ?? "";
  eventInfo.description = $(item)
    .find(
      "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.event-desc > div > h2"
    )
    .text()
    .trim();
  eventInfo.dates = $(item)
    .find(
      "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.event-desc > div > div.event-desc-items > div:nth-child(1) > div.event-desc-item-value"
    )
    .text()
    .trim();
  eventInfo.prize_pool = $(item)
    .find(
      "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.event-desc > div > div.event-desc-items > div:nth-child(2) > div.event-desc-item-value"
    )
    .text()
    .trim();
  eventInfo.location = $(item)
    .find(
      "#wrapper > div.col-container > div > div.wf-card.mod-event.mod-header.mod-full > div.event-header > div.event-desc > div > div.event-desc-items > div.event-desc-item.mod-last > div.event-desc-item-value"
    )
    .text()
    .trim();
  // standings
  $(item)
    .find("#regular-season-regular-season > table > tbody > tr")
    .each((index, element) => {
      console.log(element);
      let teamName = $(element)
        .find("td:nth-child(1) > div > a > div")
        .text()
        .trim();
      const pattern = /^(.*)\s+\w+/;
      const match = teamName.match(pattern);

      if (match) {
        teamName = match[1].trim();
      }
      eventInfo.standings.push({
        team_name: teamName,
        team_url:
          "www.vlr.gg" +
          $(element).find("td:nth-child(1) > div > a").attr("href"),
        team_logo_url:
          $(element)
            .find("td:nth-child(1) > div > a > img")
            .attr("src")
            ?.replace("//", "https://") ?? "",
        team_wins: $(element).find("td:nth-child(3)").text().trim(),
        team_losses: $(element).find("td:nth-child(4)").text().trim(),
        team_maps: $(element).find("td:nth-child(5)").text().trim(),
        team_rounds: $(element).find("td:nth-child(6)").text().trim(),
        team_rounds_diferential: $(element)
          .find("td:nth-child(7)")
          .text()
          .trim(),
      });
    }); // populate teams

  $(item)
    .find(
      "#wrapper > div.col-container > div > div.event-container > div.event-content > div.event-teams-container div.event-team"
    )
    .each((index, element) => {
      eventInfo.teams.push({
        team_name: $(element).find("a.event-team-name").text().trim(),
        team_logo_url:
          $(element)
            .find("div.event-team-players img")
            .attr("src")
            ?.replace("//", "https://") ?? "",
      });
    }); // Populate upsoming matches
  $(item)
    .find(
      "#wrapper > div.col-container > div > div.event-container > div.event-sidebar > div > div:nth-child(2) > a"
    )
    .each((index, element) => {
      eventInfo.upcoming_matches.push({
        team_one_name: $(element)
          .find("div.event-sidebar-matches-team div.name span")
          .eq(0)
          .text()
          .trim(),
        team_two_name: $(element)
          .find("div.event-sidebar-matches-team div.name span")
          .eq(1)
          .text()
          .trim(),
        ETA: $(element).find("div.eta").text().trim(),
      });
    }); // Populate latest results
  $(item)
    .find(
      "#wrapper > div.col-container > div > div.event-container > div.event-sidebar > div > div:nth-child(5) > a"
    )
    .each((index, element) => {
      eventInfo.latest_results.push({
        team_one_name: $(element)
          .find("div.event-sidebar-matches-team div.name span")
          .eq(0)
          .text()
          .trim(),
        team_one_score: $(element)
          .find("div.event-sidebar-matches-team div.score")
          .eq(0)
          .text()
          .trim(),
        team_two_name: $(element)
          .find("div.event-sidebar-matches-team div.name span")
          .eq(1)
          .text()
          .trim(),
        team_two_score: $(element)
          .find("div.event-sidebar-matches-team div.score")
          .eq(1)
          .text()
          .trim(),
        ETA: $(element).find("div.eta").text().trim(),
      });
    });
  return eventInfo;
}
