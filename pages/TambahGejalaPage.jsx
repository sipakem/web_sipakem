import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiCheckCircle } from "react-icons/fi";

export default function TambahGejalaPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
  });

  const [loading, setLoading] = useState(false);

  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (isEdit) fetchGejalaDetail();
  }, []);

  const fetchGejalaDetail = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://127.0.0.1:5000/gejala/${id}`);
      const data = await response.json();

      setFormData({
        kode: data.kode || "",
        nama: data.nama || "",
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
        ? `http://127.0.0.1:5000/gejala/${id}`
        : "http://127.0.0.1:5000/gejala";

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

      if (!response.ok) throw new Error(result.message);

      setSuccessPopup({
        show: true,
        message: isEdit
          ? "Gejala berhasil diperbarui"
          : "Gejala berhasil ditambahkan",
      });

      setTimeout(() => {
        setSuccessPopup({ show: false, message: "" });
        navigate("/gejala");
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const isFormFilled = formData.kode !== "" || formData.nama !== "";

    if (!isFormFilled) {
      navigate(-1);
    } else {
      setFormData({ kode: "", nama: "" });
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
              <h1 className="text-3xl font-bold text-[#5e3e76]">
                {isEdit ? "Edit Gejala" : "Tambah Gejala"}
              </h1>
            </div>

            <button
              onClick={() => navigate("/gejala")}
              className="w-12 h-12 rounded-2xl border flex items-center justify-center"
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
                className="w-full border rounded-2xl px-5 py-4"
                placeholder="Kode Gejala"
                required
              />

              <input
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="w-full border rounded-2xl px-5 py-4"
                placeholder="Nama Gejala"
                required
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="text-white px-6 py-3 rounded-2xl bg-[#5e3e76]"
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

      {/* SUCCESS POPUP */}
      {successPopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center">
            <button
              onClick={() => setSuccessPopup({ show: false, message: "" })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil</h2>

            <p className="text-gray-500">{successPopup.message}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
