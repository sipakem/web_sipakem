import { HiOutlineInformationCircle } from "react-icons/hi";
import { HiOutlineLightBulb } from "react-icons/hi2";

export default function RekomendasiCard({ rekomendasi }) {
  return (
    <div className="bg-white border border-gray-200 rounded-[28px] p-8 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#ede7f3] flex items-center justify-center">
          <HiOutlineLightBulb className="text-3xl text-[#5e3e76]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#5e3e76] mb-2">
            Rekomendasi
          </h2>

          <p className="text-gray-500">
            Berikut saran yang dapat membantu anda.
          </p>
        </div>
      </div>

      {/* REKOMENDASI */}
      <div className="space-y-4">
        {rekomendasi.length > 0 ? (
          rekomendasi.map((item, index) => (
            <div key={index} className="bg-[#f6f1fa] rounded-2xl p-5">
              <p className="font-bold text-[#5e3e76] mb-2">{item.title}</p>

              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))
        ) : (
          <div className="bg-[#f6f1fa] rounded-2xl p-5 text-gray-500">
            Belum ada rekomendasi.
          </div>
        )}
      </div>

      {/* CATATAN */}
      <div className="mt-8 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <HiOutlineInformationCircle className="text-[#5e3e76] text-xl" />

          <p className="font-semibold text-gray-700">Catatan Penting</p>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed">
          Hasil ini bukan pengganti diagnosis medis profesional. Konsultasikan
          dengan psikolog apabila diperlukan.
        </p>
      </div>
    </div>
  );
}
