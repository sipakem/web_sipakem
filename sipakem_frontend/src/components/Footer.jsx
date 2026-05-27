import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRegCopyright,
  FaInstagram,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isLoggedIn = !!user;

  const [loginPopup, setLoginPopup] = useState(false);

  // MENU
  const guestMenu = [
    { name: "Beranda", path: "/" },
    { name: "Konsultasi", path: "/konsultasi" },
    { name: "Informasi", path: "/informasi" },
  ];

  const userMenu = [
    { name: "Beranda", path: "/" },
    { name: "Konsultasi", path: "/konsultasi" },
    { name: "Informasi", path: "/informasi" },
    { name: "Profil", path: "/profil", protected: true },
  ];

  const adminMenu = [
    { name: "Beranda", path: "/admin" },
    { name: "Gejala", path: "/gejala" },
    { name: "Diagnosis", path: "/diagnosis" },
    { name: "Rekomendasi", path: "/rekomendasi" },
    { name: "Rule", path: "/rule" },
    { name: "Profile", path: "/profile", protected: true },
  ];

  const menu = role === "admin" ? adminMenu : isLoggedIn ? userMenu : guestMenu;

  // HANDLER MENU
  const handleMenuClick = (e, item) => {
    e.preventDefault();

    // kalau belum login
    if (item.protected && !isLoggedIn) {
      setLoginPopup(true);
      return;
    }

    // safety check
    if (item.path === "/profil" && !isLoggedIn) {
      setLoginPopup(true);
      return;
    }

    navigate(item.path);
  };

  return (
    <>
      <footer className="bg-[#5e3e76] text-white pt-12">
        <div className="px-6 md:px-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* SIPAKEM */}
            <div>
              <h4 className="font-bold text-lg mb-5">SIPAKEM</h4>
              <p className="text-sm text-[#f3e8ff] leading-relaxed max-w-[240px]">
                sistem pakar yang membantu pengguna mengenali gejala gangguan
                kecemasan serta memberikan informasi dan rekomendasi awal secara
                cepat, akurat dan mudah dipahami.
              </p>
            </div>

            {/* MENU */}
            <div>
              <h4 className="font-bold text-lg mb-5">MENU</h4>

              <ul className="space-y-3 text-sm text-[#f3e8ff]">
                {menu.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={(e) => handleMenuClick(e, item)}
                      className="hover:text-white transition text-left w-full"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* LAYANAN */}
            <div>
              <h4 className="font-bold text-lg mb-5">LAYANAN</h4>
              <ul className="space-y-3 text-sm text-[#f3e8ff]">
                <li>Diagnosis Kecemasan</li>
                <li>Informasi Kecemasan</li>
                <li>Riwayat Konsultasi</li>
              </ul>
            </div>

            {/* KONTAK */}
            <div>
              <h4 className="font-bold text-lg mb-5">HUBUNGI KAMI</h4>

              <div className="space-y-3 text-sm text-[#f3e8ff]">
                <p>
                  <a
                    href="mailto:sipakemsipakem@gmail.com"
                    className="hover:text-white"
                  >
                    sipakemsipakem@gmail.com
                  </a>
                </p>

                <p>
                  <a
                    href="https://instagram.com/sipakem"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white"
                  >
                    @sipakem
                  </a>
                </p>

                <div className="flex gap-4 pt-2 text-2xl">
                  <a href="mailto:sipakemsipakem@gmail.com">
                    <FaEnvelope />
                  </a>

                  <a
                    href="https://instagram.com/sipakem"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="bg-[#fafafa] py-5 px-6 md:px-14">
          <div className="flex justify-center items-center gap-2 text-sm text-[#5e3e76]">
            <FaRegCopyright />
            <p>Copyright 2026, SIPAKEM. Sistem Pakar Gangguan Kecemasan.</p>
          </div>
        </div>
      </footer>

      {/* LOGIN POPUP */}
      {loginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setLoginPopup(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[360px] text-center">
            <button
              onClick={() => setLoginPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <FaTimes />
            </button>

            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#ede7f3] flex items-center justify-center">
              <span className="text-[#5e3e76] text-2xl">!</span>
            </div>

            <h2 className="text-lg font-bold text-[#5e3e76] mb-2">
              Akses Ditolak
            </h2>

            <p className="text-gray-500 text-sm mb-6">
              Silakan login terlebih dahulu untuk mengakses halaman ini.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setLoginPopup(false)}
                className="flex-1 bg-gray-200 rounded-xl py-2"
              >
                Batal
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-[#5e3e76] text-white rounded-xl py-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
