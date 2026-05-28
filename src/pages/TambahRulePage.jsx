import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import { FiArrowLeft, FiX, FiCheckCircle } from "react-icons/fi";

export default function TambahRulePage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEdit = Boolean(id);

  // USER LOGIN
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  // SUCCESS POPUP
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  });

  // VALIDATION POPUP
  const [validationPopup, setValidationPopup] = useState({
    show: false,
    message: "",
  });

  const [diagnosisList, setDiagnosisList] = useState([]);
  const [rekomendasiList, setRekomendasiList] = useState([]);
  const [gejalaList, setGejalaList] = useState([]);

  const [searchGejala, setSearchGejala] = useState("");

  const [formData, setFormData] = useState({
    diagnosis_id: "",
    rekomendasi_id: "",
    gejala_ids: [],
  });

  // FETCH MASTER
  const fetchMasterData = async () => {
    try {
      const [diagnosisRes, rekomendasiRes, gejalaRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/diagnosis/all"),
        fetch("http://127.0.0.1:5000/rekomendasi/all"),
        fetch("http://127.0.0.1:5000/gejala/all"),
      ]);

      const diagnosisData = await diagnosisRes.json();
      const rekomendasiData = await rekomendasiRes.json();
      const gejalaData = await gejalaRes.json();

      setDiagnosisList(diagnosisData);
      setRekomendasiList(rekomendasiData);
      setGejalaList(gejalaData);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH DETAIL
  const fetchRuleDetail = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://127.0.0.1:5000/rule/${id}`);

      const data = await response.json();

      setFormData({
        diagnosis_id: data.diagnosis_id || "",
        rekomendasi_id: data.rekomendasi_id || "",
        gejala_ids: data.gejala_ids || [],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();

    if (isEdit) {
      fetchRuleDetail();
    }
  }, []);

  // FILTER GEJALA
  const filteredGejala = useMemo(() => {
    return gejalaList.filter(
      (item) =>
        item.nama.toLowerCase().includes(searchGejala.toLowerCase()) ||
        item.kode.toLowerCase().includes(searchGejala.toLowerCase()),
    );
  }, [gejalaList, searchGejala]);

  // SELECTED REKOMENDASI
  const selectedRekomendasi = rekomendasiList.find(
    (item) => item.id == formData.rekomendasi_id,
  );

  // HANDLE GEJALA
  const handleGejalaChange = (id) => {
    const alreadySelected = formData.gejala_ids.includes(id);

    if (alreadySelected) {
      setFormData({
        ...formData,
        gejala_ids: formData.gejala_ids.filter((item) => item !== id),
      });
    } else {
      setFormData({
        ...formData,
        gejala_ids: [...formData.gejala_ids, id],
      });
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.diagnosis_id ||
      !formData.rekomendasi_id ||
      formData.gejala_ids.length === 0
    ) {
      setValidationPopup({
        show: true,
        message: "Lengkapi data terlebih dahulu",
      });

      return;
    }

    try {
      setLoading(true);

      const url = isEdit
        ? `http://127.0.0.1:5000/rule/${id}`
        : "http://127.0.0.1:5000/rule";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          admin_id: user?.id_pengguna,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      // SUCCESS POPUP
      setSuccessPopup({
        show: true,
        message: isEdit
          ? "Rule berhasil diperbarui"
          : "Rule berhasil ditambahkan",
      });

      setTimeout(() => {
        setSuccessPopup({ show: false, message: "" });
        navigate("/rule");
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // HANDLE BATAL
  const handleBatal = () => {
    const isFormFilled =
      formData.diagnosis_id !== "" ||
      formData.rekomendasi_id !== "" ||
      formData.gejala_ids.length > 0;

    // jika form kosong → kembali
    if (!isFormFilled) {
      navigate("/rule");
    } else {
      // reset form
      setFormData({
        diagnosis_id: "",
        rekomendasi_id: "",
        gejala_ids: [],
      });

      setSearchGejala("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <AdminNavbar />

      <div className="px-6 md:px-14 py-10">
        {/* HEADER */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#5e3e76]">
              {isEdit ? "EDIT RULE" : "TAMBAH RULE"}
            </h1>

            <p className="text-gray-600 mt-2">
              {isEdit
                ? "Perbarui rule forward chaining"
                : "Tambahkan rule forward chaining"}
            </p>
          </div>

          {/* BUTTON KEMBALI */}
          <button
            onClick={() => navigate("/rule")}
            className="w-14 h-14 rounded-2xl border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={24} className="text-[#5e3e76]" />
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-20 text-center">
            Loading...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8"
          >
            {/* LEFT */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#5e3e76]">
                    Pilih Gejala
                  </h2>

                  <p className="text-gray-500 mt-1">Pilih gejala yang sesuai</p>
                </div>

                <div className="bg-[#ede4f4] text-[#5e3e76] px-4 py-2 rounded-2xl text-sm font-semibold">
                  {formData.gejala_ids.length} Dipilih
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Cari kode atau nama gejala..."
                  value={searchGejala}
                  onChange={(e) => setSearchGejala(e.target.value)}
                  className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#5e3e76]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 pr-2">
                {filteredGejala.map((item) => (
                  <label
                    key={item.id}
                    className={`border rounded-2xl p-4 cursor-pointer transition ${
                      formData.gejala_ids.includes(item.id)
                        ? "bg-[#ede4f4] border-[#5e3e76]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex gap-3 items-start">
                      <input
                        type="checkbox"
                        checked={formData.gejala_ids.includes(item.id)}
                        onChange={() => handleGejalaChange(item.id)}
                        className="mt-1 accent-[#5e3e76]"
                      />

                      <div>
                        <p className="font-bold text-[#5e3e76]">{item.kode}</p>

                        <p className="text-gray-700 text-sm mt-1">
                          {item.nama}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="sticky top-5 h-fit">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#5e3e76]">
                    Detail Rule
                  </h2>
                </div>

                {/* DIAGNOSIS */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Pilih Diagnosis
                  </h3>

                  <div className="space-y-3">
                    {diagnosisList.map((item) => (
                      <label
                        key={item.id}
                        className={`border rounded-2xl p-4 cursor-pointer block ${
                          formData.diagnosis_id == item.id
                            ? "bg-[#ede4f4] border-[#5e3e76]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <input
                            type="radio"
                            checked={formData.diagnosis_id == item.id}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                diagnosis_id: item.id,
                              })
                            }
                            className="accent-[#5e3e76]"
                          />

                          <div>
                            <p className="font-bold text-[#5e3e76]">
                              {item.kode}
                            </p>

                            <p>{item.nama}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* REKOMENDASI */}
                <div className="mb-8">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Pilih Rekomendasi
                  </h3>

                  <div className="space-y-3">
                    {rekomendasiList.map((item) => (
                      <label
                        key={item.id}
                        className={`border rounded-2xl p-4 cursor-pointer block ${
                          formData.rekomendasi_id == item.id
                            ? "bg-[#ede4f4] border-[#5e3e76]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex gap-3 items-start">
                          <input
                            type="radio"
                            checked={formData.rekomendasi_id == item.id}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                rekomendasi_id: item.id,
                              })
                            }
                            className="accent-[#5e3e76]"
                          />

                          <div>
                            <p className="font-bold text-[#5e3e76]">
                              {item.kode}
                            </p>

                            <p className="text-sm mt-1">{item.deskripsi}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BUTTON */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-[#5e3e76] hover:bg-[#4d315f] text-white py-4 rounded-2xl font-semibold transition"
                  >
                    {isEdit ? "Update Rule" : "Tambah Rule"}
                  </button>

                  <button
                    type="button"
                    onClick={handleBatal}
                    className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-2xl font-semibold transition"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      {successPopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* BACKDROP */}
          <div className="absolute inset-0 bg-black/40" />

          {/* MODAL */}
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-[360px] text-center">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSuccessPopup({ show: false, message: "" })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            {/* ICON (UPDATED) */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>

            {/* TITLE */}
            <h2 className="text-xl font-bold mb-2">Berhasil</h2>

            {/* MESSAGE */}
            <p className="text-gray-500">{successPopup.message}</p>
          </div>
        </div>
      )}

      {/* VALIDATION POPUP */}
      {validationPopup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-[380px] text-center">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setValidationPopup({ show: false, message: "" })}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FiX size={22} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 text-2xl">!</span>
            </div>

            <h2 className="text-xl font-bold mb-2">Peringatan</h2>

            <p className="text-gray-500">{validationPopup.message}</p>

            <button
              onClick={() => setValidationPopup({ show: false, message: "" })}
              className="mt-6 bg-[#5e3e76] hover:bg-[#4d315f] text-white px-6 py-3 rounded-2xl font-semibold transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
