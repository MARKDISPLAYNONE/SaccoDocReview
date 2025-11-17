import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import type { Loan } from "@shared/schema";

interface LoanCardProps {
  loan: Loan & { memberName?: string };
  onViewDetails?: (loan: Loan) => void;
  showMemberName?: boolean;
}

export function LoanCard({ loan, onViewDetails, showMemberName }: LoanCardProps) {
  const getStatusColor = () => {
    switch (loan.status) {
      case 'approved': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-white';
      case 'rejected': return 'bg-error text-white';
      case 'disbursed':
      case 'active': return 'bg-info text-white';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'defaulted': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const progressPercentage = ((parseFloat(loan.principalAmount) - parseFloat(loan.outstandingBalance)) / parseFloat(loan.principalAmount)) * 100;

  return (
    <Card className="hover-elevate transition-all" data-testid={`loan-card-${loan.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{loan.loanNumber}</h3>
              <Badge className={getStatusColor()}>
                {loan.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{loan.loanType.replace(/_/g, ' ')}</p>
            {showMemberName && loan.memberName && (
              <p className="text-xs text-muted-foreground mt-1">{loan.memberName}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Principal</p>
            <p className="text-xl font-bold tabular-nums">{formatCurrency(loan.principalAmount)}</p>
          </div>
        </div>

        {(loan.status === 'active' || loan.status === 'disbursed') && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Repayment Progress</span>
                <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding</span>
                <span className="font-semibold tabular-nums">{formatCurrency(loan.outstandingBalance)}</span>
              </div>
            </div>

            {loan.nextRepaymentDate && (
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Next Payment Due</p>
                  <p className="text-sm font-medium">{formatDate(loan.nextRepaymentDate)}</p>
                </div>
                <p className="font-bold tabular-nums">{formatCurrency(loan.monthlyRepayment)}</p>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="font-semibold">{loan.interestRate}% p.a.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Term</p>
            <p className="font-semibold">{loan.loanTerm} months</p>
          </div>
          {loan.creditScore && (
            <div>
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="font-semibold">{loan.creditScore}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="font-semibold tabular-nums">{formatCurrency(loan.totalAmount)}</p>
          </div>
        </div>

        {onViewDetails && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onViewDetails(loan)}
            data-testid={`button-view-loan-${loan.id}`}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
