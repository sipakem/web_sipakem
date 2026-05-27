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
        `http://localhost:5000/delete-profile/${userData.id_pengguna}`,
      );

      const updatedUser = {
        ...userData,
        foto_profile: null,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      window.dispatchEvent(new Event("userUpdated"));

      alert("Foto berhasil dihapus");

      onClose();
    } catch (error) {
      console.log(error);

      alert("Gagal menghapus foto");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-[35px] p-8 relative">
        {/* Tombol Close */}
        <button
          onClick={() => {
            setSelectedFile(null);
            onClose();
          }}
          className="absolute top-5 right-5 text-3xl text-gray-400 hover:text-black"
        >
          ×
        </button>

        {/* Title */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Ganti Foto Profil
          </h2>

          <p className="text-gray-500">
            Pilih foto baru untuk profil anda. Pastikan foto yang digunakan
            jelas dan sopan
          </p>
        </div>

        {/* Preview */}
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

        {/* Upload Area */}
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

        {/* Buttons */}
        <div className="flex justify-between items-center mt-10">
          {/* LEFT */}
          <div>
            {userData?.foto_profile && (
              <button
                onClick={handleDeletePhoto}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-2xl transition font-medium"
              >
                Hapus Foto
              </button>
            )}
          </div>

          {/* RIGHT */}
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
              onClick={handleUpload}
              className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 rounded-2xl transition"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
