import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HiOutlineChartBar,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";

export default function AnalitikPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar />

      {/* CONTENT */}
      <main className="flex-1 w-full px-6 py-6">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* LEFT */}
          <div>
            <h1 className="text-3xl font-bold text-[#5e3e76] mb-2">
              Dashboard BI
            </h1>
          </div>
        </div>

        {/* DASHBOARD */}
        <div className="w-full h-[calc(100vh-140px)] overflow-hidden rounded-[30px] border border-gray-200 shadow-lg bg-white">
          <iframe
            title="Dashboard BI"
            src="https://public.tableau.com/views/DashboardBISipakem/Dashboard1?:showVizHome=no"
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
}
