
export interface OddDetail {
  bookmaker: string;
  odds: number;
  outcomeName: string; // Added to link back to the outcome
  eventId: string; // Added to link back to the event
}

export interface Outcome {
  name: string; // e.g., "Team A Wins", "Draw", "Team B Wins", "Over 2.5 Goals"
  // Best odds can be derived or stored if pre-calculated
}

export interface EventData {
  id: string;
  name: string; // e.g., "Team A vs Team B"
  sport: string; // e.g., "Soccer", "Basketball"
  market: string; // e.g., "Match Winner", "Total Goals"
  startTime: string; // ISO string for date/time
  outcomes: Outcome[]; // Defines the possible outcomes for this event's market
  odds: OddDetail[]; // All odds from all bookmakers for this event, linked by outcomeName and eventId
}

export interface Sport {
  id: string;
  name: string;
  // icon?: LucideIcon; // Optional: if we want specific icons later
}

export interface Market {
  id: string;
  name: string;
  sportId: string;
}

export interface AlertConfig {
  id: string;
  eventId: string;
  outcomeName: string;
  targetOdds: number;
  operator: '>=' | '<='; // Alert if odds are greater/equal or less/equal
  sport: string; // For display purposes
  eventName: string; // For display purposes
}

export interface Bookmaker {
  id: string;
  name: string;
}
