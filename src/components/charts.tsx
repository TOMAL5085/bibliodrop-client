"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#0f172a", "#f59e0b", "#0ea5e9", "#10b981", "#ef4444", "#8b5cf6"];

export function TrendChart({
  data,
  lineKey = "value",
}: {
  data: Array<Record<string, string | number>>;
  lineKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey={lineKey} stroke="#0f172a" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ActivityBarChart({
  data,
}: {
  data: Array<Record<string, string | number>>;
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#0f172a" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart({
  data,
}: {
  data: Array<Record<string, string | number>>;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="books" fill="#0f172a" radius={[10, 10, 0, 0]} />
        <Bar dataKey="revenue" fill="#f59e0b" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
