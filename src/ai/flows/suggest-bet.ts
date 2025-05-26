'use server';

/**
 * @fileOverview Provides AI-powered betting suggestions based on aggregated odds data.
 *
 * - suggestBet - A function that generates betting suggestions.
 * - SuggestBetInput - The input type for the suggestBet function.
 * - SuggestBetOutput - The return type for the suggestBet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBetInputSchema = z.object({
  market: z.string().describe('The betting market (e.g., NFL, NBA, Soccer).'),
  event: z.string().describe('The specific event to bet on (e.g., Super Bowl, NBA Finals).'),
  oddsData: z.string().describe('Aggregated odds data for the event, in JSON format.'),
});
export type SuggestBetInput = z.infer<typeof SuggestBetInputSchema>;

const SuggestBetOutputSchema = z.object({
  suggestion: z.string().describe('An AI-powered betting suggestion based on the odds data.'),
  reasoning: z.string().describe('The reasoning behind the suggested bet.'),
  confidence: z.number().describe('A confidence score (0-1) for the suggested bet.'),
});
export type SuggestBetOutput = z.infer<typeof SuggestBetOutputSchema>;

export async function suggestBet(input: SuggestBetInput): Promise<SuggestBetOutput> {
  return suggestBetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBetPrompt',
  input: {schema: SuggestBetInputSchema},
  output: {schema: SuggestBetOutputSchema},
  prompt: `You are an AI betting assistant that provides intelligent betting suggestions.

  Based on the following odds data for the {{{event}}} in the {{{market}}},
  provide a single betting suggestion, the reasoning behind it, and a confidence score (0-1).

  Odds Data:
  {{oddsData}}
  `,
});

const suggestBetFlow = ai.defineFlow(
  {
    name: 'suggestBetFlow',
    inputSchema: SuggestBetInputSchema,
    outputSchema: SuggestBetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
