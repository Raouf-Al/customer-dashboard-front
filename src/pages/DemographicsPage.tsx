import KPICard from "@/components/dashboard/KPICard";
import ChartCard from "@/components/dashboard/ChartCard";
import { ageDistribution, genderData, nationalityData, tenureData, kycData, segmentData } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, Building, CheckCircle, UserCheck } from "lucide-react";

const DONUT_COLORS = ["hsl(217,71%,53%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)"];

const DemographicsPage = () => {
  const totalCustomers = segmentData.reduce((s, d) => s + d.customers, 0);
  const totalAccounts = segmentData.reduce((s, d) => s + d.accounts, 0);

  const accountStatus = [
    { name: "Open", value: 82 },
    { name: "Closed", value: 18 },
  ];
  const customerType = [
    { name: "Individual", value: 78 },
    { name: "Corporate", value: 22 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Demographics</h2>
        <p className="text-sm text-muted-foreground">Aggregate customer base analysis</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Customers" value={totalCustomers.toLocaleString()} icon={<Users className="h-4 w-4" />} />
        <KPICard title="Total Accounts" value={totalAccounts.toLocaleString()} icon={<Building className="h-4 w-4" />} />
        <KPICard title="KYC Completion" value="82.4%" icon={<CheckCircle className="h-4 w-4" />} subtitle="17.6% pending or expired" />
        <KPICard title="Avg Tenure" value="5.8 yrs" icon={<UserCheck className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Age Distribution" subtitle="Customer count by age range">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(217,71%,53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Customer Tenure" subtitle="Years with the bank">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
                <XAxis dataKey="years" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="count" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Gender", data: genderData },
          { title: "Nationality", data: nationalityData },
          { title: "KYC Status", data: kycData },
          { title: "Customer Type", data: customerType },
        ].map(({ title, data }) => (
          <ChartCard key={title} title={title}>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Account Status" subtitle="Open vs Closed accounts">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={accountStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4}>
                  <Cell fill="hsl(142,71%,45%)" />
                  <Cell fill="hsl(0,72%,51%)" />
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [`${v}%`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Segmentation Breakdown" subtitle="Customer distribution by segment">
          <div className="space-y-2">
            {segmentData.map((seg, i) => {
              const pct = ((seg.customers / totalCustomers) * 100).toFixed(1);
              return (
                <div key={seg.segment} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="flex-1 text-xs text-foreground">{seg.segment}</span>
                  <span className="text-xs font-medium text-foreground">{pct}%</span>
                  <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default DemographicsPage;
