"use client";
import Image from "next/image";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const data = [
  {
    name: "Monday",
    present: 50,
    absent: 43,
  },
  {
    name: "Tuesday",
    present: 60,
    absent: 10,
  },
  {
    name: "Wednesday",
    present: 30,
    absent: 30,
  },
  {
    name: "Thursday",
    present: 65,
    absent: 33,
  },
  {
    name: "Friday",
    present: 69,
    absent: 11,
  },
];
const AttendanceChart = () => {
  return (
    <div className="w-full h-full p-4 bg-white rounded-xl ">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image src="/moreDark.png" alt="students" width={20} height={20} />
      </div>

      {/* CHART */}
      <ResponsiveContainer width={"100%"} height={"90%"}>
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              borderColor: "lightgray",
            }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "20px",
              paddingBottom: "40px",
            }}
          />
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="present"
            fill="#c3ebfa "
            legendType="circle"
          />
          <Bar
            radius={[10, 10, 0, 0]}
            dataKey="absent"
            fill="#fae276"
            legendType="circle"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
