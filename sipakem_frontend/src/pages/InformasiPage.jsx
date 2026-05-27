import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { FaChartBar } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function InformasiPage() {
  const [jenisKecemasan, setJenisKecemasan] = useState([]);

  const tentangKecemasan = [
    {
      title: "Apa itu kecemasan ?",
      desc: "Kecemasan adalah perasaan khawatir atau takut yang berlebihan terhadap situasi tertentu. Hal ini wajar terjadi, namun jika berlangsung terus-menerus dapat mengganggu aktivitas sehari-hari.",
    },
    {
      title: "Gejala Umum",
      desc: "Gejala kecemasan dapat berupa jantung berdebar, sulit tidur, rasa tegang sulit fokus, hingga gangguan pencernaan.",
    },
    {
      title: "Penyebab",
      desc: "Kecemasan dapat dipicu oleh faktor biologis, psikologis, sosial, maupun lingkungan, seperti tekanan pekerjaan, masalah keluarga, atau pengalaman traumatis.",
    },
    {
      title: "Mengapa penting ?",
      desc: "Mengenali dan memahami kecemasan sejak dini dapat membantu anda mendapatkan penanganan yang tepat dan meningkatkan kualitas hidup.",
    },
  ];

  // GET DATA DIAGNOSIS
  useEffect(() => {
    getDiagnosis();
  }, []);

  const getDiagnosis = async () => {
    try {
      const response = await axios.get("http://localhost:5000/diagnosis/all");

      setJenisKecemasan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800">
      {/* NAVBAR */}
      <Navbar />

      <section className="px-5 md:px-10 lg:px-14 py-14">
        {/* TENTANG KECEMASAN */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <FaChartBar className="text-[#5e3e76] text-2xl" />

            <h1 className="text-3xl font-bold text-[#5e3e76]">
              Tentang Kecemasan
            </h1>
          </div>

          <p className="text-gray-600 max-w-3xl leading-relaxed mb-10">
            Kecemasan adalah respons tubuh terhadap stres atau situasi yang
            dirasa mengancam. Memahami kecemasan adalah langkah pertama untuk
            mengelolanya dengan lebih baik.
          </p>

          {/* CARD */}
          <div className="grid md:grid-cols-4 gap-5">
            {tentangKecemasan.map((item, index) => (
              <div
                key={index}
                className="bg-[#f8f4fc] rounded-2xl p-6 min-h-[220px]"
              >
                <h3 className="font-bold text-[#5e3e76] mb-5">{item.title}</h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* GARIS */}
        <div className="border-t border-gray-300 mb-14"></div>

        {/* JENIS KECEMASAN */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <HiOutlineDocumentText className="text-[#5e3e76] text-2xl" />

            <h2 className="text-3xl font-bold text-[#5e3e76]">
              Jenis Kecemasan
            </h2>
          </div>

          <p className="text-gray-600 mb-10">
            Beberapa jenis kecemasan yang umum dialami dan perlu diwaspadai.
          </p>

          {/* CARD JENIS */}
          <div className="grid md:grid-cols-2 gap-6">
            {jenisKecemasan.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-2xl p-8 hover:shadow-sm transition"
              >
                <h3 className="font-bold text-[#5e3e76] mb-5">{item.nama}</h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
