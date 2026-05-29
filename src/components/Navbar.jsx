import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import logoSipakem from "../assets/logo_sipakem.png";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ambil user dari localStorage
  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    updateUser();

    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  const isLoggedIn = !!user;

  // MENU STYLE
  const menuClass = (path) =>
    location.pathname === path
      ? "text-[#5e3e76] font-semibold border-b-2 border-[#5e3e76] pb-1 transition"
      : "text-gray-700 hover:text-[#5e3e76] pb-1 border-b-2 border-transparent hover:border-[#cdb8da] transition";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* NAVBAR CONTAINER */}
      <div className="w-full px-3 lg:px-6 h-[88px] flex items-center justify-between lg:grid lg:grid-cols-3 lg:items-center">
        {/* LOGO */}
        <div
          onClick={() => navigate("/beranda")}
          className="cursor-pointer flex justify-start"
        >
          <img
            src={logoSipakem}
            alt="Logo SIPAKEM"
            className="w-52 object-contain"
          />
        </div>

        {/* DESKTOP MENU */}
        <nav className="hidden lg:flex items-center justify-center gap-10">
          <Link to="/beranda" className={menuClass("/beranda")}>
            Beranda
          </Link>

          <Link to="/analitik" className={menuClass("/analitik")}>
            Analitik
          </Link>

          <Link to="/informasi" className={menuClass("/informasi")}>
            Informasi
          </Link>

          <Link to="/konsultasi" className={menuClass("/konsultasi")}>
            Konsultasi
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex justify-end items-center">
          {/* DESKTOP */}
          <div className="hidden lg:flex items-center gap-4">
            {/* JIKA SUDAH LOGIN */}
            {isLoggedIn ? (
              <div
                onClick={() => navigate("/profile")}
                className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition duration-300 flex items-center justify-center bg-gray-100 ${
                  location.pathname === "/profile"
                    ? "border-[#5e3e76]"
                    : "border-[#d8c5e5]"
                }`}
              >
                {user?.foto_profile ? (
                  <img
                    src={`http://localhost:5000${user.foto_profile}`}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-2xl" />
                )}
              </div>
            ) : (
              /* JIKA BELUM LOGIN */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 rounded-xl border border-[#5e3e76] text-[#5e3e76] hover:bg-[#5e3e76] hover:text-white transition"
                >
                  Masuk
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-2 rounded-xl bg-[#5e3e76] text-white hover:bg-[#4c315f] transition"
                >
                  Daftar
                </button>
              </div>
            )}
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1"
          >
            <span className="w-7 h-[3px] bg-[#5e3e76] rounded-full"></span>
            <span className="w-7 h-[3px] bg-[#5e3e76] rounded-full"></span>
            <span className="w-7 h-[3px] bg-[#5e3e76] rounded-full"></span>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden mt-4 mx-4 bg-white border border-gray-100 rounded-3xl p-6 shadow-xl">
          <nav className="flex flex-col gap-5">
            <Link
              to="/beranda"
              onClick={() => setMenuOpen(false)}
              className={menuClass("/beranda")}
            >
              Beranda
            </Link>

            <Link
              to="/analitik"
              onClick={() => setMenuOpen(false)}
              className={menuClass("/analitik")}
            >
              Analitik
            </Link>

            <Link
              to="/informasi"
              onClick={() => setMenuOpen(false)}
              className={menuClass("/informasi")}
            >
              Informasi
            </Link>

            <Link
              to="/konsultasi"
              onClick={() => setMenuOpen(false)}
              className={menuClass("/konsultasi")}
            >
              Konsultasi
            </Link>

            {isLoggedIn ? (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={menuClass("/profile")}
              >
                Profil
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#5e3e76]"
                >
                  Masuk
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-[#5e3e76]"
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
