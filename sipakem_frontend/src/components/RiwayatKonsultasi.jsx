import { useEffect, useState } from "react";
import axios from "axios";
import { BsChatDotsFill } from "react-icons/bs";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { FiX, FiCheckCircle } from "react-icons/fi";

// IMPORT ASSETS
import riwayatKosong from "../assets/riwayat_kosong.png";

export default function RiwayatKonsultasi({ onBack }) {
  const [data, setData] = useState([]);

  const [deletePopup, setDeletePopup] = useState({
    show: false,
    id: null,
  });

  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    getRiwayat();
  }, []);

  const getRiwayat = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.get(
        `http://localhost:5000/riwayat-konsultasi/${user.id_pengguna}`,
      );

      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeletePopup({
      show: true,
      id,
    });
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/riwayat-konsultasi/${deletePopup.id}`,
      );

      setData((prev) => prev.filter((item) => item.id !== deletePopup.id));

      setDeletePopup({ show: false, id: null });

      setSuccessPopup(true);

      setTimeout(() => {
        setSuccessPopup(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#fdfdfd] rounded-[30px] p-10 shadow-sm min-h-[700px] relative">
      {/* SUCCESS MODAL */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[380px] text-center">
            <button
              onClick={() => setSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil</h2>

            <p className="text-gray-500">Riwayat konsultasi berhasil dihapus</p>
          </div>
        </div>
      )}

      {/* BACK BUTTON */}
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-purple-700 mb-8 flex items-center gap-2 transition"
      >
        <FaArrowLeft />
        Kembali
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-3">
        <BsChatDotsFill className="text-purple-700 text-3xl" />
        <h2 className="text-4xl font-bold text-black">Riwayat Konsultasi</h2>
      </div>

      <p className="text-gray-700 mb-10 ml-11">
        Berikut adalah daftar riwayat konsultasi yang telah anda lakukan.
      </p>

      {/* STATE */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <img
            src={riwayatKosong}
            alt="Riwayat Kosong"
            className="w-[350px] object-contain"
          />
        </div>
      ) : (
        <div className="space-y-5">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-black-200 rounded-3xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-xl text-purple-700">
                    {item.diagnosis}
                  </h3>

                  <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {item.persen}%
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteClick(item.id)}
                  className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-sm"
                >
                  <FaTrash />
                  Hapus
                </button>
              </div>

              <p className="text-gray-700 mb-4">{item.deskripsi}</p>

              <div className="bg-purple-50 rounded-2xl p-5">
                <p className="font-semibold text-purple-700 mb-2">
                  Rekomendasi
                </p>
                <p className="text-gray-700 whitespace-pre-line">
                  {item.rekomendasi}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE MODAL */}
      {deletePopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeletePopup({ show: false, id: null })}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[420px] text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <FaTrash className="text-red-500 text-2xl" />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Hapus Riwayat
            </h2>

            <p className="text-gray-500 mb-6">
              Yakin ingin menghapus riwayat konsultasi ini?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletePopup({ show: false, id: null })}
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
    </div>
  );
}
