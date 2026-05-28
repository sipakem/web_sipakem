import { BrowserRouter, Routes, Route } from "react-router-dom";
import SipakemLandingPage from "./pages/SipakemLandingPage";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InformasiPage from "./pages/InformasiPage";
import KonsultasiPage from "./pages/KonsultasiPage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import GejalaPage from "./pages/GejalaPage";
import TambahGejalaPage from "./pages/TambahGejalaPage";
import DiagnosisPage from "./pages/DiagnosisPage";
import TambahDiagnosisPage from "./pages/TambahDiagnosisPage";
import RekomendasiPage from "./pages/RekomendasiPage";
import TambahRekomendasiPage from "./pages/TambahRekomendasiPage";
import RulePage from "./pages/RulePage";
import TambahRulePage from "./pages/TambahRulePage";
import AnalitikPage from "./pages/AnalitikPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SipakemLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/beranda" element={<HomePage />} />
        <Route path="/analitik" element={<AnalitikPage />} />
        <Route path="/informasi" element={<InformasiPage />} />
        <Route path="/konsultasi" element={<KonsultasiPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              {" "}
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/gejala"
          element={
            <AdminRoute>
              {" "}
              <GejalaPage />{" "}
            </AdminRoute>
          }
        />
        <Route path="/gejala/tambah" element={<TambahGejalaPage />} />
        <Route path="/gejala/edit/:id" element={<TambahGejalaPage />} />

        <Route
          path="/diagnosis"
          element={
            <AdminRoute>
              {" "}
              <DiagnosisPage />{" "}
            </AdminRoute>
          }
        />
        <Route
          path="/diagnosis/tambah"
          element={
            <AdminRoute>
              <TambahDiagnosisPage />
            </AdminRoute>
          }
        />
        <Route
          path="/diagnosis/edit/:id"
          element={
            <AdminRoute>
              <TambahDiagnosisPage />
            </AdminRoute>
          }
        />
        <Route
          path="/rekomendasi"
          element={
            <AdminRoute>
              {" "}
              <RekomendasiPage />{" "}
            </AdminRoute>
          }
        />
        <Route path="/rekomendasi/tambah" element={<TambahRekomendasiPage />} />
        <Route
          path="/rekomendasi/edit/:id"
          element={<TambahRekomendasiPage />}
        />
        <Route
          path="/rule"
          element={
            <AdminRoute>
              <RulePage />
            </AdminRoute>
          }
        />
        <Route
          path="/rule/tambah"
          element={
            <AdminRoute>
              <TambahRulePage />
            </AdminRoute>
          }
        />
        <Route
          path="/rule/edit/:id"
          element={
            <AdminRoute>
              <TambahRulePage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
