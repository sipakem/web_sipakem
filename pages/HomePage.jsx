import { useNavigate } from "react-router-dom";

import { FaArrowRight } from "react-icons/fa";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import heroBg from "../assets/hero-bg.jpeg";

import icon1 from "../assets/icon1.png";
import icon2 from "../assets/icon2.png";
import icon3 from "../assets/icon3.png";
import icon4 from "../assets/icon4.png";
import icon5 from "../assets/icon5.png";

export default function HomePage() {
  const navigate = useNavigate();

  const fitur = [
    {
      title: "Kenali Kondisi Anda",
      desc: "Pilih gejalanya untuk mendapatkan hasil diagnosis dan rekomendasi penanganan",
      button: "Mulai Konsultasi",
    },
    {
      title: "Jenis Kecemasan",
      desc: "Kenali berbagai jenis gangguan kecemasan seperti panic disorder, fobia spesifik, OCD, social anxiety, GAD, PTSD",
      button: "Pelajari lebih lanjut",
    },
    {
      title: "Tentang Kecemasan",
      desc: "Penyebab, gejala, dampak, serta cara mengelola kecemasan dalam kehidupan sehari-hari.",
      button: "Pelajari lebih lanjut",
    },
  ];

  const statistik = [
    {
      angka: "52.519 %",
      desc: "Banyaknya perokok terhadap tingkat kecemasan",
    },
    {
      angka: "",
      desc: "Asupan kafein beresiko meningkatkan gangguan kecemasan",
    },
    {
      angka: "",
      desc: "Rata - rata tingkat gangguan kecemasan dipengaruhi oleh jam tidur",
    },
  ];

  const caraKerja = [
    {
      title: "ISI TES PSIKOLOGI",
      desc: "Jawab pertanyaan sesuai dengan kondisi yang anda alami.",
      icon: icon1,
    },
    {
      title: "SISTEM MENGANALISIS",
      desc: "Sistem akan menganalisis jawaban anda secara aman dan akurat",
      icon: icon2,
    },
    {
      title: "DAPAT HASIL & REKOMENDASI",
      desc: "Anda akan mendapatkan hasil evaluasi dan saran penanganan awal",
      icon: icon3,
    },
    {
      title: "PAHAMI & AMBIL TINDAKAN",
      desc: "Gunakan informasi untuk memahami diri dan ambil langkah yang tepat",
      icon: icon4,
    },
  ];

  return (
    <div className="bg-white text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative h-[90vh] flex items-center overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(
            rgba(255,255,255,0.35),
            rgba(255,255,255,0.35)
          ), url(${heroBg})`,
          backgroundPosition: "center center",
        }}
      >
        <div className="relative z-10 w-full px-6 md:px-16 lg:px-24">
          <div className="max-w-3xl -mt-10 md:-mt-16 lg:-mt-20">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Selamat Datang di
              <span className="text-[#5e3e76]"> SIPAKEM</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-bold leading-relaxed mb-8 text-gray-800">
              Tempat untuk Memahami, Membantu, dan Menenangkan.
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-2xl">
              Website yang dirancang untuk membantu pengguna memahami kondisi
              mental, mendapatkan analisis awal, serta memperoleh rekomendasi
              dan solusi yang bermanfaat.
            </p>

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* BUTTON UTAMA */}
              <button
                onClick={() => navigate("/konsultasi")}
                className="bg-[#5e3e76] hover:bg-[#4c315f] text-white px-8 py-4 rounded-2xl shadow-xl transition duration-300 flex items-center justify-center gap-3"
              >
                Mulai Tes Sekarang
                <FaArrowRight />
              </button>

              {/* BUTTON TRANSPARAN */}
              <button
                onClick={() => navigate("/informasi")}
                className="border-2 border-[#5e3e76] text-[#5e3e76] hover:bg-[#5e3e76] hover:text-white px-8 py-4 rounded-2xl transition duration-300 flex items-center justify-center gap-3 backdrop-blur-sm bg-white/20"
              >
                Pelajari Lebih Lanjut
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMASI */}
      <section className="py-24 bg-white text-center overflow-hidden">
        <div className="px-6 md:px-20">
          <h3 className="text-3xl md:text-4xl font-bold text-[#5e3e76] mb-6">
            Apa itu tes psikologi online?
          </h3>

          <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed text-base md:text-lg mb-20">
            Tes psikologi online adalah serangkaian pertanyaan yang dirancang
            untuk membantu Anda memahami kondisi emosional, tingkat kecemasan,
            serta mendapatkan informasi awal yang berguna.
          </p>

          {/* CARD FITUR */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {fitur.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-8 text-left hover:shadow-md transition bg-white"
              >
                <h4 className="text-lg font-bold text-[#5e3e76] mb-5">
                  {item.title}
                </h4>

                <p className="text-gray-600 leading-relaxed mb-10 text-sm">
                  {item.desc}
                </p>

                <button
                  onClick={() =>
                    item.button === "Mulai Konsultasi"
                      ? navigate("/konsultasi")
                      : navigate("/informasi")
                  }
                  className="flex items-center gap-2 text-[#5e3e76] font-medium hover:underline transition"
                >
                  {item.button}

                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* STATISTIK */}
        <div className="bg-[#f3ebf8] py-12 px-8 md:px-20">
          <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {statistik.map((item, index) => (
              <div
                key={index}
                className={`text-left flex flex-col justify-start min-h-[120px] ${
                  index !== 2 ? "md:border-r border-gray-300" : ""
                } md:pr-10`}
              >
                {/* ANGKA */}
                {item.angka && (
                  <h3 className="text-3xl font-bold text-[#5e3e76] mb-4">
                    {item.angka}
                  </h3>
                )}

                {/* DESKRIPSI */}
                <p className="text-gray-800 leading-relaxed text-[17px] max-w-[260px]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="py-24 px-6 md:px-20 bg-white text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-[#5e3e76] mb-20">
          Cara Kerja SIPAKEM
        </h3>

        <div className="grid md:grid-cols-4 gap-12">
          {caraKerja.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* ICON */}
              <div className="w-28 h-28 rounded-full bg-[#f3ebf8] flex items-center justify-center mb-8 shadow-sm">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-14 h-14 object-contain"
                />
              </div>

              <h4 className="font-bold text-[#5e3e76] text-sm mb-4">
                {item.title}
              </h4>

              <p className="text-gray-600 text-sm leading-relaxed max-w-[220px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="konsultasi" className="px-8 md:px-20 pb-24 bg-white">
        <div className="bg-[#f3ebf8] rounded-[40px] px-10 py-14 md:px-16 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-12 shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10 w-full">
            <img
              src={icon5}
              alt="Mental Health"
              className="w-52 md:w-60 lg:w-72 h-auto object-contain flex-shrink-0"
            />

            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-[#5e3e76] mb-4 leading-tight">
                Mulai Kenali Kondisi Mental Anda Sekarang
              </h3>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Lakukan tes psikologi online dengan mudah melalui SIPAKEM
              </p>

              <button
                onClick={() => navigate("/konsultasi")}
                className="bg-[#5e3e76] hover:bg-[#4c315f] text-white px-8 py-4 rounded-2xl shadow-lg transition flex items-center gap-3"
              >
                Mulai Tes Sekarang
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
