import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UnitCountOne = () => {
  const [summary, setSummary] = useState({
    totalClasses: 0,
    newClasses: 0,
    totalStudents: 0,
    newStudents: 0,
    totalAttendancesToday: 0,
    totalAttendances30Days: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/dashboard/summary`, {
          headers: {
            Authorization: `${token}`,
          }
        });
        if (res.data?.code == 200) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error("Gagal memuat ringkasan dashboard:", err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className='row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4'>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-1 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>Total Kelas</p>
                <h6 className='mb-0'>{summary.totalClasses}</h6>
              </div>
              <div className='w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='lucide:school'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
            <p className='fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center gap-1 text-success-main'>
                <Icon icon='bxs:up-arrow' className='text-xs' /> +{summary.newClasses}
              </span>
              kelas baru (30 hari)
            </p>
          </div>
        </div>
        {/* card end */}
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-2 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Siswa
                </p>
                <h6 className='mb-0'>{summary.totalStudents}</h6>
              </div>
              <div className='w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='gridicons:multiple-users'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
            <p className='fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center gap-1 text-success-main'>
                <Icon icon='bxs:up-arrow' className='text-xs' /> +{summary.newStudents}
              </span>
              siswa baru (30 hari)
            </p>
          </div>
        </div>
        {/* card end */}
      </div>
      <div className='col'>
        <div className='card shadow-none border bg-gradient-start-3 h-100'>
          <div className='card-body p-20'>
            <div className='d-flex flex-wrap align-items-center justify-content-between gap-3'>
              <div>
                <p className='fw-medium text-primary-light mb-1'>
                  Total Kehadiran Hari Ini
                </p>
                <h6 className='mb-0'>{summary.totalAttendancesToday}</h6>
              </div>
              <div className='w-50-px h-50-px bg-info rounded-circle d-flex justify-content-center align-items-center'>
                <Icon
                  icon='fluent:people-20-filled'
                  className='text-white text-2xl mb-0'
                />
              </div>
            </div>
            <p className='fw-medium text-sm text-primary-light mt-12 mb-0 d-flex align-items-center gap-2'>
              <span className='d-inline-flex align-items-center gap-1 text-success-main'>
                <Icon icon='bxs:up-arrow' className='text-xs' /> {summary.totalAttendances30Days}
              </span>
              total kehadiran (30 hari)
            </p>
          </div>
        </div>
        {/* card end */}
      </div>
    </div>
  );
};

export default UnitCountOne;
