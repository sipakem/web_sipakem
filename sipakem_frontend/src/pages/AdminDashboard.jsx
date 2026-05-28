import { useEffect, useState } from "react";
import axios from "axios";

import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

import {
  FiUsers,
  FiClipboard,
  FiAlertCircle,
  FiTrendingUp,
  FiActivity,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const response = await axios.get("http://web-production-f90fd.up.railway.app/dashboard-admin");

      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboard) {
    return <div>Loading...</div>;
  }

  const cards = [
    {
      title: "Total Diagnosis",
      value: dashboard.total_diagnosis,
      icon: <FiAlertCircle />,
    },
    {
      title: "Total Gejala",
      value: dashboard.total_gejala,
      icon: <FiClipboard />,
    },
    {
      title: "Total Rekomendasi",
      value: dashboard.total_rekomendasi,
      icon: <FiTrendingUp />,
    },
    {
      title: "Total Pengguna",
      value: dashboard.total_pengguna,
      icon: <FiUsers />,
    },
    {
      title: "Total Rule",
      value: dashboard.total_rule,
      icon: <FiActivity />,
    },
  ];

  const COLORS = ["#5e3e76", "#7b5b92", "#9a7bb0", "#b9a0ca", "#d8c7e2"];

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminNavbar />

      <div className="p-8">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold" style={{ color: "#5e3e76" }}>
            Dashboard Admin
          </h1>

          <p className="text-gray-500 mt-2">Pantau aktivitas sistem SIPAKEM</p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {cards.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm border"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{
                  backgroundColor: "#f3eef7",
                  color: "#5e3e76",
                }}
              >
                {item.icon}
              </div>

              <p className="text-gray-500 text-sm">{item.title}</p>

              <h2 className="text-4xl font-bold text-gray-800 mt-2">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* PIE */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "#f3eef7",
                  color: "#5e3e76",
                }}
              >
                <FiPieChart size={18} />
              </div>

              <h2 className="text-xl font-bold" style={{ color: "#5e3e76" }}>
                Diagnosis Paling Banyak
              </h2>
            </div>

            <div className="flex items-center gap-10">
              {/* PIE CHART */}
              <div className="w-[220px] h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboard.diagnosis_chart}
                      dataKey="value"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {dashboard.diagnosis_chart.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* LEGEND */}
              <div className="flex-1 space-y-4">
                {dashboard.diagnosis_chart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>

                      <p className="text-sm text-gray-700">{item.name}</p>
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AKTIVITAS ADMIN */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "#f3eef7",
                  color: "#5e3e76",
                }}
              >
                <FiActivity size={18} />
              </div>

              <h2 className="text-xl font-bold" style={{ color: "#5e3e76" }}>
                Aktivitas Admin
              </h2>
            </div>

            <div className="space-y-5">
              {dashboard.aktivitas && dashboard.aktivitas.length > 0 ? (
                dashboard.aktivitas.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-none"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-gray-800">
                        {item.aktivitas}
                      </p>

                      <p className="text-sm text-gray-400 whitespace-nowrap">
                        {item.waktu}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Belum ada aktivitas admin
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "#f3eef7",
                color: "#5e3e76",
              }}
            >
              <FiBarChart2 size={18} />
            </div>

            <h2 className="text-xl font-bold" style={{ color: "#5e3e76" }}>
              Grafik Konsultasi
            </h2>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dashboard.grafik_konsultasi}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="tanggal" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="total"
                stroke="#5e3e76"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}
