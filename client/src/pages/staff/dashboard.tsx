import { Users, CreditCard, Receipt, AlertCircle, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const pendingLoans = [
  {
    id: "1",
    memberName: "Jane Wanjiku",
    loanNumber: "LN123456789",
    amount: "75000.00",
    type: "business",
    appliedAt: "2024-11-14T10:30:00Z",
    creditScore: 680,
  },
  {
    id: "2",
    memberName: "Peter Kamau",
    loanNumber: "LN123456790",
    amount: "30000.00",
    type: "emergency",
    appliedAt: "2024-11-15T14:20:00Z",
    creditScore: 720,
  },
];

const recentMembers = [
  {
    id: "1",
    name: "Alice Nyambura",
    memberNumber: "APL123456",
    joinedAt: "2024-11-14T09:00:00Z",
    status: "pending",
  },
  {
    id: "2",
    name: "David Omondi",
    memberNumber: "APL123457",
    joinedAt: "2024-11-15T11:30:00Z",
    status: "verified",
  },
];

export default function StaffDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
        <p className="text-muted-foreground">Manage members, process transactions, and approve loans</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value="1,247"
          icon={Users}
          trend={{ value: 8.1, isPositive: true }}
          description="Active members"
        />
        <StatCard
          title="Pending Loans"
          value="12"
          icon={CreditCard}
          description="Awaiting approval"
        />
        <StatCard
          title="Today's Transactions"
          value="45"
          icon={Receipt}
          trend={{ value: 12.3, isPositive: true }}
        />
        <StatCard
          title="Overdue Loans"
          value="7"
          icon={AlertCircle}
          description="Require attention"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Pending Loan Applications</CardTitle>
            <Badge variant="secondary">{pendingLoans.length} pending</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingLoans.map((loan) => (
              <div key={loan.id} className="flex items-center gap-4 p-4 rounded-lg border hover-elevate transition-all">
                <div className="flex-1">
                  <p className="font-medium">{loan.memberName}</p>
                  <p className="text-sm text-muted-foreground">{loan.loanNumber} • {loan.type.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">Credit Score: {loan.creditScore}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold tabular-nums">KES {parseFloat(loan.amount).toLocaleString()}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" data-testid={`button-review-${loan.id}`}>
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Recent Member Registrations</CardTitle>
            <Badge variant="secondary">{recentMembers.length} new</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border hover-elevate transition-all">
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.memberNumber}</p>
                </div>
                <Badge className={member.status === 'verified' ? 'bg-success text-white' : 'bg-warning text-white'}>
                  {member.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/staff/members")}
            data-testid="button-quick-add-member"
          >
            <Users className="h-4 w-4" />
            View Members
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/staff/transactions")}
            data-testid="button-quick-process-transaction"
          >
            <Receipt className="h-4 w-4" />
            Process Transaction
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/staff/loans")}
            data-testid="button-quick-approve-loan"
          >
            <CreditCard className="h-4 w-4" />
            Review Loans
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/staff/reports")}
            data-testid="button-quick-generate-report"
          >
            <TrendingUp className="h-4 w-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
