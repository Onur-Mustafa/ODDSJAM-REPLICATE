
"use client";

import React, { useState, useEffect } from 'react';
import { AlertForm } from "@/components/alert-form";
import { AlertList } from "@/components/alert-list";
import type { AlertConfig } from '@/types';
import { MOCK_ALERTS } from '@/data/mock-data'; // Initial mock alerts
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const ALERTS_STORAGE_KEY = 'oddsWiseAlerts';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>([]);
  const [editingAlert, setEditingAlert] = useState<AlertConfig | undefined>(undefined);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Load alerts from local storage on component mount
    const storedAlerts = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    } else {
      // If no alerts in local storage, use mock data as initial state
      setAlerts(MOCK_ALERTS); 
    }
  }, []);

  useEffect(() => {
    // Save alerts to local storage whenever they change
    if (alerts.length > 0 || localStorage.getItem(ALERTS_STORAGE_KEY)) { // only save if alerts exist or existed
        localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    }
  }, [alerts]);

  const handleAddAlert = (newAlert: AlertConfig) => {
    setAlerts(prevAlerts => {
      const existingIndex = prevAlerts.findIndex(a => a.id === newAlert.id);
      if (existingIndex > -1) {
        // Update existing alert
        const updatedAlerts = [...prevAlerts];
        updatedAlerts[existingIndex] = newAlert;
        return updatedAlerts;
      }
      // Add new alert
      return [newAlert, ...prevAlerts];
    });
    setIsEditModalOpen(false); // Close modal after adding/updating
    setEditingAlert(undefined);
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  };

  const handleEditAlert = (alert: AlertConfig) => {
    setEditingAlert(alert);
    setIsEditModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingAlert(undefined);
  }

  return (
    <div className="space-y-8">
      <AlertForm onAddAlert={handleAddAlert} />
      <AlertList alerts={alerts} onDeleteAlert={handleDeleteAlert} onEditAlert={handleEditAlert} />

      {editingAlert && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Alert</DialogTitle>
              <DialogDescription>
                Modify the details of your odds alert. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <AlertForm onAddAlert={handleAddAlert} existingAlert={editingAlert} />
            {/* Footer can be removed if AlertForm has its own submit */}
            {/* <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseModal}>Cancel</Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export const metadata = {
  title: "Odds Alerts",
};
