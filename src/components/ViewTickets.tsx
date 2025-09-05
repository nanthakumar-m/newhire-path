import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types/ticket';

interface ViewTicketsProps {
  onBack: () => void;
}

export const ViewTickets = ({ onBack }: ViewTicketsProps) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const userTickets = allTickets.filter((ticket: Ticket) => ticket.associateId === user?.associateId);
    setTickets(userTickets);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Ticket History</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Submitted Tickets ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No tickets submitted yet</p>
              <p className="text-muted-foreground">Your ticket history will appear here once you submit your first ticket.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Application Name</TableHead>
                    <TableHead>Assigned Group</TableHead>
                    <TableHead>Ticket Status</TableHead>
                    <TableHead>SLA Met</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">{ticket.incidentId}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>{ticket.applicationName}</TableCell>
                      <TableCell>{ticket.assignedGroup}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.ticketStatus === 'Resolved' ? "default" : "destructive"}>
                          {ticket.ticketStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {ticket.ticketStatus === 'Resolved' ? (
                          <Badge variant={ticket.slaMet ? "default" : "destructive"}>
                            {ticket.slaMet ? "Yes" : "No"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {ticket.reasonForDelay ? (
                          <span className="text-sm text-muted-foreground">
                            {ticket.reasonForDelay.length > 50 
                              ? `${ticket.reasonForDelay.substring(0, 50)}...` 
                              : ticket.reasonForDelay}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};