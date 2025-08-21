import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { Employee } from '@/types/auth';

interface LeaderboardProps {
  employees: Employee[];
}

export const Leaderboard = ({ employees }: LeaderboardProps) => {
  const sortedEmployees = [...employees]
    .filter(emp => emp.points !== undefined)
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Champion</Badge>;
    if (index === 1) return <Badge className="bg-gray-400/20 text-gray-700 border-gray-400/30">Runner-up</Badge>;
    if (index === 2) return <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">Third Place</Badge>;
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEmployees.map((employee, index) => (
            <div
              key={employee.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                index < 3 ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(index)}
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{employee.points || 0} pts</span>
                {getRankBadge(index)}
              </div>
            </div>
          ))}
          
          {sortedEmployees.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No employees with points yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};