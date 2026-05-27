import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

export default function RekomendasiPage() {
  const [rekomendasi, setRekomendasi] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // DELETE POPUP
  const [deletePopup, setDeletePopup] = useState({
    show: false,
    id: null,
    kode: "",
  });

  // SUCCESS POPUP
  const [successPopup, setSuccessPopup] = useState(false);

  // GET DATA
  const fetchRekomendasi = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/rekomendasi/all");

      const data = await response.json();
      setRekomendasi(data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekomendasi();
  }, []);

  // FILTER
  const filteredRekomendasi = rekomendasi.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.kode?.toLowerCase().includes(keyword) ||
      item.deskripsi?.toLowerCase().includes(keyword)
    );
  });

  // OPEN DELETE
  const handleDeleteClick = (item) => {
    setDeletePopup({
      show: true,
      id: item.id,
      kode: item.kode,
    });
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/rekomendasi/${deletePopup.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: user?.id_pengguna,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      // remove dari state
      setRekomendasi((prev) =>
        prev.filter((item) => item.id !== deletePopup.id),
      );

      // close popup delete
      setDeletePopup({ show: false, id: null, kode: "" });

      // show success popup
      setSuccessPopup(true);

      setTimeout(() => {
        setSuccessPopup(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      <AdminNavbar />

      <div className="px-8 md:px-20 py-14">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#5e3e76]">
              DATA REKOMENDASI
            </h1>
            <p className="text-gray-600 mt-2">
              Daftar seluruh data rekomendasi
            </p>
          </div>

          <button
            onClick={() => navigate("/rekomendasi/tambah")}
            className="bg-[#5e3e76] hover:bg-[#4b315f] text-white px-5 h-14 rounded-2xl flex items-center gap-3 shadow-md transition"
          >
            <FiPlus size={24} />
            <span className="font-medium">Tambah Rekomendasi</span>
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-5 rounded-3xl shadow-sm mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari kode atau deskripsi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-2xl px-12 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#f3edf7]">
                  <th className="border px-6 py-4 text-left">NO</th>
                  <th className="border px-6 py-4 text-left">Kode</th>
                  <th className="border px-6 py-4 text-left">Deskripsi</th>
                  <th className="border px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredRekomendasi.length > 0 ? (
                  filteredRekomendasi.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border px-6 py-4">{index + 1}</td>
                      <td className="border px-6 py-4">{item.kode}</td>
                      <td className="border px-6 py-4">{item.deskripsi}</td>

                      <td className="border px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() =>
                              navigate(`/rekomendasi/edit/${item.id}`)
                            }
                            className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      Data rekomendasi tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {deletePopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeletePopup({ show: false, id: null, kode: "" })}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[420px] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <FiTrash2 className="text-red-500 text-2xl" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Hapus Rekomendasi
            </h2>

            <p className="text-gray-500 mb-6">
              Yakin ingin menghapus rekomendasi{" "}
              <span className="font-semibold">{deletePopup.kode}</span>?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setDeletePopup({ show: false, id: null, kode: "" })
                }
                className="px-6 py-2 rounded-xl border"
              >
                Batal
              </button>

              <button
                onClick={confirmDelete}
                className="px-6 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[380px] text-center">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setDeletePopup({ show: false, id: null })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <FiX size={22} />
            </button>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-2xl">✓</span>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil</h2>

            <p className="text-gray-500">Rekomendasi berhasil dihapus</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
