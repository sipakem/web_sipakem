import { HiOutlineShieldCheck } from "react-icons/hi2";

export default function HasilDiagnosis({ hasil }) {
  if (!hasil) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-[28px] p-8 shadow-sm">
      {/* HEADER */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#ede7f3] flex items-center justify-center">
          <HiOutlineShieldCheck className="text-3xl text-[#5e3e76]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#5e3e76]">Hasil Diagnosis</h2>

          <p className="text-gray-500">Berdasarkan gejala yang anda pilih</p>
        </div>
      </div>

      {/* HASIL */}
      <div className="bg-[#f6f1fa] rounded-2xl p-6 mb-6">
        <p className="text-gray-500 mb-2">Jenis Kecemasan</p>

        {/* FIX UTAMA DI SINI */}
        <h3 className="text-2xl font-bold text-[#5e3e76]">{hasil.diagnosis}</h3>

        {/* PERSENTASE*/}
        {hasil.persen !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Tingkat kecocokan</span>

              <span className="font-semibold text-[#5e3e76]">
                {hasil.persen}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#5e3e76] h-3 rounded-full transition-all duration-700"
                style={{ width: `${hasil.persen}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* DESKRIPSI */}
      <div>
        <h4 className="font-semibold text-[#5e3e76] mb-2">Deskripsi</h4>

        <p className="text-gray-600 leading-relaxed">{hasil.deskripsi}</p>
      </div>
    </div>
  );
}
