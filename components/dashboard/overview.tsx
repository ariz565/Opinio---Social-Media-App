"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    users: 2500,
    posts: 1400,
  },
  {
    name: "Feb",
    users: 3000,
    posts: 1600,
  },
  {
    name: "Mar",
    users: 3500,
    posts: 1900,
  },
  {
    name: "Apr",
    users: 4000,
    posts: 2200,
  },
  {
    name: "May",
    users: 4500,
    posts: 2500,
  },
  {
    name: "Jun",
    users: 5000,
    posts: 2800,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="users"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="posts"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
