export interface EventData {
  event_name: string;
  event_logo: string;
  event_url: string;
  description: string;
  dates: string;
  prize_pool: string;
  location: string;
  teams: Team[];
  upcoming_matches: UpcomingMatch[];
  latest_results: LatestResult[];
  standings: Standing[];
}

export interface LatestResult {
  team_one_name: string;
  team_one_score: string;
  team_two_name: string;
  team_two_score: string;
  ETA: string;
}

export interface Standing {
  team_name: string;
  team_url: string;
  team_logo_url: string;
  team_wins: string;
  team_losses: string;
  team_maps: string;
  team_rounds: string;
  team_rounds_diferential: string;
}

export interface Team {
  team_name: string;
  team_logo_url: string;
}

export interface UpcomingMatch {
  team_one_name: string;
  team_two_name: string;
  ETA: string;
}
