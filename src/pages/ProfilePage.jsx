import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

import ProfileSidebar from "../components/ProfileSidebar";
import ProfileInfo from "../components/ProfileInfo";
import ProfileSettings from "../components/ProfileSettings";
import ChangePassword from "../components/ChangePassword";
import RiwayatKonsultasi from "../components/RiwayatKonsultasi";
import ChangePhotoModal from "../components/ChangePhotoModal";
import TentangKami from "../components/TentangKami";

export default function ProfilePage() {
  const [activeMenu, setActiveMenu] = useState("info");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setRole(user.role);

      if (user.id_pengguna) {
        getProfile(user.id_pengguna);
      }
    }
  }, []);

  const getProfile = async (id_pengguna) => {
    try {
      const response = await axios.get(
        `https://sipakembackend-production.up.railway.app/profile/${id_pengguna}`
      );
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("foto", selectedFile);

    try {
      const response = await axios.post(
        `https://sipakembackend-production.up.railway.app/upload-profile/${userData.id_pengguna}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.foto_profile) {
        alert("Foto profil berhasil disimpan!");
        const currentLocalUser = JSON.parse(localStorage.getItem("user")) || {};

        const updatedUser = { 
          ...currentLocalUser,
          foto_profile: response.data.foto_profile 
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setSelectedFile(null);
        window.location.reload();
      }
    } catch (error) {
      console.error("Gagal mengunggah foto profil:", error);
      alert(error.response?.data?.message || "Terjadi galat pada server saat mengunggah.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      {role === "admin" ? <AdminNavbar /> : <Navbar />}

      {/* Main Content */}
      <section className="px-8 md:px-20 py-16">
        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar */}
          <ProfileSidebar
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            setShowPhotoModal={setShowPhotoModal}
            userData={userData}
            setUserData={setUserData}
          />

          {/* Right Content */}
          <div>
            {/* Informasi Pribadi */}
            {activeMenu === "info" && userData && (
              <ProfileInfo userData={userData} setUserData={setUserData} />
            )}

            {/* Pengaturan */}
            {activeMenu === "settings" && (
              <ProfileSettings setActiveMenu={setActiveMenu} />
            )}

            {/* Ganti Password */}
            {activeMenu === "change-password" && (
              <ChangePassword onBack={() => setActiveMenu("settings")} />
            )}

            {/* Riwayat Konsultasi */}
            {activeMenu === "history" && (
              <RiwayatKonsultasi onBack={() => setActiveMenu("settings")} />
            )}

            {/* Tentang Kami */}
            {activeMenu === "tentang-kami" && (
              <TentangKami onBack={() => setActiveMenu("settings")} />
            )}
          </div>
        </div>
      </section>

      {/* Modal Foto Profil */}
      {showPhotoModal && (
        <ChangePhotoModal
          onClose={() => setShowPhotoModal(false)}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleUpload={handleUpload}
          userData={userData}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
