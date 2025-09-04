import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Manager, Employee, AuthContextType } from '@/types/auth';

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
    // Initialize with sample employees if none exist
    const existingEmployees = localStorage.getItem('employees');
    if (!existingEmployees) {
      const sampleEmployees: Employee[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          type: 'employee',
          employeeId: 'EMP001',
          department: 'DE',
          onboardingDate: '2024-01-15',
          completedTasks: [],
          mandatoryTasksCompleted: false
        },
        {
          id: '2',
          name: 'Mike Chen',
          type: 'employee',
          employeeId: 'EMP002',
          department: 'SAP',
          onboardingDate: '2024-01-20',
          completedTasks: [],
          mandatoryTasksCompleted: false
        },
        {
          id: '3',
          name: 'Emma Davis',
          type: 'employee',
          employeeId: 'EMP003',
          department: 'IoT',
          onboardingDate: '2024-01-10',
          completedTasks: [],
          mandatoryTasksCompleted: false
        }
      ];
      localStorage.setItem('employees', JSON.stringify(sampleEmployees));
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
    
    // Employee login - Employee ID for both username and password
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employee = employees.find((emp: Employee) => 
      emp.employeeId === id && emp.employeeId === password
    );
    
    if (employee) {
      setUser(employee);
      localStorage.setItem('currentUser', JSON.stringify(employee));
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