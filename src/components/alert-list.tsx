
"use client";

import React from 'react';
import type { AlertConfig } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit3, BellRing, ListChecks } from 'lucide-react';

interface AlertListProps {
  alerts: AlertConfig[];
  onDeleteAlert: (alertId: string) => void;
  onEditAlert: (alert: AlertConfig) => void; 
}

export function AlertList({ alerts, onDeleteAlert, onEditAlert }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary h-6 w-6" />Your Alerts</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <BellRing className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">You haven't set any odds alerts yet.</p>
          <p className="text-sm text-muted-foreground">Create one using the form above to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ListChecks className="text-primary h-6 w-6" />Your Active Alerts</CardTitle>
        <CardDescription>Manage your configured odds alerts below.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li key={alert.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card hover:shadow-md transition-shadow">
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{alert.eventName}</h3>
                <p className="text-sm text-muted-foreground">{alert.sport} - {alert.outcomeName}</p>
                <Badge variant="outline" className="mt-1">
                  Notify if odds {alert.operator === '>=' ? '≥' : '≤'} {alert.targetOdds.toFixed(2)}
                </Badge>
              </div>
              <div className="flex gap-2 flex-shrink-0 self-end sm:self-center">
                <Button variant="outline" size="icon" onClick={() => onEditAlert(alert)} aria-label="Edit alert">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDeleteAlert(alert.id)} aria-label="Delete alert">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
