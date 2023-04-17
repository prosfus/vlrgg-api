import { scrapeEvents } from "./vlr-scraper-ts.js";

export interface Event {
  event_name: string;
  event_url: string;
  event_logo: string;
  prize_pool: string;
  dates: string;
  region: string;
}

export const getAllVct = async () => {
  const events = await scrapeEvents();
  let vct = events.filter((event) =>
    event.event_name.includes("Champions Tour")
  );
  vct = vct.map((event) => {
    return {
      ...event,
      event_logo: event.event_logo.replace("//", "https://"),
      event_name: event.event_name.replace("Champions Tour 2023: ", ""),
    };
  });
  console.log("Total VCT events: " + vct.length);

  return vct;
};
