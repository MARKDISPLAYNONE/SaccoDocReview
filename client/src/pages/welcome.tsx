import { useState } from "react";
import { useLocation } from "wouter";
import { Building2, Shield, Smartphone, TrendingUp, ChevronRight, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Banking",
      description: "Access your accounts, apply for loans, and manage finances anywhere, anytime",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Bank-grade security with SASRA compliance and complete audit trails",
    },
    {
      icon: TrendingUp,
      title: "Smart Loans",
      description: "Automated credit scoring, instant approvals, and flexible repayment options",
    },
    {
      icon: Users,
      title: "Member-Centric",
      description: "Built for SACCO members with intuitive interfaces and real-time updates",
    },
  ];

  const demoRoles = [
    {
      role: "member",
      title: "Member Portal",
      description: "View accounts, apply for loans, track transactions, and manage your savings",
      credentials: { username: "john.doe", password: "member123" },
      color: "bg-secondary",
    },
    {
      role: "staff",
      title: "Staff Portal",
      description: "Process transactions, approve loans, manage members, and provide support",
      credentials: { username: "staff.user", password: "staff123" },
      color: "bg-primary",
    },
    {
      role: "admin",
      title: "Admin Portal",
      description: "Full analytics, compliance reporting, system settings, and oversight",
      credentials: { username: "admin.user", password: "admin123" },
      color: "bg-chart-1",
    },
  ];

  const handleRoleSelect = (username: string, password: string) => {
    setLocation(`/login?demo=${username}&pass=${password}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Building2 className="h-16 w-16 text-primary" />
            <div className="text-left">
              <h1 className="text-5xl font-bold">Apostolos SACCO</h1>
              <p className="text-lg text-muted-foreground">Digital Banking Platform</p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Experience modern, secure, and efficient digital banking designed specifically for SACCO members
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowDemo(true)}
              className="gap-2"
              data-testid="button-try-demo"
            >
              Try Demo
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/register")}
              data-testid="button-join"
            >
              Join Now
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover-elevate transition-all">
              <CardContent className="p-6">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Roles Section */}
        {showDemo && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-4">Choose a Demo Role</h2>
            <p className="text-center text-muted-foreground mb-8">
              Explore the platform from different perspectives
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {demoRoles.map((demo) => (
                <Card key={demo.role} className="hover-elevate transition-all border-2">
                  <CardContent className="p-6">
                    <Badge className={`${demo.color} text-white mb-4`}>
                      {demo.title}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-6 min-h-[60px]">
                      {demo.description}
                    </p>
                    <div className="bg-muted/50 rounded-md p-3 mb-4 space-y-1">
                      <p className="text-xs font-mono text-muted-foreground">
                        Username: <span className="text-foreground font-semibold">{demo.credentials.username}</span>
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        Password: <span className="text-foreground font-semibold">{demo.credentials.password}</span>
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleRoleSelect(demo.credentials.username, demo.credentials.password)}
                      data-testid={`button-demo-${demo.role}`}
                    >
                      Login as {demo.title.split(" ")[0]}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 bg-card border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Apostolos SACCO?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "24/7 access to your accounts from any device",
              "Instant loan applications with automated approvals",
              "Real-time transaction notifications",
              "Secure M-PESA integration for deposits and withdrawals",
              "Complete transaction history and downloadable statements",
              "Member-to-member transfers",
              "Competitive interest rates on savings",
              "Transparent fee structure with no hidden charges",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-sm">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Already a member? <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/login")}>Sign in here</Button></p>
          <p className="mt-2">Need help? <Button variant="link" className="p-0 h-auto" onClick={() => setLocation("/help")}>Visit our help center</Button></p>
        </div>
      </div>
    </div>
  );
}
