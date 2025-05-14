import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StudentListLayer = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/classes?limit=100`, 
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setClasses(res.data.data.data);
    } catch (err) {
      toast.error("Gagal mengambil data kelas");
    }
  };

  const fetchStudents = async (pageNumber = 1, searchQuery = "", classId = "") => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/students?page=${pageNumber}&limit=10&search=${searchQuery}&classId=${classId}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setStudents(res.data.data.data); // data siswa
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/sign-in");
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentPage = parseInt(params.get("page")) || 1;
    const searchQuery = params.get("search") || "";
    const selectedClassId = params.get("classId") || "";
    setPage(currentPage);
    setSearch(searchQuery);
    setClassFilter(selectedClassId);
    fetchStudents(currentPage, searchQuery, selectedClassId);
    fetchClasses();
  }, [location.search, classFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set("search", search);
    params.set("page", 1);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", newPage);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data siswa yang dihapus tidak bisa dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${BASE_URL}/students/${id}`,
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          toast.success("Siswa berhasil dihapus");
          fetchStudents(currentPage);
          setPage(currentPage);
        } catch (error) {
          toast.error("Gagal menghapus siswa");
          if (error.response?.status === 403 || error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            navigate("/sign-in");
          }
        }
      }
    };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/students/import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });
      toast.success("Import siswa berhasil");
      fetchStudents(currentPage); // refresh list
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Gagal import siswa");
      if (error.response?.status === 403 || error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        navigate("/sign-in");
      }
    }
  };

  const handleClassFilterChange = (e) => {
    const selectedClass = e.target.value;
    const params = new URLSearchParams(location.search);
    params.set("classId", selectedClass);
    params.set("page", 1); // reset ke halaman pertama
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className='card'>
      <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
        <div >
        <form className='d-flex flex-wrap align-items-center gap-3' onSubmit={handleSearch}>
          <div className='icon-field'>
            <input
              type='text'
              name='search'
              className='form-control form-control-sm w-auto'
              placeholder='Pencarian'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='icon'>
              <Icon icon='ion:search-outline' />
            </span>
          </div>
          <div className='d-flex align-items-center gap-2'>
            <select
              className='form-select form-select-sm w-auto'
              value={classFilter}
              onChange={handleClassFilterChange}
            >
              <option value=''>Semua Kelas</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>          
        </form>
        </div>
        <div className='d-flex flex-wrap align-items-center gap-3'>
          <input
            type='file'
            accept='.xlsx, .xls'
            onChange={handleImport}
            id='importFile'
            style={{ display: 'none' }}
          />
          <label htmlFor='importFile' className='btn btn-sm btn-secondary'>
            <i className='ri-upload-2-line' /> Import Excel
          </label>

          <Link to='/student-add' className='btn btn-sm btn-primary-600'>
            <i className='ri-add-line' /> Tambah Siswa
          </Link>
        </div>
      </div>
      <div className='card-body'>
        <table className='table bordered-table mb-0'>
          <thead>
            <tr>
              <th scope='col'>
                <div className='form-check style-check d-flex align-items-center'>
                  <label className='form-check-label' htmlFor='checkAll'>
                    #
                  </label>
                </div>
              </th>
              <th scope='col'>NIS</th>
              <th scope='col'>Nama</th>
              <th scope='col'>Gender</th>
              <th scope='col'>Tanggal Lahir</th>
              <th scope='col'>Kelas</th>
              <th scope='col'>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {students.map((student, index) => (
              <tr key={student.id}>
                <td>{(index + 1) + (currentPage - 1) * 10}</td>
                <td>{student.nis}</td>
                <td>{student.name}</td>
                <td>{student.gender === 'L' ? 'Laki-laki' : student.gender === 'P' ? 'Perempuan' : '-'}</td>
                <td>{new Date(student.birth_date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}</td>
                <td>{student.class?.name || '-'}</td>
                <td>
                  <Link
                    to={`/student-edit/${student.id}`}
                    className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                  >
                    <Icon icon='lucide:edit' />
                  </Link>
                  <Link
                  to="#"
                    onClick={() => handleDelete(student.id)}
                    className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center'
                  >
                    <Icon icon='mingcute:delete-2-line' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mt-24'>
          <span>Hal {page} dari {totalPages}</span>
          <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
            {/* Previous */}
            <li className='page-item'>
              <button
                disabled={page <= 1}
                className='page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base'
                onClick={() => handlePageChange(page - 1)}
              >
                <Icon icon='ep:d-arrow-left' className='text-xl' />
              </button>
            </li>

            {/* Numbered pages */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <li key={pageNum} className='page-item'>
                  <button
                    onClick={() => handlePageChange(pageNum)}
                    className={`page-link ${
                      isActive ? "bg-primary-600 text-white" : "bg-primary-50 text-secondary-light"
                    } fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px`}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            })}
            {/* Next */}
            <li className='page-item'>
              <button
                disabled={page >= totalPages}
                className='page-link text-secondary-light fw-medium radius-4 border-0 px-10 py-10 d-flex align-items-center justify-content-center h-32-px me-8 w-32-px bg-base'
                onClick={() => handlePageChange(page + 1)}
              >
                <Icon icon='ep:d-arrow-right' className='text-xl' />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentListLayer;
