import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, User } from 'lucide-react';
import { Ticket } from '@/types/ticket';

interface GenCTicketTrackingProps {
  onBack: () => void;
}

export const GenCTicketTracking = ({ onBack }: GenCTicketTrackingProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  useEffect(() => {
    loadAllTickets();
  }, []);

  const loadAllTickets = () => {
    const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    setTickets(allTickets);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEmployeeTickets = (associateId: string) => {
    return tickets.filter(ticket => ticket.associateId === associateId);
  };

  const uniqueEmployees = Array.from(new Set(tickets.map(ticket => ticket.associateId)));

  if (selectedEmployee) {
    const employeeTickets = getEmployeeTickets(selectedEmployee);
    const employeeName = employeeTickets[0]?.associateName || 'Unknown Associate';

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Tickets
          </Button>
          <h1 className="text-2xl font-bold">Tickets by {employeeName}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Associate ID: {selectedEmployee} | Total Tickets: {employeeTickets.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  {employeeTickets.map((ticket) => (
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">GenC Ticket Tracking</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All GenC Tickets ({tickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No tickets submitted yet</p>
              <p className="text-muted-foreground">Ticket submissions from GenC employees will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Associate ID</TableHead>
                    <TableHead>Associate Name</TableHead>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Ticket Status</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <Button 
                          variant="link" 
                          onClick={() => setSelectedEmployee(ticket.associateId)}
                          className="p-0 h-auto font-mono text-primary hover:underline"
                        >
                          {ticket.associateId}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="link" 
                          onClick={() => setSelectedEmployee(ticket.associateId)}
                          className="p-0 h-auto text-primary hover:underline"
                        >
                          {ticket.associateName}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono">{ticket.incidentId}</TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>{ticket.priority}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.ticketStatus === 'Resolved' ? "default" : "destructive"}>
                          {ticket.ticketStatus}
                        </Badge>
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