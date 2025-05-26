
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useMemo, useEffect } from 'react';
import type { EventData, Bookmaker, Sport, Market } from '@/types';
import { MOCK_SPORTS, MOCK_MARKETS, MOCK_BOOKMAKERS, MOCK_EVENTS } from '@/data/mock-data'; // Still used for simulation
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { Award, Filter, CalendarDays, Loader2, AlertTriangle } from 'lucide-react';
import { decimalToAmerican } from '@/lib/utils';

interface OddsTableProps {
  sports?: Sport[];
  markets?: Market[];
  bookmakers?: Bookmaker[];
}

async function simulateFetchOddsData(
  selectedSport: string, 
  selectedMarket: string, 
  searchTerm: string,
  allMockEvents: EventData[], // Pass mock events for simulation
  allMockMarkets: Market[] // Pass mock markets for filtering logic
): Promise<EventData[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let events = [...allMockEvents]; // Use a copy of mock events

  if (selectedSport !== 'all') {
    events = events.filter(event => event.sport.toLowerCase().replace(/\s+/g, '-') === selectedSport);
  }

  if (selectedMarket !== 'all') {
    const marketObj = allMockMarkets.find(m => m.id === selectedMarket);
    if (marketObj) {
      events = events.filter(event => event.market === marketObj.name);
    }
  }
  
  if (searchTerm) {
    events = events.filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }
  
  // In a real app, you might slightly randomize odds here to show changes
  // For now, just return the filtered mock data
  return events;
}


export function OddsTable({ 
  sports = MOCK_SPORTS,
  markets = MOCK_MARKETS,
  bookmakers = MOCK_BOOKMAKERS
}: OddsTableProps) {
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedMarket, setSelectedMarket] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const availableMarkets = useMemo(() => {
    if (selectedSport === 'all') {
      return markets;
    }
    return markets.filter(market => market.sportId === selectedSport);
  }, [selectedSport, markets]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Pass MOCK_EVENTS and MOCK_MARKETS to the simulation function
        const fetchedEvents = await simulateFetchOddsData(selectedSport, selectedMarket, searchTerm, MOCK_EVENTS, MOCK_MARKETS);
        setEventsData(fetchedEvents);
      } catch (err) {
        console.error("Failed to fetch odds data:", err);
        setError("Failed to load odds data. Please try again later.");
        setEventsData([]); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSport, selectedMarket, searchTerm]); // Dependencies for re-fetching

  const getBestOddsForOutcome = (eventId: string, outcomeName: string) => {
    const event = eventsData.find(e => e.id === eventId);
    if (!event) return null;

    const outcomeOdds = event.odds.filter(
      (odd) => odd.outcomeName === outcomeName
    );
    if (outcomeOdds.length === 0) return null;

    return outcomeOdds.reduce((max, odd) => (odd.odds > max.odds ? odd : max));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Live Odds</CardTitle>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={selectedSport} onValueChange={(value) => { setSelectedSport(value); setSelectedMarket('all'); /* Reset market on sport change */ }}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select Sport" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map((sport) => (
                <SelectItem key={sport.id} value={sport.id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={(availableMarkets.length === 0 && selectedSport !== 'all') || isLoading}>
            <SelectTrigger className="w-full">
               <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select Market" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Markets</SelectItem>
              {availableMarkets.map((market) => (
                <SelectItem key={market.id} value={market.id}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input 
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2 text-muted-foreground">Loading odds...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-10 text-destructive">
            <AlertTriangle className="h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Event</TableHead>
                  <TableHead className="min-w-[150px]">Start Time</TableHead>
                  <TableHead className="min-w-[150px]">Outcome</TableHead>
                  {bookmakers.map((bookmaker) => (
                    <TableHead key={bookmaker.id} className="text-center min-w-[100px]">
                      {bookmaker.name}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[120px]">Best Odds</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4 + bookmakers.length} className="text-center py-10 text-muted-foreground">
                      No events match your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  eventsData.flatMap((event) =>
                    event.outcomes.map((outcome, outcomeIndex) => {
                      const bestOddDetail = getBestOddsForOutcome(event.id, outcome.name);
                      return (
                        <TableRow key={`${event.id}-${outcome.name}`} className={outcomeIndex === 0 ? "border-t-2 border-primary/20" : ""}>
                          {outcomeIndex === 0 ? (
                            <TableCell rowSpan={event.outcomes.length} className="font-medium align-top py-3">
                              <div className="flex flex-col">
                                <span>{event.name}</span>
                                <span className="text-xs text-muted-foreground">{event.sport} - {event.market}</span>
                              </div>
                            </TableCell>
                          ) : null}
                          {outcomeIndex === 0 ? (
                            <TableCell rowSpan={event.outcomes.length} className="text-sm text-muted-foreground align-top py-3">
                              <div className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {format(parseISO(event.startTime), 'MMM d, HH:mm')}
                              </div>
                            </TableCell>
                          ) : null}
                          <TableCell className="py-3">{outcome.name}</TableCell>
                          {bookmakers.map((bookmaker) => {
                            const oddDetail = event.odds.find(
                              (o) => o.bookmaker === bookmaker.name && o.outcomeName === outcome.name
                            );
                            const isBest = bestOddDetail && oddDetail && oddDetail.odds === bestOddDetail.odds && oddDetail.bookmaker === bestOddDetail.bookmaker;
                            return (
                              <TableCell key={bookmaker.id} className="text-center py-3">
                                {oddDetail ? (
                                  <Badge
                                    variant={isBest ? 'default' : 'secondary'}
                                    className={isBest ? 'bg-accent text-accent-foreground font-bold' : ''}
                                  >
                                    {decimalToAmerican(oddDetail.odds)}
                                  </Badge>
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-bold py-3">
                            {bestOddDetail ? (
                              <div className="flex flex-col items-center">
                                <Badge className="bg-accent text-accent-foreground">
                                  {decimalToAmerican(bestOddDetail.odds)}
                                </Badge>
                                <span className="text-xs text-muted-foreground mt-1">
                                  {bestOddDetail.bookmaker}
                                </span>
                              </div>
                            ) : '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
