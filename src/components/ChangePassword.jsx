import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaLock, FaArrowLeft } from "react-icons/fa";

import { FiX, FiCheckCircle } from "react-icons/fi";

export default function ChangePassword({ onBack }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    email: user?.email || "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // POPUP
  const [popup, setPopup] = useState({
    show: false,
    type: "success", // success | error
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      !form.email ||
      !form.old_password ||
      !form.new_password ||
      !form.confirm_password
    ) {
      setPopup({
        show: true,
        type: "error",
        message: "Semua field wajib diisi",
      });
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setPopup({
        show: true,
        type: "error",
        message: "Konfirmasi password tidak cocok",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/change-password/${user.id_pengguna}`,
        form,
      );

      setPopup({
        show: true,
        type: "success",
        message: response.data.message,
      });

      setForm({
        email: user?.email || "",
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        onBack();
      }, 1200);
    } catch (error) {
      setPopup({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Gagal mengganti password",
      });
    }
  };

  return (
    <div className="bg-[#fdfdfd] rounded-[30px] p-10 shadow-sm min-h-[700px] relative">
      {/* BACK */}
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-[#5e3e76] mb-8 flex items-center gap-2"
      >
        <FaArrowLeft />
        Kembali
      </button>

      {/* TITLE */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <FaLock className="text-[#5e3e76] text-3xl" />
          <h2 className="text-4xl font-bold text-[#5e3e76]">Ganti Password</h2>
        </div>

        <p className="text-gray-500">
          Pastikan password anda kuat dan tidak mudah ditebak.
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-6">
        {/* EMAIL */}
        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-xl px-5 py-4"
          />
        </div>

        {/* OLD PASSWORD */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Password Lama
          </label>

          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="old_password"
              value={form.old_password}
              onChange={handleChange}
              className="w-full border rounded-xl px-5 py-4 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* NEW PASSWORD */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Password Baru
          </label>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={form.new_password}
              onChange={handleChange}
              className="w-full border rounded-xl px-5 py-4 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block mb-2 text-sm font-medium">
            Konfirmasi Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full border rounded-xl px-5 py-4 pr-14"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#5e3e76] hover:bg-[#4d315f] text-white px-8 py-4 rounded-xl"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* POPUP (UPDATED MODAL STYLE) */}
      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />

          {/* MODAL */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center">
            {/* CLOSE */}
            <button
              onClick={() => setPopup({ ...popup, show: false })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
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

            {/* TITLE */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {popup.type === "success" ? "Berhasil" : "Gagal"}
            </h2>

            {/* MESSAGE */}
            <p className="text-gray-500">{popup.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
