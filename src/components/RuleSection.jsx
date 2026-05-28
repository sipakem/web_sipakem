import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RuleSection() {
  const [gejala, setGejala] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);
  const [rekomendasi, setRekomendasi] = useState([]);
  const navigate = useNavigate();

  const [formRule, setFormRule] = useState({
    gejala_ids: [],
    diagnosis_id: "",
    rekomendasi_id: "",
  });

  // GET DATA
  useEffect(() => {
    fetchGejala();
    fetchDiagnosis();
    fetchRekomendasi();
  }, []);

  const fetchGejala = async () => {
    const response = await fetch("http://127.0.0.1:5000/gejala/all");
    const data = await response.json();

    setGejala(data);
  };

  const fetchDiagnosis = async () => {
    const response = await fetch("http://127.0.0.1:5000/diagnosis/all");
    const data = await response.json();

    setDiagnosis(data);
  };

  const fetchRekomendasi = async () => {
    const response = await fetch("http://127.0.0.1:5000/rekomendasi/all");
    const data = await response.json();

    setRekomendasi(data);
  };

  // HANDLE GEJALA
  const handleGejalaChange = (id) => {
    if (formRule.gejala_ids.includes(id)) {
      setFormRule({
        ...formRule,
        gejala_ids: formRule.gejala_ids.filter((item) => item !== id),
      });
    } else {
      setFormRule({
        ...formRule,
        gejala_ids: [...formRule.gejala_ids, id],
      });
    }
  };

  // HANDLE PILIHAN
  const handleSelect = (name, value) => {
    setFormRule({
      ...formRule,
      [name]: value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:5000/rule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formRule),
    });

    alert("Rule berhasil ditambahkan");

    setFormRule({
      gejala_ids: [],
      diagnosis_id: "",
      rekomendasi_id: "",
    });
  };

  return (
    <section className="border rounded-3xl p-8 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold text-purple-700">
          Kelola Rule Forward Chaining
        </h2>

        <button
          onClick={() => navigate("/rule")}
          className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-5 py-3 rounded-xl text-sm transition"
        >
          Lihat Semua Rule
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* GEJALA */}
        <div>
          <h3 className="text-xl font-bold mb-5 text-gray-700">Pilih Gejala</h3>

          <div className="grid md:grid-cols-2 gap-4">
            {gejala.map((item) => (
              <label
                key={item.id}
                className={`border rounded-2xl p-4 cursor-pointer transition ${
                  formRule.gejala_ids.includes(item.id)
                    ? "bg-purple-100 border-purple-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={formRule.gejala_ids.includes(item.id)}
                    onChange={() => handleGejalaChange(item.id)}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-purple-700">{item.kode}</p>

                    <p className="text-gray-700">{item.nama}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* DIAGNOSIS */}
        <div>
          <h3 className="text-xl font-bold mb-5 text-gray-700">
            Pilih Diagnosis
          </h3>

          <div className="grid gap-4">
            {diagnosis.map((item) => (
              <label
                key={item.id}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  formRule.diagnosis_id == item.id
                    ? "bg-green-100 border-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="diagnosis"
                    checked={formRule.diagnosis_id == item.id}
                    onChange={() => handleSelect("diagnosis_id", item.id)}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-green-700">{item.nama}</p>

                    <p className="text-gray-600 mt-1">{item.deskripsi}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* REKOMENDASI */}
        <div>
          <h3 className="text-xl font-bold mb-5 text-gray-700">
            Pilih Rekomendasi
          </h3>

          <div className="grid gap-4">
            {rekomendasi.map((item) => (
              <label
                key={item.id}
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  formRule.rekomendasi_id == item.id
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex gap-3">
                  <input
                    type="radio"
                    name="rekomendasi"
                    checked={formRule.rekomendasi_id == item.id}
                    onChange={() => handleSelect("rekomendasi_id", item.id)}
                    className="mt-1"
                  />

                  <div>
                    <p className="font-bold text-blue-700">{item.kode}</p>

                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-4 rounded-2xl transition"
        >
          Simpan Rule
        </button>
      </form>
    </section>
  );
}
