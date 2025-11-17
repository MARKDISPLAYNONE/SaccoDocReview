import { Users, Wallet, CreditCard, TrendingUp, AlertTriangle, DollarSign } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jul", deposits: 450000, withdrawals: 320000, loans: 580000 },
  { month: "Aug", deposits: 520000, withdrawals: 380000, loans: 620000 },
  { month: "Sep", deposits: 480000, withdrawals: 350000, loans: 710000 },
  { month: "Oct", deposits: 610000, withdrawals: 420000, loans: 680000 },
  { month: "Nov", deposits: 680000, withdrawals: 450000, loans: 820000 },
];

const loanDistribution = [
  { name: "Emergency", value: 30, color: "#059669" },
  { name: "Business", value: 35, color: "#1e40af" },
  { name: "School Fees", value: 20, color: "#8b5cf6" },
  { name: "Development", value: 15, color: "#f59e0b" },
];

const memberGrowth = [
  { month: "Jul", members: 980 },
  { month: "Aug", members: 1045 },
  { month: "Sep", members: 1120 },
  { month: "Oct", members: 1198 },
  { month: "Nov", members: 1247 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Complete oversight of SACCO operations and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Members"
          value="1,247"
          icon={Users}
          trend={{ value: 4.1, isPositive: true }}
        />
        <StatCard
          title="Total Deposits"
          value={12450000}
          icon={Wallet}
          isCurrency
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Active Loans"
          value={8920000}
          icon={CreditCard}
          isCurrency
        />
        <StatCard
          title="Loan Portfolio"
          value={15680000}
          icon={DollarSign}
          isCurrency
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Default Rate"
          value="2.3%"
          icon={AlertTriangle}
          description="Below target"
        />
        <StatCard
          title="Monthly Growth"
          value="5.7%"
          icon={TrendingUp}
          trend={{ value: 1.2, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview (Last 5 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Bar dataKey="deposits" fill="#059669" name="Deposits" />
                <Bar dataKey="withdrawals" fill="#dc2626" name="Withdrawals" />
                <Bar dataKey="loans" fill="#1e40af" name="Loans" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loanDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {loanDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="members" stroke="#1e40af" strokeWidth={2} name="Total Members" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
