import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Associate } from "@/types/auth";
import { format } from "date-fns";
import { Eye } from "lucide-react";

interface AssociateListTableProps {
  title: string;
  associates: Associate[];
  type: 'total' | 'onboarded' | 'in-progress' | 'not-started';
}

export const AssociateListTable = ({ title, associates, type }: AssociateListTableProps) => {
  const getStatusBadge = (associate: Associate) => {
    const completionRate = (associate.completedTasks.length / 10) * 100;
    
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
          <DialogTitle>{title} ({associates.length} associates)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Associate ID</TableHead>
                  <TableHead>Service Line</TableHead>
                  <TableHead>Onboarding Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {associates.map((associate) => (
                  <TableRow key={associate.id}>
                    <TableCell className="font-medium">{associate.name}</TableCell>
                    <TableCell>{associate.associateId}</TableCell>
                    <TableCell>{associate.department}</TableCell>
                    <TableCell>{format(new Date(associate.onboardingDate), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(associate.completedTasks)}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {getProgressPercentage(associate.completedTasks)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(associate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {associates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No associates in this category
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};