import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoSipakem from "../assets/logo_sipakem.png";
import { FaUser } from "react-icons/fa";

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  // MENU STYLE
  const menuClass = (path) =>
    location.pathname === path
      ? "text-[#5e3e76] font-semibold border-b-2 border-[#5e3e76] pb-1 transition"
      : "text-gray-700 hover:text-[#5e3e76] pb-1 border-b-2 border-transparent hover:border-[#5e3e76] transition";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="w-full px-3 lg:px-6 h-[88px] flex items-center justify-between lg:grid lg:grid-cols-3">
        {/* LOGO */}
        <div
          onClick={() => navigate("/admin")}
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
          <Link to="/admin" className={menuClass("/admin")}>
            Beranda
          </Link>

          <Link to="/gejala" className={menuClass("/gejala")}>
            Gejala
          </Link>

          <Link to="/diagnosis" className={menuClass("/diagnosis")}>
            Diagnosis
          </Link>

          <Link to="/rekomendasi" className={menuClass("/rekomendasi")}>
            Rekomendasi
          </Link>

          <Link to="/rule" className={menuClass("/rule")}>
            Rule
          </Link>
        </nav>

        {/* RIGHT SECTION */}
        <div className="flex justify-end items-center">
          {/* PROFILE DESKTOP */}
          <div className="hidden lg:flex items-center">
            <div
              onClick={() => navigate("/profile")}
              className={`w-14 h-14 rounded-full overflow-hidden border-2 shadow-md cursor-pointer hover:scale-105 hover:shadow-lg transition duration-300 flex items-center justify-center bg-gray-100 ${
                location.pathname === "/profile"
                  ? "border-[#5e3e76]"
                  : "border-[#d6c7df]"
              }`}
            >
              {user?.foto_profile ? (
                <img
                  src={`http://localhost:5000${user.foto_profile}`}
                  alt="admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-2xl" />
              )}
            </div>
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
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md px-6 py-5 flex flex-col gap-5">
          <Link
            to="/admin"
            className={menuClass("/admin")}
            onClick={() => setMenuOpen(false)}
          >
            Beranda
          </Link>

          <Link
            to="/gejala"
            className={menuClass("/gejala")}
            onClick={() => setMenuOpen(false)}
          >
            Gejala
          </Link>

          <Link
            to="/diagnosis"
            className={menuClass("/diagnosis")}
            onClick={() => setMenuOpen(false)}
          >
            Diagnosis
          </Link>

          <Link
            to="/rekomendasi"
            className={menuClass("/rekomendasi")}
            onClick={() => setMenuOpen(false)}
          >
            Rekomendasi
          </Link>

          <Link
            to="/rule"
            className={menuClass("/rule")}
            onClick={() => setMenuOpen(false)}
          >
            Rule
          </Link>

          {/* PROFILE MOBILE */}
          <Link
            to="/profile"
            className={menuClass("/profile")}
            onClick={() => setMenuOpen(false)}
          >
            Profil
          </Link>
        </div>
      )}
    </header>
  );
}
