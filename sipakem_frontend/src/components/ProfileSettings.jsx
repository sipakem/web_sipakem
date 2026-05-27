import {
  FaLock,
  FaHistory,
  FaInfoCircle,
  FaChevronRight,
} from "react-icons/fa";

export default function ProfileSettings({ setActiveMenu }) {
  // ambil user login
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white rounded-[30px] p-10 shadow-sm min-h-[700px]">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#5e3e76] mb-2">Pengaturan</h2>

        <div className="w-full h-[1px] bg-gray-200 mt-5"></div>
      </div>

      {/* Menu */}
      <div className="space-y-4">
        {/* Ganti Password */}
        <button
          onClick={() => setActiveMenu("change-password")}
          className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-[#f3edf7] transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f3edf7] flex items-center justify-center text-[#5e3e76]">
              <FaLock size={16} />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Ganti Password</h3>

              <p className="text-sm text-gray-500">Ubah password akun anda</p>
            </div>
          </div>

          <FaChevronRight className="text-gray-400 group-hover:text-[#5e3e76] transition" />
        </button>

        {/* Riwayat Konsultasi - hanya user */}
        {user?.role !== "admin" && (
          <button
            onClick={() => setActiveMenu("history")}
            className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-[#f3edf7] transition group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#f3edf7] flex items-center justify-center text-[#5e3e76]">
                <FaHistory size={16} />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-gray-800">
                  Riwayat Konsultasi
                </h3>

                <p className="text-sm text-gray-500">
                  Lihat hasil konsultasi sebelumnya
                </p>
              </div>
            </div>

            <FaChevronRight className="text-gray-400 group-hover:text-[#5e3e76] transition" />
          </button>
        )}

        {/* Tentang Kami */}
        <button
          onClick={() => setActiveMenu("tentang-kami")}
          className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-[#f3edf7] transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f3edf7] flex items-center justify-center text-[#5e3e76]">
              <FaInfoCircle size={16} />
            </div>

            <div className="text-left">
              <h3 className="font-semibold text-gray-800">Tentang Kami</h3>

              <p className="text-sm text-gray-500">
                Informasi mengenai SIPAKEM
              </p>
            </div>
          </div>

          <FaChevronRight className="text-gray-400 group-hover:text-[#5e3e76] transition" />
        </button>
      </div>
    </div>
  );
}
