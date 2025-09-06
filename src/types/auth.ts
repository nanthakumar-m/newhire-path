export interface User {
  id: string;
  name: string;
  type: 'manager' | 'associate';
  associateId?: string;
  department?: string;
  onboardingDate?: string;
}

export interface Associate extends User {
  type: 'associate';
  associateId: string;
  department: string;
  onboardingDate: string;
  completedTasks: number[];
  mandatoryTasksCompleted: boolean;
  taskCompletionDates?: { [taskId: number]: { startDate?: string; endDate?: string } };
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