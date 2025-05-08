import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AttendanceLayer = () => {
  const [classOptions, setClassOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [shalat, setShalat] = useState("dhuhur");
  const [kelasId, setKelasId] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Ambil data kelas dari server
  const fetchClasses = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/classes?limit=100`, {
      headers: {
        Authorization: `${token}`,
      }
    });
    setClassOptions(res.data.data.data);
  };

  const fetchAttendance = async () => {
    try {
      if (!shalat || !kelasId || !selectedDate) return;
      const token = localStorage.getItem("token");
  
      const formattedDate = selectedDate.toISOString().split("T")[0];
  
      const response = await axios.get(
        `${BASE_URL}/attendances`, {
          params: {
            date: formattedDate,
            prayerName: shalat,
            classId: kelasId,
            page: currentPage,
          },
          headers: {
            Authorization: `${token}`,
          }
        }
      );
      setStudents(response.data.data.data);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [shalat, kelasId, currentPage, selectedDate]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleAttendance = async (studentId) => {
    try {
      const token = localStorage.getItem("token");

      const formattedDate = selectedDate.toISOString().split("T")[0];
  
      await axios.post(`${BASE_URL}/attendances`, {
        studentId,
        prayerName: shalat,
        date: formattedDate
      },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json", // jika pakai FormData
        },
      }
    );
  
      // Refresh attendance list after change
      fetchAttendance();
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Gagal mengubah status kehadiran.");
    }
  };

  return (
    <div className='row gy-4'>
      <div className='col-xxl-3 col-lg-4'>
        <div className='card h-100 p-0'>
          <div className='card-body p-24'>
            <div className='mb-20'>
              <label className='text-sm fw-semibold text-primary-light mb-8'>
                Tanggal
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setCurrentPage(1); // reset pagination
                }}
                dateFormat="yyyy-MM-dd"
                className="form-control px-16 py-14 h-48-px"
              />
            </div>
            <div className='mb-20'>
              <label
                htmlFor='style'
                className='text-sm fw-semibold text-primary-light mb-8'
              >
                Shalat
              </label>
              <select
                className='form-select form-control px-16 py-14 h-48-px'
                value={shalat}
                onChange={(e) => {
                  setShalat(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value='Select a shalat' disabled>
                  Pilih Shalat
                </option>
                <option value='dhuhur'>Dhuhur</option>
                <option value='ashar'>Ashar</option>
              </select>
            </div>
            <div className='mb-20'>
              <label
                htmlFor='LightingStyle'
                className='text-sm fw-semibold text-primary-light mb-8'
              >
                Kelas
              </label>
              <select
                className='form-control radius-8 form-select'
                value={kelasId}
                onChange={(e) => {
                  setKelasId(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value='' disabled>Pilih Kelas</option>
                {classOptions.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='mb-20'>
              <label
                htmlFor='resulation'
                className='text-sm fw-semibold text-primary-light mb-8'
              >
                Pencarian
              </label>
              <input
                type='text'
                className='form-control px-16 py-14 h-48-px'
                id='search'
                placeholder='Pencarian (NIS/Nama)'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
          </div>
        </div>
      </div>
      <div className='col-xxl-9 col-lg-8'>
        <div className='chat-main card overflow-hidden'>
          <div className='chat-sidebar-single gap-8 justify-content-between cursor-default flex-nowrap'>
            <div className='d-flex align-items-center gap-16'>
              <Link
                to='#'
                className='text-primary-light text-2xl line-height-1'
              >
                <i className='ri-arrow-left-line' />
              </Link>
              <h6 className='text-lg mb-0 text-line-1'>
                Daftar Siswa
              </h6>
            </div>
          </div>
          {/* chat-sidebar-single end */}
          <div className='chat-message-list max-h-612-px min-h-612-px'>
            <div className='table-responsive scroll-sm'>
              <table className='table bordered-table sm-table mb-0'>
                <thead>
                  <tr>
                    <th scope='col'>
                      <div className='d-flex align-items-center gap-10'>
                        #
                      </div>
                    </th>
                    <th scope='col'>NIS</th>
                    <th scope='col'>Nama</th>
                    <th scope='col'>Kelas</th>
                    <th scope='col'>Status</th>
                  </tr>
                </thead>
                <tbody>
                {students
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(search.toLowerCase()) ||
                        s.nis.includes(search)
                    )
                    .map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td>{student.nis}</td>
                        <td>{student.name}</td>
                        <td>{student.class.name}</td>
                        <td className='text-center'>
                          <span
                            onClick={() => toggleAttendance(student.id)}
                            className={`px-24 py-4 radius-4 fw-medium text-sm ${
                              student.hadir
                                ? "bg-success-focus text-success-600 border border-success-main"
                                : "bg-danger-focus text-danger-600 border border-danger-main"
                            }`}
                          >
                            {student.hadir ? "Hadir" : "Tidak Hadir"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24'>
              <span>Halaman {currentPage} dari {totalPages}</span>
              <ul className='pagination d-flex flex-wrap align-items-center gap-2 justify-content-center'>
                <li className='page-item'>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md'
                    disabled={currentPage === 1}
                  >
                    <Icon icon='ep:d-arrow-left' />
                  </button>
                </li>
                {[...Array(totalPages)].map((_, idx) => (
                  <li key={idx} className='page-item'>
                    <button
                      onClick={() => handlePageChange(idx + 1)}
                      className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${
                        currentPage === idx + 1
                          ? "bg-primary-600 text-white"
                          : "bg-neutral-200 text-secondary-light"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
                <li className='page-item'>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className='page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md'
                    disabled={currentPage === totalPages}
                  >
                    <Icon icon='ep:d-arrow-right' />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLayer;
