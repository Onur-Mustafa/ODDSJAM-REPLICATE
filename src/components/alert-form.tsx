
"use client";

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { AlertConfig } from '@/types';
import { MOCK_EVENTS, MOCK_SPORTS } from '@/data/mock-data'; // Assuming MOCK_OUTCOMES is part of MOCK_EVENTS
import { BellPlus, Loader2 } from 'lucide-react';

const alertFormSchema = z.object({
  sportId: z.string().min(1, "Sport is required"),
  eventId: z.string().min(1, "Event is required"),
  outcomeName: z.string().min(1, "Outcome is required"),
  targetOdds: z.coerce.number().min(1.01, "Target odds must be at least 1.01"),
  operator: z.enum(['>=', '<=']),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

interface AlertFormProps {
  onAddAlert: (alert: AlertConfig) => void;
  existingAlert?: AlertConfig; // For editing
}

export function AlertForm({ onAddAlert, existingAlert }: AlertFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: existingAlert ? {
      sportId: MOCK_SPORTS.find(s => s.name === existingAlert.sport)?.id || '',
      eventId: existingAlert.eventId,
      outcomeName: existingAlert.outcomeName,
      targetOdds: existingAlert.targetOdds,
      operator: existingAlert.operator,
    } : {
      sportId: '',
      eventId: '',
      outcomeName: '',
      targetOdds: 1.5,
      operator: '>=',
    },
  });

  const selectedSportId = form.watch('sportId');
  const selectedEventId = form.watch('eventId');

  const availableEvents = React.useMemo(() => {
    if (!selectedSportId) return [];
    const sport = MOCK_SPORTS.find(s => s.id === selectedSportId);
    if (!sport) return [];
    return MOCK_EVENTS.filter(event => event.sport === sport.name);
  }, [selectedSportId]);

  const availableOutcomes = React.useMemo(() => {
    if (!selectedEventId) return [];
    const event = MOCK_EVENTS.find(e => e.id === selectedEventId);
    return event ? event.outcomes : [];
  }, [selectedEventId]);
  
  // Reset event and outcome if sport changes
  React.useEffect(() => {
    form.setValue('eventId', '');
    form.setValue('outcomeName', '');
  }, [selectedSportId, form]);

  // Reset outcome if event changes
  React.useEffect(() => {
    form.setValue('outcomeName', '');
  }, [selectedEventId, form]);


  const onSubmit: SubmitHandler<AlertFormValues> = async (data) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const event = MOCK_EVENTS.find(e => e.id === data.eventId);
    const sport = MOCK_SPORTS.find(s => s.id === data.sportId);

    if (!event || !sport) {
       toast({ title: "Error", description: "Invalid event or sport selected.", variant: "destructive" });
       setIsLoading(false);
       return;
    }

    const newAlert: AlertConfig = {
      id: existingAlert ? existingAlert.id : crypto.randomUUID(),
      eventId: data.eventId,
      eventName: event.name,
      sport: sport.name,
      outcomeName: data.outcomeName,
      targetOdds: data.targetOdds,
      operator: data.operator,
    };

    onAddAlert(newAlert);
    toast({ title: existingAlert ? "Alert Updated!" : "Alert Created!", description: `You'll be notified for ${event.name} - ${data.outcomeName}.` });
    if (!existingAlert) form.reset();
    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BellPlus className="text-primary h-6 w-6" />{existingAlert ? 'Edit Alert' : 'Create Odds Alert'}</CardTitle>
        <CardDescription>Get notified when odds reach your desired target.</CardDescription>
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
                      <SelectTrigger><SelectValue placeholder="Select Sport" /></SelectTrigger>
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
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSportId || availableEvents.length === 0}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select Event" /></SelectTrigger>
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
              name="outcomeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Outcome</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedEventId || availableOutcomes.length === 0}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select Outcome" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableOutcomes.map(outcome => (
                        <SelectItem key={outcome.name} value={outcome.name}>{outcome.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem className="flex-shrink-0">
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value=">=">Odds &ge;</SelectItem>
                        <SelectItem value="<=">Odds &le;</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetOdds"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Target Odds</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 2.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BellPlus className="mr-2 h-4 w-4" />}
              {existingAlert ? 'Update Alert' : 'Set Alert'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
