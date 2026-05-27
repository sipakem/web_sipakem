import {
  FaInfoCircle,
  FaUserCircle,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import dokumentasi1 from "../assets/dokumentasi1.jpg";
import dokumentasi2 from "../assets/dokumentasi2.jpg";
import dokumentasi3 from "../assets/dokumentasi3.jpg";
import dokumentasi4 from "../assets/dokumentasi4.jpg";
import dokumentasi5 from "../assets/dokumentasi5.jpg";
import dokumentasi6 from "../assets/dokumentasi6.jpg";
import icon6 from "../assets/icon6.png";
import psikologImg from "../assets/psikolog.jpeg";

export default function TentangKami({ onBack }) {
  const teams = [
    "Intan Arini Siansah Putri",
    "Talita Audrey Maritza Distany",
    "Elfa Fristcilla",
    "Muhammad Alfi Rizki",
    "Danang Syahrul Hidayat",
  ];

  const galleries = [
    dokumentasi1,
    dokumentasi2,
    dokumentasi3,
    dokumentasi4,
    dokumentasi5,
    dokumentasi6,
  ];

  return (
    <div className="bg-white rounded-[30px] p-10 shadow-sm min-h-[700px]">
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-[#5e3e76] mb-8 flex items-center gap-2 transition"
      >
        <FaArrowLeft />
        Kembali
      </button>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#f3ebf8] flex items-center justify-center text-[#5e3e76]">
            <FaInfoCircle size={20} />
          </div>

          <h2 className="text-4xl font-bold text-[#5e3e76]">Tentang Kami</h2>
        </div>

        <p className="text-gray-500">
          Pastikan mengenal lebih dekat tim kami melalui website SIPAKEM.
        </p>
      </div>

      {/* VISI MISI */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {/* VISI */}
        <div className="border rounded-3xl p-8 shadow-sm hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-[#5e3e76] mb-5">VISI</h3>

          <p className="text-gray-600 leading-relaxed">
            Menjadi platform terpercaya dalam membantu pengguna memahami kondisi
            kesehatan mental secara modern, mudah diakses, dan memberikan
            rekomendasi yang bermanfaat.
          </p>
        </div>

        {/* MISI */}
        <div className="border rounded-3xl p-8 shadow-sm hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-[#5e3e76] mb-5">MISI</h3>

          <ul className="space-y-4 text-gray-600">
            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-[#5e3e76]" />
              Membantu konsultasi kesehatan mental
            </li>

            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-[#5e3e76]" />
              Menyediakan informasi psikologi
            </li>

            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-[#5e3e76]" />
              Memberikan rekomendasi solusi
            </li>

            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-[#5e3e76]" />
              Menghadirkan layanan modern
            </li>

            <li className="flex items-center gap-3">
              <FaCheckCircle className="text-[#5e3e76]" />
              Membantu pengguna lebih memahami diri
            </li>
          </ul>
        </div>
      </div>

      {/* PSIKOLOG */}
      <div className="mb-20">
        <h3 className="text-3xl font-bold text-center text-[#5e3e76] mb-10">
          Psikolog
        </h3>

        <div className="bg-[#f3ebf8] rounded-[32px] p-10 shadow-sm border border-gray-200 w-full">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* FOTO */}
            <img
              src={psikologImg}
              alt="Psikolog"
              className="
          w-40
          h-40
          md:w-44
          md:h-44
          rounded-full
          object-cover
          border-4
          border-white
          shadow-md
        "
            />

            {/* INFO */}
            <div className="text-center md:text-left">
              <h4 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-snug">
                Putri Pusvitasari, S.Psi., M.Psi., Psikolog
              </h4>

              <p className="text-gray-700 text-lg leading-relaxed">
                Dosen aktif
                <br />
                Universitas Jenderal Achmad Yani Yogyakarta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div className="mb-20">
        <h3 className="text-3xl font-bold text-center text-[#5e3e76] mb-10">
          Tim
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {teams.map((team, index) => (
            <div
              key={index}
              className="border rounded-2xl p-5 text-center hover:shadow-md transition"
            >
              <div className="w-20 h-20 rounded-full bg-[#f3ebf8] mx-auto mb-4 flex items-center justify-center">
                <FaUserCircle size={40} className="text-[#5e3e76]" />
              </div>

              <h4 className="font-semibold text-gray-700">{team}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <div className="mb-20">
        <h3 className="text-3xl font-bold text-center text-[#5e3e76] mb-10">
          Galeri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((image, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden bg-white shadow-md"
            >
              <img
                src={image}
                alt="Gallery"
                className="
          w-full
          h-auto
          sm:h-64
          lg:h-72
          object-contain
          lg:object-cover
          object-center
        "
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-[#f3ebf8] rounded-3xl p-8 flex items-center gap-6">
        <img
          src={icon6}
          alt="Heart Icon"
          className="w-[50px] h-[50px] object-contain"
        />

        <p className="text-gray-700 leading-relaxed">
          Kesehatan mental adalah perjalanan, bukan tujuan. Kami hadir untuk
          membantu anda memahami diri dengan lebih baik.
        </p>
      </div>
    </div>
  );
}
