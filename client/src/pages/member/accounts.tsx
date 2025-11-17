import { useState } from "react";
import { Wallet, Plus, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MPesaModal } from "@/components/mpesa-modal";
import { useAuth } from "@/lib/auth-context";
import type { Account, Member } from "@shared/schema";

export default function MemberAccounts() {
  const { user } = useAuth();
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [mpesaType, setMpesaType] = useState<"deposit" | "withdrawal">("deposit");
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>();

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

  const { data: accounts, isLoading } = useQuery<Account[]>({
    queryKey: ['/api/accounts', member?.id],
    queryFn: async () => {
      const response = await fetch(`/api/accounts?memberId=${member?.id}`);
      if (!response.ok) throw new Error('Failed to fetch accounts');
      return response.json();
    },
    enabled: !!member?.id,
  });

  if (isLoading || !accounts) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "shares": return "Shares Account";
      case "savings": return "Savings Account";
      case "emergency": return "Emergency Fund";
      case "fixed_deposit": return "Fixed Deposit";
      default: return type;
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "shares": return TrendingUp;
      case "savings": return Wallet;
      default: return Wallet;
    }
  };

  const handleDeposit = (accountNumber: string) => {
    setSelectedAccount(accountNumber);
    setMpesaType("deposit");
    setMpesaModalOpen(true);
  };

  const handleWithdraw = (accountNumber: string) => {
    setSelectedAccount(accountNumber);
    setMpesaType("withdrawal");
    setMpesaModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Accounts</h1>
        <p className="text-muted-foreground">Manage your savings and investments</p>
      </div>

      <Card className="bg-gradient-to-br from-primary to-secondary text-white">
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Balance</p>
              <h2 className="text-4xl font-bold tabular-nums">{formatCurrency(totalBalance)}</h2>
            </div>
            <Wallet className="h-12 w-12 text-white/30" />
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => {
                if (accounts[0]) {
                  setSelectedAccount(accounts[0].accountNumber);
                  setMpesaType("deposit");
                  setMpesaModalOpen(true);
                }
              }}
              data-testid="button-quick-deposit"
            >
              <Plus className="h-4 w-4" />
              Deposit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
              onClick={() => {
                if (accounts[0]) {
                  setSelectedAccount(accounts[0].accountNumber);
                  setMpesaType("withdrawal");
                  setMpesaModalOpen(true);
                }
              }}
              data-testid="button-quick-withdraw"
            >
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {accounts.map((account) => {
          const AccountIcon = getAccountIcon(account.accountType);
          const balance = parseFloat(account.balance);
          const contribution = totalBalance > 0 ? (balance / totalBalance) * 100 : 0;

          return (
            <Card key={account.id} className="hover-elevate transition-all" data-testid={`account-card-${account.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 mb-1">
                      <AccountIcon className="h-5 w-5 text-primary" />
                      {getAccountTypeLabel(account.accountType)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{account.accountNumber}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {account.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-3xl font-bold tabular-nums">{formatCurrency(balance)}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>{account.interestRate}% p.a.</span>
                    </div>
                    <span>•</span>
                    <span>Opened {formatDate(account.openedAt)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Contribution to Total</span>
                    <span className="font-medium">{contribution.toFixed(1)}%</span>
                  </div>
                  <Progress value={contribution} className="h-2" />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 gap-2"
                    onClick={() => handleDeposit(account.accountNumber)}
                    data-testid={`button-deposit-${account.id}`}
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleWithdraw(account.accountNumber)}
                    data-testid={`button-withdraw-${account.id}`}
                  >
                    <ArrowUpFromLine className="h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Accounts</p>
              <p className="text-2xl font-bold">{accounts.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Interest</p>
              <p className="text-2xl font-bold">
                {(accounts.reduce((sum, acc) => sum + parseFloat(acc.interestRate), 0) / accounts.length).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Interest</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency((totalBalance * 0.065) / 12)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Interest</p>
              <p className="text-2xl font-bold tabular-nums">
                {formatCurrency(totalBalance * 0.065)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <MPesaModal
        open={mpesaModalOpen}
        onOpenChange={setMpesaModalOpen}
        type={mpesaType}
        accountNumber={selectedAccount}
      />
    </div>
  );
}
