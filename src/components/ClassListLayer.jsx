import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ClassListLayer = () => {
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const fetchClasses = async (pageNumber = 1, searchQuery = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${BASE_URL}/classes?page=${pageNumber}&limit=10&search=${searchQuery}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setClasses(res.data.data.data); // asumsi ini adalah array of kelas
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
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
    setPage(currentPage);
    setSearch(searchQuery);
    fetchClasses(currentPage, searchQuery);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    params.set("search", search);
    params.set("page", 1); // reset ke halaman 1 saat cari
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
      text: 'Data kelas yang dihapus tidak bisa dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
  
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.delete(`${BASE_URL}/classes/${id}`, 
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        toast.success("Kelas berhasil dihapus");
        fetchClasses(currentPage); // refresh data
        setPage(currentPage); // trigger render ulang manual
      } catch (error) {
        toast.error("Gagal menghapus kelas");
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("isLoggedIn");
          navigate("/sign-in");
        }
      }
    }
  };
  

  return (
    <div className='card'>
      <div className='card-header d-flex flex-wrap align-items-center justify-content-between gap-3'>
        <div className='d-flex flex-wrap align-items-center gap-3'>
        <form onSubmit={handleSearch}>
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
        </form>
        </div>
        <div className='d-flex flex-wrap align-items-center gap-3'>
          <Link to='/class-add' className='btn btn-sm btn-primary-600'>
            <i className='ri-add-line' /> Tambah Kelas
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
                    ID
                  </label>
                </div>
              </th>
              <th scope='col'>Nama Kelas</th>
              <th scope='col'>Aksi</th>
            </tr>
          </thead>
          <tbody>
          {classes.map((kelas) => (
            <tr key={kelas.id}>
              <td>
                <div className='form-check style-check d-flex align-items-center'>
                  <label className='form-check-label' htmlFor='check1'>
                    {kelas.id}
                  </label>
                </div>
              </td>
              <td>
                <div className='d-flex align-items-center'>
                  <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                    {kelas.name}
                  </h6>
                </div>
              </td>
              <td>
                <Link
                  to={`/class-edit/${kelas.id}`}
                  className='w-32-px h-32-px  me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                >
                  <Icon icon='lucide:edit' />
                </Link>
                <Link to="#"
                  onClick={() => handleDelete(kelas.id)}
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

export default ClassListLayer;
