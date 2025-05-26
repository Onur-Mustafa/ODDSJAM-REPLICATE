
import type { EventData, Sport, Market, Bookmaker, AlertConfig } from '@/types';
import { addDays, formatISO } from 'date-fns';

export const MOCK_SPORTS: Sport[] = [
  { id: 'soccer', name: 'Soccer' },
  { id: 'basketball', name: 'Basketball' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'esports', name: 'E-Sports' },
];

export const MOCK_MARKETS: Market[] = [
  { id: 'match_winner_soccer', name: 'Match Winner', sportId: 'soccer' },
  { id: 'over_under_2.5_soccer', name: 'Over/Under 2.5 Goals', sportId: 'soccer' },
  { id: 'money_line_basketball', name: 'Money Line', sportId: 'basketball' },
  { id: 'match_winner_tennis', name: 'Match Winner', sportId: 'tennis' },
  { id: 'match_winner_esports', name: 'Match Winner', sportId: 'esports' },
];

export const MOCK_BOOKMAKERS: Bookmaker[] = [
  { id: 'fanduel', name: 'FanDuel' },
  { id: 'draftkings', name: 'DraftKings' },
  { id: 'caesars', name: 'Caesars' },
];

const today = new Date();

export const MOCK_EVENTS: EventData[] = [
  {
    id: 'event_1',
    name: 'FC Barcelona vs Real Madrid',
    sport: 'Soccer',
    market: 'Match Winner',
    startTime: formatISO(addDays(today, 1)),
    outcomes: [
      { name: 'FC Barcelona Win' },
      { name: 'Draw' },
      { name: 'Real Madrid Win' },
    ],
    odds: [
      { bookmaker: 'FanDuel', odds: 2.1, outcomeName: 'FC Barcelona Win', eventId: 'event_1' },
      { bookmaker: 'DraftKings', odds: 2.05, outcomeName: 'FC Barcelona Win', eventId: 'event_1' },
      { bookmaker: 'Caesars', odds: 2.15, outcomeName: 'FC Barcelona Win', eventId: 'event_1' },
      { bookmaker: 'FanDuel', odds: 3.5, outcomeName: 'Draw', eventId: 'event_1' },
      { bookmaker: 'DraftKings', odds: 3.55, outcomeName: 'Draw', eventId: 'event_1' },
      { bookmaker: 'Caesars', odds: 3.45, outcomeName: 'Draw', eventId: 'event_1' },
      { bookmaker: 'FanDuel', odds: 3.0, outcomeName: 'Real Madrid Win', eventId: 'event_1' },
      { bookmaker: 'DraftKings', odds: 3.1, outcomeName: 'Real Madrid Win', eventId: 'event_1' },
      { bookmaker: 'Caesars', odds: 2.95, outcomeName: 'Real Madrid Win', eventId: 'event_1' },
    ],
  },
  {
    id: 'event_2',
    name: 'LA Lakers vs Golden State Warriors',
    sport: 'Basketball',
    market: 'Money Line',
    startTime: formatISO(addDays(today, 2)),
    outcomes: [
      { name: 'LA Lakers Win' },
      { name: 'Golden State Warriors Win' },
    ],
    odds: [
      { bookmaker: 'FanDuel', odds: 1.9, outcomeName: 'LA Lakers Win', eventId: 'event_2' },
      { bookmaker: 'DraftKings', odds: 1.95, outcomeName: 'LA Lakers Win', eventId: 'event_2' },
      { bookmaker: 'Caesars', odds: 1.88, outcomeName: 'LA Lakers Win', eventId: 'event_2' },
      { bookmaker: 'FanDuel', odds: 1.9, outcomeName: 'Golden State Warriors Win', eventId: 'event_2' },
      { bookmaker: 'DraftKings', odds: 1.85, outcomeName: 'Golden State Warriors Win', eventId: 'event_2' },
      { bookmaker: 'Caesars', odds: 1.92, outcomeName: 'Golden State Warriors Win', eventId: 'event_2' },
    ],
  },
  {
    id: 'event_3',
    name: 'Man City vs Liverpool (Over/Under 2.5)',
    sport: 'Soccer',
    market: 'Over/Under 2.5 Goals',
    startTime: formatISO(addDays(today, 0)),
    outcomes: [
      { name: 'Over 2.5 Goals' },
      { name: 'Under 2.5 Goals' },
    ],
    odds: [
      { bookmaker: 'FanDuel', odds: 1.75, outcomeName: 'Over 2.5 Goals', eventId: 'event_3' },
      { bookmaker: 'DraftKings', odds: 1.80, outcomeName: 'Over 2.5 Goals', eventId: 'event_3' },
      { bookmaker: 'Caesars', odds: 1.78, outcomeName: 'Over 2.5 Goals', eventId: 'event_3' },
      { bookmaker: 'FanDuel', odds: 2.05, outcomeName: 'Under 2.5 Goals', eventId: 'event_3' },
      { bookmaker: 'DraftKings', odds: 2.00, outcomeName: 'Under 2.5 Goals', eventId: 'event_3' },
      { bookmaker: 'Caesars', odds: 2.10, outcomeName: 'Under 2.5 Goals', eventId: 'event_3' },
    ],
  },
   {
    id: 'event_4',
    name: 'Team Liquid vs Fnatic',
    sport: 'E-Sports',
    market: 'Match Winner',
    startTime: formatISO(addDays(today, 3)),
    outcomes: [
      { name: 'Team Liquid Win' },
      { name: 'Fnatic Win' },
    ],
    odds: [
      { bookmaker: 'FanDuel', odds: 1.65, outcomeName: 'Team Liquid Win', eventId: 'event_4' },
      { bookmaker: 'DraftKings', odds: 1.70, outcomeName: 'Team Liquid Win', eventId: 'event_4' },
      { bookmaker: 'Caesars', odds: 1.68, outcomeName: 'Team Liquid Win', eventId: 'event_4' },
      { bookmaker: 'FanDuel', odds: 2.15, outcomeName: 'Fnatic Win', eventId: 'event_4' },
      { bookmaker: 'DraftKings', odds: 2.10, outcomeName: 'Fnatic Win', eventId: 'event_4' },
      { bookmaker: 'Caesars', odds: 2.20, outcomeName: 'Fnatic Win', eventId: 'event_4' },
    ],
  },
];


export const MOCK_ALERTS: AlertConfig[] = [
  {
    id: 'alert_1',
    eventId: 'event_1',
    eventName: 'FC Barcelona vs Real Madrid',
    sport: 'Soccer',
    outcomeName: 'FC Barcelona Win',
    targetOdds: 2.2,
    operator: '>=',
  },
];

