import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSection({
  title,
  formTitle,
  buttonText,
  endpoint,
  columns,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    deskripsi: "",
  });
  const [editId, setEditId] = useState(null);

  const [rows, setRows] = useState([]);

  // GET DATA
  const fetchData = async () => {
    const response = await fetch(`https://sipakembackend-production.up.railway.app/${endpoint}`);
    const data = await response.json();

    setRows(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `https://sipakembackend-production.up.railway.app/${endpoint}/${editId}`
      : `https://sipakembackend-production.up.railway.app/${endpoint}`;

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      kode: "",
      nama: "",
      deskripsi: "",
    });

    setEditId(null);

    fetchData();
  };

  const handleEdit = (item) => {
    setEditId(item.id);

    setFormData({
      kode: item.kode,
      nama: item.nama,
      deskripsi: item.deskripsi || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data?");

    if (!confirmDelete) return;

    await fetch(`https://sipakembackend-production.up.railway.app/${endpoint}/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <section className="border rounded-3xl p-8 shadow-sm bg-white">
      <div className="grid md:grid-cols-2 gap-10">
        {/* FORM */}
        <div>
          <h3 className="text-2xl font-bold text-purple-700 mb-8">
            {formTitle}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              placeholder="Masukkan kode"
              className="w-full border rounded-xl px-5 py-4"
            />

            {endpoint !== "rekomendasi" && (
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama"
                className="w-full border rounded-xl px-5 py-4"
              />
            )}

            {endpoint !== "gejala" && (
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Masukkan deskripsi"
                className="w-full border rounded-xl px-5 py-4 h-32"
              ></textarea>
            )}

            <button className="bg-purple-700 text-white px-8 py-4 rounded-2xl">
              {editId ? "Update Data" : buttonText}
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-purple-700">{title}</h3>

            <button
              onClick={() => navigate(`/${endpoint}`)}
              className="bg-purple-200 hover:bg-purple-300 text-purple-800 px-5 py-3 rounded-xl text-sm transition"
            >
              Lihat Semua Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-purple-50">
                  {columns.map((col, index) => (
                    <th key={index} className="border px-4 py-3 text-left">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="border px-4 py-3">{index + 1}</td>

                    <td className="border px-4 py-3">{row.kode}</td>

                    {/* GEJALA */}
                    {endpoint === "gejala" && (
                      <td className="border px-4 py-3">{row.nama}</td>
                    )}

                    {/* DIAGNOSIS */}
                    {endpoint === "diagnosis" && (
                      <>
                        <td className="border px-4 py-3">{row.nama}</td>
                        <td className="border px-4 py-3">{row.deskripsi}</td>
                      </>
                    )}

                    {/* REKOMENDASI */}
                    {endpoint === "rekomendasi" && (
                      <td className="border px-4 py-3">{row.deskripsi}</td>
                    )}

                    {/* AKSI */}
                    <td className="border px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() => handleDelete(row.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
