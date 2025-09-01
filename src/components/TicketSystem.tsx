import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import { AddTicketForm } from './AddTicketForm';
import { ViewTickets } from './ViewTickets';

export const TicketSystem = () => {
  const [activeView, setActiveView] = useState<'menu' | 'add' | 'view'>('menu');

  if (activeView === 'add') {
    return <AddTicketForm onBack={() => setActiveView('menu')} />;
  }

  if (activeView === 'view') {
    return <ViewTickets onBack={() => setActiveView('menu')} />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">GenC Ticket Management</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your incident tickets and track application issues efficiently
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20" 
              onClick={() => setActiveView('add')}>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Add New Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              Submit a new incident ticket with application details and deadline status
            </p>
            <Button className="w-full mt-4" onClick={() => setActiveView('add')}>
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => setActiveView('view')}>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <History className="h-6 w-6 text-secondary-foreground" />
            </div>
            <CardTitle className="text-xl">View Ticket History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center">
              View all your submitted tickets and track their status
            </p>
            <Button variant="secondary" className="w-full mt-4" onClick={() => setActiveView('view')}>
              View History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};