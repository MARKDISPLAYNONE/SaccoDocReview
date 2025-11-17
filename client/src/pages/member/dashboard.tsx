import { Wallet, CreditCard, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { TransactionItem } from "@/components/transaction-item";
import { LoanCard } from "@/components/loan-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import type { Transaction, Loan, Account, Member } from "@shared/schema";

type DashboardStats = {
  totalBalance: number;
  totalLoanBalance: number;
  accountsCount: number;
  activeLoansCount: number;
  accounts: Account[];
  loans: Loan[];
  recentTransactions: Transaction[];
};

export default function MemberDashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['/api/stats/dashboard', user?.id, user?.role],
    queryFn: async () => {
      const response = await fetch(`/api/stats/dashboard?role=${user?.role}&userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user?.id && !!user?.role,
  });

  const { data: member } = useQuery<Member>({
    queryKey: ['/api/members/by-user', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/members?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch member');
      const members = await response.json();
      return members[0];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalBalance = stats.totalBalance;
  const totalLoans = stats.totalLoanBalance;
  const firstName = member?.firstName || "Member";
  const avgCreditScore = stats.loans.length > 0 
    ? Math.round(stats.loans.reduce((sum, l) => sum + (l.creditScore || 0), 0) / stats.loans.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back, {firstName}!</h1>
        <p className="text-muted-foreground">Here's your financial overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Savings"
          value={totalBalance}
          icon={Wallet}
          isCurrency
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Active Loans"
          value={totalLoans}
          icon={CreditCard}
          isCurrency
          description={`${stats.activeLoansCount} active ${stats.activeLoansCount === 1 ? 'loan' : 'loans'}`}
        />
        <StatCard
          title="Credit Score"
          value={avgCreditScore}
          icon={TrendingUp}
          trend={{ value: 2.5, isPositive: true }}
          description={avgCreditScore >= 700 ? "Excellent" : avgCreditScore >= 650 ? "Good" : "Fair"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Recent Transactions</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setLocation("/member/transactions")}
              data-testid="button-view-all-transactions"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No recent transactions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Active Loans</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => setLocation("/member/loans")}
              data-testid="button-view-all-loans"
            >
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {stats.loans.length > 0 ? (
              stats.loans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No active loans</p>
            )}
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
            onClick={() => setLocation("/member/accounts")}
            data-testid="button-quick-deposit"
          >
            <Wallet className="h-4 w-4" />
            Make Deposit
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/member/loans")}
            data-testid="button-quick-loan"
          >
            <CreditCard className="h-4 w-4" />
            Apply for Loan
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/member/transactions")}
            data-testid="button-quick-statement"
          >
            <ArrowUpRight className="h-4 w-4" />
            Download Statement
          </Button>
          <Button
            variant="outline"
            className="justify-start gap-2"
            onClick={() => setLocation("/member/profile")}
            data-testid="button-quick-profile"
          >
            <TrendingUp className="h-4 w-4" />
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
