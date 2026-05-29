import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HasilDiagnosis from "../components/HasilDiagnosis";
import RekomendasiCard from "../components/RekomendasiCard";

import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FaSave } from "react-icons/fa";

export default function KonsultasiPage() {
  const [gejalaList, setGejalaList] = useState([]);
  const [selectedGejala, setSelectedGejala] = useState([]);
  const [hasilDiagnosis, setHasilDiagnosis] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // WARNING POPUP
  const [warningPopup, setWarningPopup] = useState({
    show: false,
    message: "",
  });

  // LOGIN OFFER POPUP
  const [loginPopup, setLoginPopup] = useState(false);

  const gejalaPerPage = 9;

  // USER
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isGuest = !user;

  useEffect(() => {
    fetch("https://sipakembackend-production.up.railway.app/gejala/all")
      .then((res) => res.json())
      .then((data) => setGejalaList(data))
      .catch((err) => console.log(err));
  }, []);

  const startIndex = currentPage * gejalaPerPage;

  const currentGejala = gejalaList.slice(
    startIndex,
    startIndex + gejalaPerPage,
  );

  const isLastPage = startIndex + gejalaPerPage >= gejalaList.length;

  // CHECKBOX
  const handleCheckboxChange = (id) => {
    setSelectedGejala((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // ANALISIS
  const handleAnalisis = async () => {
    // VALIDASI BELUM PILIH GEJALA
    if (selectedGejala.length === 0) {
      setWarningPopup({
        show: true,
        message: "Silahkan pilih gejala terlebih dahulu",
      });

      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setHasilDiagnosis(null);

      const penggunaId = user ? user.id_pengguna : null;

      const response = await fetch("https://sipakembackend-production.up.railway.app/konsultasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gejala: selectedGejala,
          pengguna_id: penggunaId,
        }),
      });

      const data = await response.json();

      // JIKA TIDAK DITEMUKAN DIAGNOSIS
      if (data.message) {
        setErrorMessage(data.message);
        setLoading(false);
        return;
      }

      // SIMULASI LOADING
      setTimeout(() => {
        setHasilDiagnosis({
          diagnosis: data.diagnosis,
          deskripsi: data.deskripsi,
          persen: data.persen,
          rekomendasi: [
            {
              title: "Rekomendasi",
              desc: data.rekomendasi,
            },
          ],
        });

        setErrorMessage(null);
        setLoading(false);

        // popup login jika guest
        if (isGuest) {
          setLoginPopup(true);
        }

        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 1200);
    } catch (error) {
      console.log(error);

      setErrorMessage("Terjadi kesalahan pada server");

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#5e3e76] mb-2">Konsultasi</h1>

          <p className="text-gray-500">
            Pilih gejala yang anda alami untuk mendapatkan hasil analisis.
          </p>
        </div>

        {/* GUEST MODE INFO */}
        {isGuest && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-5 py-4 rounded-2xl">
            Anda sedang menggunakan mode tamu. Daftar atau login untuk menyimpan
            riwayat konsultasi.
          </div>
        )}

        <div className="space-y-6">
          {/* CARD GEJALA */}
          <div className="bg-white border border-gray-200 rounded-[28px] p-6 shadow-sm">
            {/* HEADER */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#ede7f3] flex items-center justify-center">
                <HiOutlineClipboardDocumentList className="text-3xl text-[#5e3e76]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#5e3e76]">
                  Pilih Gejala
                </h2>

                <p className="text-gray-500">
                  Centang gejala sesuai kondisi anda
                </p>
              </div>
            </div>

            {/* INFO PAGE */}
            <p className="text-sm text-gray-500 mb-6">
              Gejala {startIndex + 1} -{" "}
              {Math.min(startIndex + gejalaPerPage, gejalaList.length)} dari{" "}
              {gejalaList.length}
            </p>

            {/* LIST GEJALA */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentGejala.map((gejala) => (
                <label
                  key={gejala.id}
                  className="flex items-start gap-3 border border-gray-200 rounded-2xl px-4 py-4 cursor-pointer hover:bg-[#f6f1fa] hover:border-[#5e3e76] transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedGejala.includes(gejala.id)}
                    onChange={() => handleCheckboxChange(gejala.id)}
                    className="w-4 h-4 mt-1 accent-[#5e3e76]"
                  />

                  <span className="text-sm text-gray-700 leading-relaxed">
                    {gejala.nama}
                  </span>
                </label>
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex justify-between items-center mt-8">
              <div>
                {currentPage > 0 && (
                  <button
                    title="Sebelumnya"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="border border-[#5e3e76] text-[#5e3e76] hover:bg-[#f6f1fa] px-6 py-3 rounded-2xl transition shadow-sm flex items-center gap-2"
                  >
                    <FaArrowLeft />
                    Sebelumnya
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (isLastPage) {
                    handleAnalisis();
                  } else {
                    setCurrentPage((prev) => prev + 1);
                  }
                }}
                className="bg-[#5e3e76] hover:bg-[#4a2f5d] text-white px-6 py-3 rounded-2xl transition shadow-md flex items-center gap-2"
              >
                {isLastPage ? (
                  <>
                    Analisis <FaArrowRight />
                  </>
                ) : (
                  <>
                    Selanjutnya <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="bg-white border border-gray-200 rounded-[28px] p-10 text-center shadow-sm">
              <div className="w-16 h-16 border-4 border-[#ede7f3] border-t-[#5e3e76] rounded-full animate-spin mx-auto mb-6"></div>

              <h2 className="text-2xl font-bold text-[#5e3e76] mb-3">
                Sistem Sedang Menganalisis
              </h2>

              <p className="text-gray-500">Mohon tunggu sebentar...</p>
            </div>
          )}

          {/* ERROR */}
          {errorMessage && !loading && (
            <div className="bg-white border border-red-200 rounded-[28px] p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-red-500 mb-3">
                Tidak Ditemukan
              </h2>

              <p className="text-gray-500">{errorMessage}</p>
            </div>
          )}

          {/* HASIL */}
          {hasilDiagnosis && !loading && (
            <div className="grid lg:grid-cols-2 gap-6">
              <HasilDiagnosis hasil={hasilDiagnosis} />

              <RekomendasiCard rekomendasi={hasilDiagnosis.rekomendasi} />
            </div>
          )}
        </div>
      </main>

      {/* WARNING POPUP */}
      {warningPopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />

          {/* POPUP BOX */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
            {/* CLOSE */}
            <button
              onClick={() =>
                setWarningPopup({
                  show: false,
                  message: "",
                })
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FiX size={22} />
            </button>

            {/* ICON */}
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-500 text-3xl">!</span>
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Peringatan
            </h2>

            {/* MESSAGE */}
            <p className="text-gray-500 leading-relaxed">
              {warningPopup.message}
            </p>

            {/* BUTTON */}
            <button
              onClick={() =>
                setWarningPopup({
                  show: false,
                  message: "",
                })
              }
              className="mt-6 bg-[#5e3e76] hover:bg-[#4c315f] text-white px-6 py-3 rounded-2xl transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* LOGIN OFFER POPUP */}
      {loginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />

          {/* BOX */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
            {/* CLOSE */}
            <button
              onClick={() => setLoginPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <FiX size={22} />
            </button>

            {/* ICON */}
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#f3ebf8] flex items-center justify-center">
              <FaSave className="text-4xl text-purple-600" />
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-[#5e3e76] mb-3">
              Simpan Riwayat Konsultasi
            </h2>

            {/* DESC */}
            <p className="text-gray-500 leading-relaxed mb-6">
              Login atau daftar akun untuk menyimpan hasil konsultasi, melihat
              riwayat diagnosis, dan memantau perkembangan kondisi anda.
            </p>

            {/* BUTTON */}
            <div className="flex gap-3">
              <button
                onClick={() => setLoginPopup(false)}
                className="flex-1 border border-gray-300 py-3 rounded-2xl hover:bg-gray-100 transition"
              >
                Nanti Saja
              </button>

              <button
                onClick={() => {
                  window.location.href = "/login";
                }}
                className="flex-1 bg-[#5e3e76] hover:bg-[#4c315f] text-white py-3 rounded-2xl transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
