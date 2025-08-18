export interface User {
  id: string;
  name: string;
  type: 'manager' | 'employee';
  employeeId?: string;
  department?: string;
  onboardingDate?: string;
}

export interface Employee extends User {
  type: 'employee';
  employeeId: string;
  department: string;
  onboardingDate: string;
  completedTasks: number[];
  taskSubmissions: { [taskId: number]: TaskSubmission };
}

export interface Manager extends User {
  type: 'manager';
}

export interface TaskSubmission {
  taskId: number;
  employeeId: string;
  screenshots: string[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  managerFeedback?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, userType: 'manager' | 'employee') => boolean;
  logout: () => void;
  isLoading: boolean;
}