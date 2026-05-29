import React from "react";
import { FaUser } from "react-icons/fa";
import axios from "axios";

export default function ChangePhotoModal({
  onClose,
  selectedFile,
  setSelectedFile,
  handleUpload,
  userData,
}) {
  const handleDeletePhoto = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus foto profil?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://sipakembackend-production.up.railway.app/delete-profile-photo/${userData.id_pengguna}`
      );

      alert("Foto profil berhasil dihapus!");
      
      const updatedUser = { ...userData, foto_profile: null };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saat menghapus foto:", error);
      alert(error.response?.data?.message || "Gagal menghapus foto profil.");
    }
  };

  // Handler saat user memilih file lokal baru
  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Ubah Foto Profil</h3>
        
        {/* Kontainer Preview / Input File */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 bg-gray-50">
          {selectedFile ? (
            <div className="text-center">
              <p className="text-sm text-green-600 font-medium mb-1">File Terpilih:</p>
              <p className="text-xs text-gray-500 font-mono truncate max-w-xs">{selectedFile.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <FaUser className="text-4xl mb-2" />
              <p className="text-xs text-gray-500">Pilih berkas JPG, PNG, atau JPEG</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            onChange={onFileChange} 
            className="mt-4 text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* Tombol Navigasi Aksi */}
        <div className="flex flex-col gap-2 mt-4">
          <button 
            onClick={handleUpload} 
            className={`w-full py-2 text-sm font-medium text-white rounded-md transition-colors ${
              selectedFile ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!selectedFile}
          >
            Simpan Perubahan
          </button>

          {userData?.foto_profile && (
            <button 
              onClick={handleDeletePhoto} 
              className="w-full py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 transition-colors"
            >
              Hapus Foto Saat Ini
            </button>
          )}
          
          <button 
            onClick={onClose} 
            className="w-full py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
