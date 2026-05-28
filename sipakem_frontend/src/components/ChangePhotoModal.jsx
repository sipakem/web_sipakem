import { useState } from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { FiX, FiCheckCircle, FiAlertCircle, FiTrash2 } from "react-icons/fi"; // Ditambahkan FiTrash2 untuk icon hapus

export default function ChangePhotoModal({
  onClose,
  selectedFile,
  setSelectedFile,
  userData,
}) {
  const [popup, setPopup] = useState({
    show: false,
    type: "success", // success | error | confirm
    message: "",
  });

  const triggerDeleteConfirm = () => {
    setPopup({
      show: true,
      type: "confirm",
      message: "Apakah Anda yakin ingin menghapus foto profil saat ini?",
    });
  };

  // FUNGSI HAPUS FOTO
  const handleDeletePhoto = async () => {
    try {
      setPopup({ show: false, type: "success", message: "" });

      await axios.delete(
        `http://localhost:5000/delete_profile_photo/${userData.id_pengguna}`,
      );

      const updatedUser = {
        ...userData,
        foto_profile: null,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      setPopup({
        show: true,
        type: "success",
        message: "Foto profil berhasil dihapus",
      });

      setTimeout(() => {
        setPopup({ show: false, type: "success", message: "" });
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);

      setPopup({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Gagal menghapus foto profil",
      });
    }
  };

  // FUNGSI UPLOAD FOTO
  const handleLocalUpload = async () => {
    if (!selectedFile) {
      setPopup({
        show: true,
        type: "error",
        message: "Silakan pilih file foto terlebih dahulu",
      });
      return;
    }

    const formData = new FormData();
    formData.append("foto", selectedFile);

    try {
      const response = await axios.post(
        `http://localhost:5000/upload-profile/${userData.id_pengguna}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedUser = {
        ...userData,
        foto_profile: response.data.foto_profile,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));

      setPopup({
        show: true,
        type: "success",
        message: "Foto profil berhasil diperbarui",
      });

      setSelectedFile(null);

      setTimeout(() => {
        setPopup({ show: false, type: "success", message: "" });
        onClose();
      }, 1500);
    } catch (error) {
      console.error(error);

      setPopup({
        show: true,
        type: "error",
        message:
          error.response?.data?.message || "Gagal memperbarui foto profil",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-[35px] p-8 relative">
        <button
          onClick={() => setSuccessPopup({ show: false, message: "" })}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <FiX size={22} />
        </button>

        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Ganti Foto Profil
          </h2>
          <p className="text-gray-500">
            Pilih foto baru untuk profil anda. Pastikan foto yang digunakan
            jelas dan sopan
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="relative">
            {selectedFile || userData?.foto_profile ? (
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `http://localhost:5000${userData.foto_profile}`
                }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover border-4 border-purple-200"
              />
            ) : (
              <div className="w-40 h-40 rounded-full border-4 border-purple-200 bg-gray-100 flex items-center justify-center">
                <FaUser className="text-5xl text-gray-400" />
              </div>
            )}
          </div>
        </div>

        <label className="border-2 border-dashed border-gray-300 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <div className="text-5xl mb-4">⬆️</div>
          <p className="font-semibold text-gray-700">
            {selectedFile ? selectedFile.name : "Klik untuk upload foto"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            PNG, JPG, JPEG maksimal 10 MB
          </p>
        </label>

        <div className="flex justify-between items-center mt-10">
          <div>
            {userData?.foto_profile && (
              <button
                onClick={triggerDeleteConfirm} // Panggil trigger konfirmasi popup kustom
                className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-2xl transition font-medium"
              >
                Hapus Foto
              </button>
            )}
          </div>

          <div className="flex gap-5">
            <button
              onClick={() => {
                setSelectedFile(null);
                onClose();
              }}
              className="border border-gray-300 px-8 py-3 rounded-2xl hover:bg-gray-100 transition"
            >
              Batal
            </button>

            <button
              onClick={handleLocalUpload}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>

      {popup.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[380px] text-center">
            {popup.type !== "confirm" && (
              <button
                onClick={() => setPopup({ ...popup, show: false })}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                <FiX size={22} />
              </button>
            )}

            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                popup.type === "success"
                  ? "bg-green-100"
                  : popup.type === "confirm"
                    ? "bg-amber-100"
                    : "bg-red-100"
              }`}
            >
              {popup.type === "success" && (
                <FiCheckCircle className="text-green-600 text-4xl" />
              )}
              {popup.type === "confirm" && (
                <FiTrash2 className="text-amber-600 text-3xl" />
              )}
              {popup.type === "error" && (
                <FiAlertCircle className="text-red-500 text-4xl" />
              )}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {popup.type === "success" && "Berhasil"}
              {popup.type === "confirm" && "Konfirmasi Hapus"}
              {popup.type === "error" && "Gagal"}
            </h2>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {popup.message}
            </p>

            {popup.type === "confirm" ? (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() =>
                    setPopup({ show: false, type: "success", message: "" })
                  }
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeletePhoto}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition"
                >
                  Ya, Hapus
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
