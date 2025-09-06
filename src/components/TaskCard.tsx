import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, CheckCircle, Clock, ArrowRight, Lock, Star } from 'lucide-react';
import { useState } from 'react';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  deadline: string;
  isCompleted: boolean;
  onToggleComplete: (id: number, dates?: { startDate: string; endDate: string }) => void;
  isLocked?: boolean;
}

export const TaskCard = ({ id, title, description, deadline, isCompleted, onToggleComplete, isLocked = false }: TaskCardProps) => {
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isKTTask = id === 11 || id === 12; // Complete KT or Reverse KT

  const handleMarkComplete = () => {
    if (isKTTask && !isCompleted) {
      setShowDateDialog(true);
    } else {
      onToggleComplete(id);
    }
  };

  const handleDateSubmit = () => {
    if (!startDate || !endDate) return;
    
    onToggleComplete(id, { startDate, endDate });
    setShowDateDialog(false);
    setStartDate('');
    setEndDate('');
  };

  return (
    <>
      <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
        isLocked ? 'border-l-muted bg-muted/30 opacity-60' : 
        isCompleted ? 'border-l-success/50 bg-success/5' : 'border-l-primary/20'
      }`}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-lg ${isLocked ? 'text-muted-foreground' : 'text-primary'}`}>
                    {title}
                  </h3>
                  {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <p className={`text-sm leading-relaxed ${isLocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                  {description}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due: {deadline}</span>
                  </div>
                </div>
                {isLocked && (
                  <p className="text-xs text-warning">
                    Complete the previous task to unlock this one
                  </p>
                )}
              </div>
              <Badge 
                variant={isCompleted ? "default" : isLocked ? "outline" : "secondary"} 
                className={`ml-4 ${
                  isCompleted ? 'bg-success text-success-foreground' : 
                  isLocked ? 'text-muted-foreground' : ''
                }`}
              >
                {isCompleted ? (
                  <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                ) : isLocked ? (
                  <><Lock className="h-3 w-3 mr-1" /> Locked</>
                ) : (
                  <><Calendar className="h-3 w-3 mr-1" /> Pending</>
                )}
              </Badge>
            </div>
            
            {!isLocked && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleMarkComplete} 
                  variant={isCompleted ? "outline" : "default"}
                  size="sm"
                  className="px-4 py-2 text-sm"
                >
                  {isCompleted ? (
                    <>
                      <Clock className="h-3 w-3 mr-2" />
                      Mark Incomplete
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {id === 11 ? 'Complete KT Dates' : 'Complete Reverse KT Dates'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">
                {id === 11 ? 'KT Start Date' : 'Reverse KT Start Date'}
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">
                {id === 11 ? 'KT End Date' : 'Reverse KT End Date'}
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDateSubmit} disabled={!startDate || !endDate}>
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};