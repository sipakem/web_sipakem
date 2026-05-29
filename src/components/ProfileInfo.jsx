import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import { FiX, FiCheckCircle } from "react-icons/fi";

export default function ProfileInfo({ userData, setUserData }) {
  const [form, setForm] = useState({
    nama_pengguna: "",
    email: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    no_hp: "",
  });

  // POPUP STATE
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    if (userData) {
      setForm({
        nama_pengguna: userData.nama_pengguna || "",
        email: userData.email || "",
        tanggal_lahir: userData.tanggal_lahir || "",
        jenis_kelamin: userData.jenis_kelamin || "",
        no_hp: userData.no_hp || "",
      });
    }
  }, [userData]);

  // AUTO CLOSE POPUP
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup((prev) => ({ ...prev, show: false }));
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [popup.show]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://sipakembackend-production.up.railway.app/profile/${userData.id_pengguna}`,
        form,
      );

      const updatedUser = {
        ...userData,
        ...form,
      };

      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // SUCCESS POPUP
      setPopup({
        show: true,
        type: "success",
        message: "Profil berhasil diperbarui",
      });
    } catch (error) {
      // ERROR POPUP
      setPopup({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Gagal update profil",
      });
    }
  };

  return (
    <div className="bg-white rounded-[35px] p-10 shadow-sm relative">
      <h2 className="text-3xl font-bold text-[#5e3e76] mb-10">
        Informasi Pribadi
      </h2>

      {/* FORM */}
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">
            Nama Pengguna
          </label>
          <input
            type="text"
            name="nama_pengguna"
            value={form.nama_pengguna}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Tanggal Lahir
          </label>
          <input
            type="date"
            name="tanggal_lahir"
            value={form.tanggal_lahir}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Jenis Kelamin
          </label>

          <div className="relative">
            <select
              name="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={handleChange}
              className="w-full appearance-none border rounded-xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-[#5e3e76] bg-white"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>

            <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm" />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">No HP</label>
          <input
            type="text"
            name="no_hp"
            value={form.no_hp}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
          />
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end mt-10">
        <button
          onClick={handleSubmit}
          className="bg-[#5e3e76] hover:bg-[#4b315e] text-white px-8 py-4 rounded-xl transition"
        >
          Simpan Perubahan
        </button>
      </div>

      {/* SUCCESS / ERROR POPUP */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          {/* MODAL */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center">
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
            >
              <FiX size={22} />
            </button>

            {/* ICON */}
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                popup.type === "success" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <FiCheckCircle
                className={`text-4xl ${
                  popup.type === "success" ? "text-green-600" : "text-red-500"
                }`}
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {popup.type === "success" ? "Berhasil" : "Gagal"}
            </h2>

            <p className="text-gray-500">{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
