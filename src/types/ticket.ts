export interface Ticket {
  id: string;
  employeeId: string;
  employeeName: string;
  incidentId: string;
  applicationName: string;
  applicationGroupName: string;
  deadlineMet: boolean;
  reasonForDelay?: string;
  submittedAt: string;
}

export interface TicketFormData {
  incidentId: string;
  applicationName: string;
  applicationGroupName: string;
  deadlineMet: boolean;
  reasonForDelay?: string;
}