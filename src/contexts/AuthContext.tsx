import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Manager, Associate, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with sample employees if none exist - always refresh for testing
    const existingAssociates = localStorage.getItem('associates');
    // Clear old data to ensure new format
    localStorage.removeItem('associates');
    if (true) {
      const sampleAssociates: Associate[] = [
        {
          id: '1',
          name: 'Raguram',
          type: 'associate',
          associateId: '2398148',
          department: 'DE',
          onboardingDate: '2024-01-15',
          completedTasks: [],
          mandatoryTasksCompleted: false,
          taskCompletionDates: {}
        },
        {
          id: '2',
          name: 'Hariharan',
          type: 'associate',
          associateId: '2397429',
          department: 'SAP',
          onboardingDate: '2024-01-20',
          completedTasks: [],
          mandatoryTasksCompleted: false,
          taskCompletionDates: {}
        },
        {
          id: '3',
          name: 'Mohammed',
          type: 'associate',
          associateId: '2396573',
          department: 'IoT',
          onboardingDate: '2024-01-10',
          completedTasks: [],
          mandatoryTasksCompleted: false,
          taskCompletionDates: {}
        }
      ];
      localStorage.setItem('associates', JSON.stringify(sampleAssociates));
    }

    // Initialize with sample tasks if none exist
    const existingTasks = localStorage.getItem('tasks');
    if (!existingTasks) {
      const sampleTasks = [
        { id: 1, name: 'ODC Access', deadline: '2024-02-10' },
        { id: 2, name: 'People Soft HCM Update', deadline: '2024-02-12' },
        { id: 3, name: 'VDI Access Request', deadline: '2024-02-14' },
        { id: 4, name: 'Cargill Onboarding', deadline: '2024-02-15' },
        { id: 5, name: 'AWS', deadline: '2024-02-18' },
        { id: 6, name: 'Gen AI', deadline: '2024-02-20' },
        { id: 7, name: 'CyberSecurity', deadline: '2024-02-22' },
        { id: 8, name: 'Cargill Mandatory Course 1', deadline: '2024-02-25' },
        { id: 9, name: 'Cargill Mandatory Course 2', deadline: '2024-02-28' },
        { id: 10, name: 'Cargill Mandatory Course 3', deadline: '2024-03-02' },
        { id: 11, name: 'Complete KT', deadline: '2024-03-05' },
        { id: 12, name: 'Complete Reverse KT', deadline: '2024-03-08' }
      ];
      localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (id: string, password: string): boolean => {
    // Manager login - ID: 12345, Password: manager
    if (id === '12345' && password === 'manager') {
      const manager: Manager = {
        id: 'manager',
        name: 'Manager',
        type: 'manager'
      };
      setUser(manager);
      localStorage.setItem('currentUser', JSON.stringify(manager));
      return true;
    }
    
    // Associate login - Associate ID for both username and password
    const associates = JSON.parse(localStorage.getItem('associates') || '[]');
    const associate = associates.find((emp: Associate) => 
      emp.associateId === id && emp.associateId === password
    );
    
    if (associate) {
      setUser(associate);
      localStorage.setItem('currentUser', JSON.stringify(associate));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};