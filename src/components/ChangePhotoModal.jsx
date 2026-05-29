import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";

export default function ChangePhotoModal({
  onClose,
  selectedFile,
  setSelectedFile,
  handleUpload,
  userData,
}) {
  const BASE_URL = "https://sipakembackend-production.up.railway.app";

  // State untuk kontrol Custom Success Popup
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  });
  
  // State untuk kontrol Custom Confirmation Popup (Hapus Foto)
  const [confirmDeletePopup, setConfirmDeletePopup] = useState(false);

  const onUploadClick = async () => {
    try {
      await handleUpload();

      setSuccessPopup({
        show: true,
        message: "Foto profil berhasil disimpan!",
      });

      setTimeout(() => {
        setSuccessPopup({ show: false, message: "" });
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  
  const executeDeletePhoto = async () => {
    setConfirmDeletePopup(false);

    try {
      await axios.delete(`${BASE_URL}/delete-profile-photo/${userData.id_pengguna}`);

      const currentLocalUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...currentLocalUser,
        foto_profile: null,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));

      setSuccessPopup({
        show: true,
        message: "Foto berhasil dihapus",
      });

      setTimeout(() => {
        setSuccessPopup({ show: false, message: "" });
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Gagal menghapus foto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-[30px] p-6 relative shadow-lg">
        {/* Tombol Close */}
        <button
          onClick={() => {
            setSelectedFile(null);
            onClose();
          }}
          className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-black"
        >
          <FiX />
        </button>

        {/* Title */}
        <div className="mb-6 pr-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Ganti Foto Profil
          </h2>
          <p className="text-gray-500 text-sm">
            Pilih foto baru. Pastikan foto jelas dan sopan.
          </p>
        </div>

        {/* Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {selectedFile || userData?.foto_profile ? (
              <img
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : `${BASE_URL}${userData.foto_profile}`
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-100"
              />
            ) : (
              <div className="w-28 h-28 rounded-full border-4 border-purple-100 bg-gray-50 flex items-center justify-center">
                <FaUser className="text-3xl text-gray-400" />
              </div>
            )}
          </div>
        </div>
        
        {/* Upload Area */}
        <label className="border-2 border-dashed border-gray-300 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <div className="text-3xl mb-2">⬆️</div>
          <p className="font-semibold text-gray-700 text-sm px-4 text-center truncate max-w-full">
            {selectedFile ? selectedFile.name : "Klik untuk upload foto"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            PNG, JPG, JPEG maksimal 10 MB
          </p>
        </label>

        {/* Action Buttons Layout */}
        <div className="flex justify-between items-center mt-6">
          {/* LEFT: Tombol Hapus Foto */}
          <div>
            {userData?.foto_profile && (
              <button
                onClick={() => setConfirmDeletePopup(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl transition text-xs font-medium"
              >
                Hapus Foto
              </button>
            )}
          </div>

          {/* RIGHT: Tombol Batal & Simpan */}
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setSelectedFile(null);
                onClose();
              }}
              className="border border-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition text-xs font-medium text-gray-700"
            >
              Batal
            </button>
            <button
              onClick={onUploadClick}
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-xl transition text-xs font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {confirmDeletePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-3xl shadow-xl p-6 w-[340px] text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <FiAlertTriangle className="text-red-600 text-3xl" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-gray-800">Hapus Foto?</h2>
            <p className="text-gray-500 text-sm mb-6 px-2">
              Apakah Anda yakin ingin menghapus foto profil saat ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeletePopup(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                Batal
              </button>
              <button
                onClick={executeDeletePhoto}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition text-sm font-medium"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
      
      {successPopup.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-3xl shadow-xl p-6 w-[320px] text-center">
            <button
              onClick={() => setSuccessPopup({ show: false, message: "" })}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              <FiX size={20} />
            </button>

            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-3xl" />
            </div>

            <h2 className="text-lg font-bold mb-1 text-gray-800">Berhasil</h2>
            <p className="text-gray-500 text-sm">{successPopup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
