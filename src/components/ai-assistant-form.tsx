
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestBet, type SuggestBetInput, type SuggestBetOutput } from '@/ai/flows/suggest-bet';
import { MOCK_SPORTS, MOCK_MARKETS, MOCK_EVENTS } from '@/data/mock-data';
import { Loader2, Sparkles, Lightbulb, BarChartBig } from 'lucide-react';

const formSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  marketId: z.string().min(1, "Market is required"),
  eventId: z.string().min(1, "Event is required"),
  // oddsData will be auto-populated or manually entered if event has no mock data
  oddsData: z.string().min(10, "Odds data is required (JSON format)").refine(val => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Invalid JSON format"),
});

type AIFormValues = z.infer<typeof formSchema>;

export function AIAssistantForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestBetOutput | null>(null);
  
  const form = useForm<AIFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sportId: '',
      marketId: '',
      eventId: '',
      oddsData: '',
    },
  });

  const selectedSportId = form.watch('sportId');
  const selectedMarketId = form.watch('marketId');

  const availableMarkets = useMemo(() => {
    if (!selectedSportId) return MOCK_MARKETS;
    return MOCK_MARKETS.filter(market => market.sportId === selectedSportId);
  }, [selectedSportId]);

  const availableEvents = useMemo(() => {
    if (!selectedMarketId) return MOCK_EVENTS;
    const market = MOCK_MARKETS.find(m => m.id === selectedMarketId);
    if (!market) return MOCK_EVENTS;
    return MOCK_EVENTS.filter(event => event.sport.toLowerCase().replace(/\s+/g, '-') === market.sportId && event.market === market.name);
  }, [selectedMarketId]);
  
  useEffect(() => {
    const eventId = form.getValues('eventId');
    if (eventId) {
      const event = MOCK_EVENTS.find(e => e.id === eventId);
      if (event) {
        const oddsDataPayload = {
          eventName: event.name,
          outcomes: event.outcomes.map(outcome => ({
            name: outcome.name,
            odds: event.odds
              .filter(oddDetail => oddDetail.outcomeName === outcome.name)
              .map(oddDetail => ({ bookmaker: oddDetail.bookmaker, value: oddDetail.odds }))
          }))
        };
        form.setValue('oddsData', JSON.stringify(oddsDataPayload, null, 2));
      } else {
         form.setValue('oddsData', ''); // Clear if event not found
      }
    } else {
       form.setValue('oddsData', ''); // Clear if no event selected
    }
  }, [form.watch('eventId'), form]);


  const onSubmit: SubmitHandler<AIFormValues> = async (data) => {
    setIsLoading(true);
    setSuggestion(null);

    const sport = MOCK_SPORTS.find(s => s.id === data.sportId);
    const market = MOCK_MARKETS.find(m => m.id === data.marketId);
    const event = MOCK_EVENTS.find(e => e.id === data.eventId);
    
    if (!sport || !market || !event) {
      toast({ title: "Error", description: "Invalid selection.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const input: SuggestBetInput = {
      market: `${sport.name} - ${market.name}`,
      event: event.name,
      oddsData: data.oddsData,
    };

    try {
      const result = await suggestBet(input);
      setSuggestion(result);
      toast({ title: "Suggestion Ready!", description: "AI has generated a betting suggestion." });
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({ title: "Error", description: "Failed to get AI suggestion. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary h-6 w-6" />AI Betting Assistant</CardTitle>
          <CardDescription>Get intelligent betting suggestions based on current odds data.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_SPORTS.map(sport => (
                          <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSportId || availableMarkets.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a market" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableMarkets.map(market => (
                          <SelectItem key={market.id} value={market.id}>{market.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMarketId || availableEvents.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an event" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableEvents.map(event => (
                          <SelectItem key={event.id} value={event.id}>{event.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oddsData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odds Data (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter aggregated odds data in JSON format, or select an event to auto-fill."
                        className="min-h-[150px] font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Get Suggestion
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card className="shadow-lg flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Generating suggestion...</p>
        </Card>
      )}

      {suggestion && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary h-6 w-6" />AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">Suggested Bet:</h4>
              <p className="text-primary text-xl font-bold">{suggestion.suggestion}</p>
            </div>
            <div>
              <h4 className="font-semibold">Reasoning:</h4>
              <p className="text-muted-foreground">{suggestion.reasoning}</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-1"><BarChartBig className="h-4 w-4" />Confidence Score:</h4>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${suggestion.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="font-bold text-accent">{(suggestion.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
