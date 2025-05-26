import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts decimal odds to American odds format.
 * @param decimalOdds The decimal odds (e.g., 2.5, 1.8). Must be > 1.00.
 * @returns American odds as a string (e.g., "+150", "-125"), or "-" if input is invalid.
 */
export function decimalToAmerican(decimalOdds: number): string {
  if (isNaN(decimalOdds) || decimalOdds <= 1.00) {
    return "-"; // Or handle as an error/invalid input
  }

  if (decimalOdds >= 2.00) {
    const american = (decimalOdds - 1) * 100;
    return `+${Math.round(american)}`;
  } else {
    const american = -100 / (decimalOdds - 1);
    return `${Math.round(american)}`;
  }
}

/**
 * Converts American odds string to decimal odds.
 * @param americanOdds The American odds string (e.g., "+150", "-200").
 * @returns Decimal odds as a number, or null if the input format is invalid.
 */
export function americanToDecimal(americanOdds: string): number | null {
  if (typeof americanOdds !== 'string' || americanOdds.length === 0) {
    return null;
  }

  const num = parseInt(americanOdds, 10);
  if (isNaN(num) || (americanOdds.charAt(0) !== '+' && americanOdds.charAt(0) !== '-')) {
    // Allow for numbers without explicit sign if they are negative, e.g. "150" would be treated as +150 by parseInt
    // but we require explicit signs for American odds.
     if (americanOdds.charAt(0) !== '+' && americanOdds.charAt(0) !== '-' || isNaN(parseInt(americanOdds.substring(1),10)) ) {
        return null;
     }
  }


  const value = parseInt(americanOdds.substring(1), 10);
  if (isNaN(value) || value < 100) {
     // Values like +50 or -50 are not standard
     if (!(americanOdds.startsWith('+') || americanOdds.startsWith('-')) || value < 100 ) {
        // Check if it's just a number that could be decimal odds already
        const directDecimal = parseFloat(americanOdds);
        if (!isNaN(directDecimal) && directDecimal > 1.0) return directDecimal; // Allow direct decimal input if user types it
        return null;
     }
  }


  if (num > 0) { // Positive American odds
    return (num / 100) + 1;
  } else if (num < 0) { // Negative American odds
    return (100 / Math.abs(num)) + 1;
  }
  return null; // Should not happen if + or - and value >= 100
}
