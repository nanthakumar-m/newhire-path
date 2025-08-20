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
          department: 'Engineering',
          onboardingDate: '2024-01-15',
          completedTasks: [1, 2, 3, 4, 5, 6, 7],
          mandatoryTasksCompleted: true
        },
        {
          id: '2',
          name: 'Mike Chen',
          type: 'employee',
          employeeId: 'EMP002',
          department: 'Engineering',
          onboardingDate: '2024-01-20',
          completedTasks: [1, 2, 3, 4, 5, 8],
          mandatoryTasksCompleted: true
        },
        {
          id: '3',
          name: 'Emma Davis',
          type: 'employee',
          employeeId: 'EMP003',
          department: 'Marketing',
          onboardingDate: '2024-01-10',
          completedTasks: [1, 2, 4, 5, 6, 7, 8, 9],
          mandatoryTasksCompleted: true
        }
      ];
      localStorage.setItem('employees', JSON.stringify(sampleEmployees));
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