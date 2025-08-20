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
  mandatoryTasksCompleted: boolean;
}

export interface Manager extends User {
  type: 'manager';
}


export interface AuthContextType {
  user: User | null;
  login: (id: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}