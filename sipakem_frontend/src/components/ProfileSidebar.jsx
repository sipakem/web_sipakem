import {
  FaUser,
  FaCamera,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ProfileSidebar({
  activeMenu,
  setActiveMenu,
  setShowPhotoModal,
  userData,
  setUserData,
}) {
  return (
    <div className="bg-white rounded-[30px] shadow-sm p-8 h-fit">
      {/* Profile */}
      <div className="flex flex-col items-center mb-12">
        {/* Photo */}
        <div
          onClick={() => setShowPhotoModal(true)}
          className="relative cursor-pointer group mb-5"
        >
          {userData?.foto_profile ? (
            <img
              src={`http://localhost:5000${userData.foto_profile}`}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-[#5e3e76]"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-[#5e3e76] bg-gray-100 flex items-center justify-center">
              <FaUser className="text-4xl text-gray-400" />
            </div>
          )}

          <div className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#5e3e76] text-white flex items-center justify-center shadow-lg">
            <FaCamera className="text-sm" />
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg text-gray-800">
          {userData?.nama_pengguna || "Loading..."}
        </h3>

        <p className="text-gray-400 text-sm">Pengguna</p>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {/* Informasi Pribadi */}
        <button
          onClick={() => setActiveMenu("info")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition
            ${
              activeMenu === "info"
                ? "bg-[#f3edf7] text-[#5e3e76]"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          <FaUserCircle className="text-lg" />

          <span className="font-medium">Informasi Pribadi</span>
        </button>

        {/* Pengaturan */}
        <button
          onClick={() => setActiveMenu("settings")}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition
            ${
              activeMenu === "settings" ||
              activeMenu === "change-password" ||
              activeMenu === "history"
                ? "bg-[#f3edf7] text-[#5e3e76]"
                : "hover:bg-gray-100 text-gray-700"
            }`}
        >
          <FaCog className="text-lg" />

          <span className="font-medium">Pengaturan</span>
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-50 text-red-500 transition"
        >
          <FaSignOutAlt className="text-lg" />

          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
