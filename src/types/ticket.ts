export interface Ticket {
  id: string;
  associateId: string;
  associateName: string;
  incidentId: string;
  customer: string;
  assignedGroup: string;
  priority: string;
  applicationName: string;
  ticketStatus: 'Resolved' | 'Canceled';
  slaMet?: boolean;
  reasonForDelay?: string;
  submittedAt: string;
}

export interface TicketFormData {
  associateId: string;
  associateName: string;
  incidentId: string;
  customer: string;
  assignedGroup: string;
  priority: string;
  applicationName: string;
  ticketStatus: 'Resolved' | 'Canceled';
  slaMet?: boolean;
  reasonForDelay?: string;
}