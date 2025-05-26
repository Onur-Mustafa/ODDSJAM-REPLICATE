
"use client";

import type { ChangeEvent } from 'react';
import React, { useState, useMemo, useEffect } from 'react';
import type { EventData, Bookmaker, Sport, Market } from '@/types';
import { MOCK_SPORTS, MOCK_MARKETS, MOCK_BOOKMAKERS, MOCK_EVENTS } from '@/data/mock-data';
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
import { Award, Filter, CalendarDays, ShieldCheck } from 'lucide-react';

interface OddsTableProps {
  initialEvents?: EventData[];
  sports?: Sport[];
  markets?: Market[];
  bookmakers?: Bookmaker[];
}

export function OddsTable({ 
  initialEvents = MOCK_EVENTS, 
  sports = MOCK_SPORTS,
  markets = MOCK_MARKETS,
  bookmakers = MOCK_BOOKMAKERS
}: OddsTableProps) {
  const [allEvents] = useState<EventData[]>(initialEvents);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(initialEvents);
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
    let events = allEvents;

    if (selectedSport !== 'all') {
      events = events.filter(event => event.sport.toLowerCase().replace(/\s+/g, '-') === selectedSport);
    }

    if (selectedMarket !== 'all') {
      // Find market name by ID, then filter events by market name
      const marketObj = markets.find(m => m.id === selectedMarket);
      if (marketObj) {
        events = events.filter(event => event.market === marketObj.name);
      }
    }
    
    if (searchTerm) {
      events = events.filter(event => event.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredEvents(events);
  }, [selectedSport, selectedMarket, searchTerm, allEvents, markets]);

  const getBestOddsForOutcome = (eventId: string, outcomeName: string) => {
    const event = allEvents.find(e => e.id === eventId);
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
          <Select value={selectedSport} onValueChange={setSelectedSport}>
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

          <Select value={selectedMarket} onValueChange={setSelectedMarket} disabled={availableMarkets.length === 0 && selectedSport !== 'all'}>
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
          />
        </div>
      </CardHeader>
      <CardContent>
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
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4 + bookmakers.length} className="text-center py-10 text-muted-foreground">
                    No events match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.flatMap((event) =>
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
                                  {oddDetail.odds.toFixed(2)}
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
                                {bestOddDetail.odds.toFixed(2)}
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
      </CardContent>
    </Card>
  );
}
