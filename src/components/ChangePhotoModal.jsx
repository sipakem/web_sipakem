import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiX, FiCheckCircle } from "react-icons/fi";
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

  const handleDeletePhoto = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus foto profil?");
    if (!confirmDelete) return;

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
        
        <label className="border-2 border-dashed border-gray-200 rounded-2xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 transition bg-gray-50/50">
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

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedFile(null);
                onClose();
              }}
              className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={onUploadClick}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl transition text-sm font-medium"
            >
              Simpan
            </button>
          </div>
          
          {userData?.foto_profile && (
            <button
              onClick={handleDeletePhoto}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl transition text-xs font-medium"
            >
              Hapus Foto Saat Ini
            </button>
          )}
        </div>
      </div>

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
