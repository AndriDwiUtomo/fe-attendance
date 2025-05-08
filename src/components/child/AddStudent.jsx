import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentInputs = () => {
  const { id } = useParams(); // untuk edit mode
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    nis: "",
    name: "",
    gender: "",
    birth_date: "",
    address: "",
    classId: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch list kelas
    axios.get(`${BASE_URL}/classes`, 
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then(res => {
        setClasses(res.data.data.data || []);
      })
      .catch(() => toast.error("Gagal mengambil daftar kelas"));

    // Jika mode edit, ambil data siswa
    if (isEditMode) {
      axios.get(`${BASE_URL}/students/${id}`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
        .then(res => {
          setFormData(res.data.data);
        })
        .catch(() => toast.error("Gagal mengambil data siswa"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (isEditMode) {
        await axios.put(`${BASE_URL}/students/${id}`, formData, 
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json", // jika pakai FormData
            },
          }
        );
        toast.success("Data siswa diperbarui!");
      } else {
        await axios.post(`${BASE_URL}/students`, formData, 
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json", // jika pakai FormData
            },
          }
        );
        toast.success("Siswa berhasil ditambahkan!");
      }

      navigate("/student-list");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan data siswa.");
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
            <h6 className='card-title mb-0'>{isEditMode ? "Edit Siswa" : "Tambah Siswa"}</h6>
          </div>
          <div className='card-body'>
            <div className='row gy-3'>
              <div className='col-12'>
                <label className='form-label'>NIS</label>
                <input
                  type='text'
                  name='nis'
                  value={formData.nis}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>
              <div className='col-12'>
                <label className='form-label'>Nama</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>
              <div className='col-12'>
                <label className='form-label'>Jenis Kelamin</label>
                <select
                  name='gender'
                  value={formData.gender}
                  onChange={handleChange}
                  className='form-select'
                  required
                >
                  <option value=''>-- Pilih Jenis Kelamin --</option>
                  <option value='L'>Laki-laki</option>
                  <option value='P'>Perempuan</option>
                </select>
              </div>
              <div className='col-12'>
                <label className='form-label'>Tanggal Lahir</label>
                <input
                  type='date'
                  name='birth_date'
                  value={formData.birth_date}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>
              <div className='col-12'>
                <label className='form-label'>Alamat</label>
                <textarea
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  className='form-control'
                  rows='3'
                />
              </div>
              <div className='col-12'>
                <label className='form-label'>Kelas</label>
                <select
                  name='classId'
                  value={formData.classId}
                  onChange={handleChange}
                  className='form-select'
                  required
                >
                  <option value=''>-- Pilih Kelas --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
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

export default StudentInputs;
