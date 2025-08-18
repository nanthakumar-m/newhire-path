import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Employee } from "@/types/auth";
import { format } from "date-fns";
import { Eye } from "lucide-react";

interface EmployeeListTableProps {
  title: string;
  employees: Employee[];
  type: 'total' | 'onboarded' | 'in-progress' | 'not-started';
}

export const EmployeeListTable = ({ title, employees, type }: EmployeeListTableProps) => {
  const getStatusBadge = (employee: Employee) => {
    const completionRate = (employee.completedTasks.length / 10) * 100;
    
    if (completionRate === 100) {
      return <Badge variant="default" className="bg-success text-success-foreground">Completed</Badge>;
    } else if (completionRate > 0) {
      return <Badge variant="secondary" className="bg-warning/20 text-warning-foreground">In Progress</Badge>;
    } else {
      return <Badge variant="destructive">Not Started</Badge>;
    }
  };

  const getProgressPercentage = (completedTasks: number[]) => {
    return Math.round((completedTasks.length / 10) * 100);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-auto p-1">
          <Eye className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title} ({employees.length} employees)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Onboarding Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{format(new Date(employee.onboardingDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(employee.completedTasks)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {getProgressPercentage(employee.completedTasks)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(employee)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {employees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No employees in this category
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};