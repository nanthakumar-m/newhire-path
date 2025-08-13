import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  domain: string;
  managerName: string;
  completedTasks: number[];
}

interface EmployeeTableProps {
  taskTitle: string;
  taskId: number;
}

const employeeData: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    employeeId: "EMP001",
    domain: "Engineering",
    managerName: "John Smith",
    completedTasks: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: "2",
    name: "Mike Chen",
    employeeId: "EMP002",
    domain: "Engineering",
    managerName: "John Smith",
    completedTasks: [1, 2, 3, 4, 5, 8]
  },
  {
    id: "3",
    name: "Emma Davis",
    employeeId: "EMP003",
    domain: "Marketing",
    managerName: "Lisa Wong",
    completedTasks: [1, 2, 4, 5, 6, 7, 8, 9]
  },
  {
    id: "4",
    name: "Alex Rodriguez",
    employeeId: "EMP004",
    domain: "Sales",
    managerName: "Mark Taylor",
    completedTasks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "5",
    name: "Jessica Liu",
    employeeId: "EMP005",
    domain: "HR",
    managerName: "Karen Brown",
    completedTasks: [1, 2, 3, 5]
  },
  {
    id: "6",
    name: "David Park",
    employeeId: "EMP006",
    domain: "Engineering",
    managerName: "John Smith",
    completedTasks: [1, 3, 4, 6, 7]
  },
  {
    id: "7",
    name: "Maria Garcia",
    employeeId: "EMP007",
    domain: "Finance",
    managerName: "Robert Kim",
    completedTasks: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  {
    id: "8",
    name: "James Wilson",
    employeeId: "EMP008",
    domain: "Marketing",
    managerName: "Lisa Wong",
    completedTasks: [1, 2, 4, 5, 9]
  }
];

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
  const getOverallCompletion = (completedTasks: number[]) => {
    return Math.round((completedTasks.length / 10) * 100);
  };

  const getTaskStatus = (employeeCompletedTasks: number[], taskIndex: number) => {
    return employeeCompletedTasks.includes(taskIndex + 1);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Employee Status for: {taskTitle}</h3>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Overall Progress</TableHead>
              <TableHead>Task Status</TableHead>
              <TableHead>All Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeData.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.domain}</TableCell>
                <TableCell>{employee.managerName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getOverallCompletion(employee.completedTasks)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTaskStatus(employee.completedTasks, taskId - 1) ? (
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
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {taskNames.map((taskName, index) => (
                      <Badge
                        key={index}
                        variant={getTaskStatus(employee.completedTasks, index) ? "default" : "outline"}
                        className="text-xs"
                      >
                        {index + 1}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};