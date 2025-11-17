import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Smartphone, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MPesaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deposit" | "withdrawal";
  accountNumber?: string;
}

export function MPesaModal({ open, onOpenChange, type, accountNumber }: MPesaModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"input" | "processing" | "success">("input");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("+254712345678");
  const [accountType, setAccountType] = useState("shares");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("processing");

    setTimeout(() => {
      setStep("success");
      toast({
        title: type === "deposit" ? "Deposit Successful!" : "Withdrawal Successful!",
        description: `${formatCurrency(parseFloat(amount))} ${type === "deposit" ? "deposited to" : "withdrawn from"} your account`,
      });

      setTimeout(() => {
        setStep("input");
        setAmount("");
        onOpenChange(false);
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    setStep("input");
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-secondary" />
            M-PESA {type === "deposit" ? "Deposit" : "Withdrawal"}
          </DialogTitle>
          <DialogDescription>
            {type === "deposit" 
              ? "Add funds to your account via M-PESA" 
              : "Withdraw funds to your M-PESA account"}
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account">Select Account</Label>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger data-testid="select-account">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shares">Shares Account (SH234567890)</SelectItem>
                  <SelectItem value="savings">Savings Account (SV234567891)</SelectItem>
                  <SelectItem value="emergency">Emergency Fund (EM234567892)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">M-PESA Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254712345678"
                required
                data-testid="input-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                min="100"
                step="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                data-testid="input-amount"
              />
              <p className="text-xs text-muted-foreground">
                {type === "deposit" ? "Minimum: KES 100" : "Minimum: KES 100 • Maximum: KES 150,000/day"}
              </p>
            </div>

            {amount && parseFloat(amount) >= 100 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold tabular-nums">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">M-PESA Fee</span>
                  <span className="font-semibold tabular-nums">
                    {type === "deposit" && parseFloat(amount) <= 10000 ? "FREE" : "KES 30.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold tabular-nums">
                    {formatCurrency(parseFloat(amount) + (type === "deposit" && parseFloat(amount) <= 10000 ? 0 : 30))}
                  </span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!amount || parseFloat(amount) < 100} data-testid="button-confirm">
              {type === "deposit" ? "Initiate Deposit" : "Initiate Withdrawal"}
            </Button>
          </form>
        )}

        {step === "processing" && (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Processing...</h3>
              <p className="text-muted-foreground text-sm">
                Please check your phone for the M-PESA prompt
              </p>
              <p className="text-muted-foreground text-sm">
                Enter your M-PESA PIN to complete the transaction
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
              <p className="text-muted-foreground">Transaction Details:</p>
              <p className="font-medium">Amount: {formatCurrency(parseFloat(amount))}</p>
              <p className="font-medium">To: {phone}</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Success!</h3>
              <p className="text-muted-foreground text-sm">
                {type === "deposit" 
                  ? `${formatCurrency(parseFloat(amount))} has been added to your account`
                  : `${formatCurrency(parseFloat(amount))} has been sent to ${phone}`}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
