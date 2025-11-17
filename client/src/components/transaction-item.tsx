import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@shared/schema";

interface TransactionItemProps {
  transaction: Transaction & { memberName?: string };
  showMemberName?: boolean;
}

export function TransactionItem({ transaction, showMemberName }: TransactionItemProps) {
  const isCredit = ['deposit', 'loan_disbursement', 'interest', 'dividend'].includes(transaction.type);
  const isDebit = ['withdrawal', 'loan_repayment', 'fee'].includes(transaction.type);

  const getIcon = () => {
    if (transaction.type === 'transfer') return <RefreshCw className="h-4 w-4" />;
    if (transaction.type === 'loan_disbursement' || transaction.type === 'loan_repayment') 
      return <CreditCard className="h-4 w-4" />;
    if (isCredit) return <ArrowDownLeft className="h-4 w-4" />;
    return <ArrowUpRight className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed': return 'bg-success text-white';
      case 'pending': return 'bg-warning text-white';
      case 'failed': return 'bg-error text-white';
      case 'reversed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover-elevate transition-all border" data-testid={`transaction-${transaction.id}`}>
      <div className={`p-2 rounded-lg ${isCredit ? 'bg-success/10' : 'bg-error/10'}`}>
        <div className={isCredit ? 'text-success' : 'text-error'}>
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{transaction.description}</p>
        {showMemberName && transaction.memberName && (
          <p className="text-xs text-muted-foreground">{transaction.memberName}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(transaction.createdAt)} • {transaction.channel.toUpperCase()} • {transaction.reference}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold tabular-nums ${isCredit ? 'text-success' : 'text-error'}`}>
          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
        <Badge className={`${getStatusColor()} text-xs mt-1`} variant="secondary">
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}
