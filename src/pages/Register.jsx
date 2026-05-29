import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import LeftPanel from "../components/LeftPanel";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    nama: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_hp: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://sipakembackend-production.up.railway.app/register", form);

      navigate("/");
    } catch (error) {
      if (!error.response) {
        setErrorMessage("Backend belum dijalankan");
      } else {
        setErrorMessage(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#f5f5f5]">
      <LeftPanel />

      <div className="w-full md:w-[58%] bg-white rounded-none md:rounded-l-[30px] shadow-[-5px_0_20px_rgba(0,0,0,0.1)] flex justify-center items-center px-8 py-4">
        <form onSubmit={handleSubmit} className="w-full max-w-[420px]">
          <h1 className="text-1xl md:text-3xl font-bold text-[#5e3e76] mb-1">
            Daftar
          </h1>

          <p className="text-sm text-gray-500 mb-4">
            Sudah punya akun SIPAKEM?{" "}
            <Link to="/login" className="text-red-400 font-medium">
              Masuk
            </Link>
          </p>

          {/* NAMA */}
          <div className="mb-3">
            {errorMessage && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                {errorMessage}
              </div>
            )}

            <label className="block text-sm mb-1">Nama Pengguna</label>

            <input
              type="text"
              name="nama"
              placeholder="Masukkan nama pengguna anda"
              onChange={handleChange}
              required
              className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-[#5e3e76]"
            />
          </div>

          {/* TANGGAL */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Tanggal Lahir</label>

            <input
              type="date"
              name="tanggal_lahir"
              onChange={handleChange}
              required
              className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-[#5e3e76]"
            />
          </div>

          {/* GENDER */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Jenis Kelamin</label>

            <div className="relative">
              <select
                name="jenis_kelamin"
                onChange={handleChange}
                defaultValue=""
                required
                className="w-full appearance-none border border-gray-400 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#5e3e76] bg-white"
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>

                <option value="Laki-Laki">Laki - Laki</option>

                <option value="Perempuan">Perempuan</option>
              </select>

              <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* NO HP */}
          <div className="mb-3">
            <label className="block text-sm mb-1">No Hp</label>

            <input
              type="text"
              name="no_hp"
              placeholder="Masukkan no hp"
              onChange={handleChange}
              required
              className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-[#5e3e76]"
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Masukkan email anda"
              onChange={handleChange}
              required
              className="w-full border border-gray-400 rounded-lg px-4 py-3 outline-none focus:border-[#5e3e76]"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="block text-sm mb-1">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Buat password anda"
                onChange={handleChange}
                required
                className="w-full border border-gray-400 rounded-lg px-4 py-3 pr-12 outline-none focus:border-[#5e3e76]"
              />

              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#5e3e76]"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#5e3e76] hover:bg-[#4d325f] text-white py-3 rounded-lg transition duration-300"
          >
            Daftar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
