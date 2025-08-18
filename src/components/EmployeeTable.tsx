import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { Employee } from "@/types/auth";

interface EmployeeTableProps {
  taskTitle: string;
  taskId: number;
}

// Employee data will be loaded from localStorage

const taskNames = [
  "Safety Course",
  "IT Access Setup", 
  "Manager Meetings",
  "HR Documentation",
  "Team Introductions",
  "Culture Overview",
  "Security Training",
  "Office Tour",
  "Benefits Session",
  "Dev Environment"
];

export const EmployeeTable = ({ taskTitle, taskId }: EmployeeTableProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees') || '[]');
    setEmployees(storedEmployees);
  }, []);

  const getOverallCompletion = (completedTasks: number[]) => {
    return Math.round((completedTasks.length / 10) * 100);
  };

  const getTaskStatus = (employeeCompletedTasks: number[], taskIndex: number) => {
    return employeeCompletedTasks.includes(taskIndex);
  };

  const filteredEmployees = employees.filter(employee => {
    if (filter === 'completed') {
      return getTaskStatus(employee.completedTasks, taskId);
    } else if (filter === 'pending') {
      return !getTaskStatus(employee.completedTasks, taskId);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Employee Status for: {taskTitle}</h3>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(value: 'all' | 'completed' | 'pending') => setFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Overall Progress</TableHead>
              <TableHead>Task Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getOverallCompletion(employee.completedTasks)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTaskStatus(employee.completedTasks, taskId) ? (
                      <div className="flex items-center gap-1 text-success">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredEmployees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No employees found for the selected filter
        </div>
      )}
    </div>
  );
};