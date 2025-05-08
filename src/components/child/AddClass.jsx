import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DefaultInputs = () => {
  const { id } = useParams(); // jika ada id berarti mode edit
  const isEditMode = !!id;
  const [formData, setFormData] = useState({
    name: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const token = localStorage.getItem("token");

      // Ambil data kelas dari server
      axios.get(`${BASE_URL}/classes/${id}`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
        .then((res) => {
          setFormData(res.data.data);
        })
        .catch((err) => {
          toast.error("Gagal ambil data kelas");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (isEditMode) {
        // Update data
        await axios.put(`${BASE_URL}/classes/${id}`,
          formData,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json", // jika pakai FormData
            },
          }
        );
        toast.success("Kelas berhasil diperbarui!");
      } else {
        // Tambah data baru
        await axios.post(`${BASE_URL}/classes`,
          formData, 
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json", // jika pakai FormData
            },
          }
        );
        toast.success("Kelas berhasil ditambahkan!");
      }

      navigate("/class-list"); // Ganti sesuai route yang kamu pakai
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan kelas.");
      if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/sign-in");
      }
    }
  };

  return (
    <div className='col-md-12'>
      <form onSubmit={handleSubmit}>
        <div className='card'>
          <div className='card-header'>
            <h6 className='card-title mb-0'>{isEditMode ? "Edit Kelas" : "Tambah Kelas"}</h6>
          </div>
          <div className='card-body'>
            <div className='row gy-3'>
              <div className='col-12'>
                <label className='form-label'>Nama Kelas</label>
                <input type='text'
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='form-control' />
              </div>
              <div className='col-12'>
                <button type='submit' className='btn btn-primary-600'>
                {isEditMode ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DefaultInputs;
