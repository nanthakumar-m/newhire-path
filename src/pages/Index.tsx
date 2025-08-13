import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";
import { ManagerDashboard } from "@/components/ManagerDashboard";
import { Users, UserCheck } from "lucide-react";

const Index = () => {
  const [viewMode, setViewMode] = useState<"employee" | "manager">("employee");

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
                <h1 className="text-xl font-semibold text-foreground">NewHire Path</h1>
                <p className="text-sm text-muted-foreground">Employee Onboarding Platform</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "employee" ? "default" : "outline"}
                onClick={() => setViewMode("employee")}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Employee View
              </Button>
              <Button
                variant={viewMode === "manager" ? "default" : "outline"}
                onClick={() => setViewMode("manager")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Manager View
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {viewMode === "employee" ? <EmployeeDashboard /> : <ManagerDashboard />}
      </main>
    </div>
  );
};

export default Index;