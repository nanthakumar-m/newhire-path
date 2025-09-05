import { Button } from "@/components/ui/button";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Users, LogOut } from "lucide-react";

const Index = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">GenC Tracker</h1>
                <p className="text-sm text-muted-foreground">Employee Onboarding Platform</p>
              </div>
            </div>
            
            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.type}</p>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {user?.type === "employee" ? <EmployeeDashboard /> : <ManagerDashboard />}
      </main>
    </div>
  );
};

export default Index;