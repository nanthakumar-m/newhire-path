import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Filter } from "lucide-react";
import { Associate } from "@/types/auth";

interface AssociateTableProps {
  taskTitle: string;
  taskId: number;
}

// Associate data will be loaded from localStorage

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

export const AssociateTable = ({ taskTitle, taskId }: AssociateTableProps) => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const storedAssociates = JSON.parse(localStorage.getItem('associates') || '[]');
    setAssociates(storedAssociates);
  }, []);

  const getOverallCompletion = (completedTasks: number[]) => {
    return Math.round((completedTasks.length / 10) * 100);
  };

  const getTaskStatus = (associateCompletedTasks: number[], taskIndex: number) => {
    return associateCompletedTasks.includes(taskIndex);
  };

  const filteredAssociates = associates.filter(associate => {
    if (filter === 'completed') {
      return getTaskStatus(associate.completedTasks, taskId);
    } else if (filter === 'pending') {
      return !getTaskStatus(associate.completedTasks, taskId);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Associate Status for: {taskTitle}</h3>
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
              <TableHead>Associate ID</TableHead>
              <TableHead>Service Line</TableHead>
              <TableHead>Overall Progress</TableHead>
              <TableHead>Task Status</TableHead>
              {(taskId === 11 || taskId === 12) && (
                <>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociates.map((associate) => (
              <TableRow key={associate.id}>
                <TableCell className="font-medium">{associate.name}</TableCell>
                <TableCell>{associate.associateId}</TableCell>
                <TableCell>{associate.department}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getOverallCompletion(associate.completedTasks)}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTaskStatus(associate.completedTasks, taskId) ? (
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
                {(taskId === 11 || taskId === 12) && (
                  <>
                    <TableCell>
                      {associate.taskCompletionDates?.[taskId]?.startDate ? (
                        <span className="text-sm">
                          {new Date(associate.taskCompletionDates[taskId].startDate!).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {associate.taskCompletionDates?.[taskId]?.endDate ? (
                        <span className="text-sm">
                          {new Date(associate.taskCompletionDates[taskId].endDate!).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredAssociates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No associates found for the selected filter
        </div>
      )}
    </div>
  );
};