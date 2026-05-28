import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiCheckCircle } from "react-icons/fi";

export default function TambahDiagnosisPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    deskripsi: "",
  });

  const [loading, setLoading] = useState(false);

  // SUCCESS POPUP
  const [successPopup, setSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isEdit) {
      fetchDiagnosisDetail();
    }
  }, []);

  const fetchDiagnosisDetail = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://127.0.0.1:5000/diagnosis/${id}`);

      const data = await response.json();

      setFormData({
        kode: data.kode || "",
        nama: data.nama || "",
        deskripsi: data.deskripsi || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = isEdit
        ? `http://127.0.0.1:5000/diagnosis/${id}`
        : "http://127.0.0.1:5000/diagnosis";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          admin_id: user?.id_pengguna,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data");
      }

      setSuccessMessage(
        isEdit
          ? "Diagnosis berhasil diperbarui"
          : "Diagnosis berhasil ditambahkan",
      );

      setSuccessPopup(true);

      setTimeout(() => {
        setSuccessPopup(false);
        navigate("/diagnosis");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const isFormFilled =
      formData.kode !== "" || formData.nama !== "" || formData.deskripsi !== "";

    if (!isFormFilled) {
      navigate(-1);
    } else {
      setFormData({
        kode: "",
        nama: "",
        deskripsi: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative">
      <AdminNavbar />

      <div className="px-8 md:px-20 py-14">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-3xl mx-auto">
          {/* HEADER */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "#5e3e76" }}>
                {isEdit ? "Edit Diagnosis" : "Tambah Diagnosis"}
              </h1>

              <p className="text-gray-500 mt-2">
                {isEdit
                  ? "Perbarui data diagnosis"
                  : "Tambahkan data diagnosis baru"}
              </p>
            </div>

            <button
              onClick={() => navigate("/diagnosis")}
              className="w-12 h-12 rounded-2xl border flex items-center justify-center hover:bg-gray-100"
            >
              <FiArrowLeft size={22} />
            </button>
          </div>

          {/* FORM */}
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="kode"
                value={formData.kode}
                onChange={handleChange}
                placeholder="Kode Diagnosis"
                className="w-full border rounded-2xl px-5 py-4"
                required
              />

              <input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama Diagnosis"
                className="w-full border rounded-2xl px-5 py-4"
                required
              />

              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi"
                className="w-full border rounded-2xl px-5 py-4 h-40"
                required
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="text-white px-6 py-3 rounded-2xl"
                  style={{ backgroundColor: "#5e3e76" }}
                >
                  {isEdit ? "Update Data" : "Simpan Data"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 px-6 py-3 rounded-2xl"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* SUCCESS POPUP (UPDATED) */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />

          {/* MODAL */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center">
            {/* CLOSE */}
            <button
              onClick={() => setSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            {/* ICON */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil</h2>

            {/* MESSAGE */}
            <p className="text-gray-500">{successMessage}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
