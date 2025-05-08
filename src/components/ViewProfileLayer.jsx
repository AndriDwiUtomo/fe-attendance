import { Icon } from "@iconify/react";
import { useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from "axios";

const ViewProfileLayer = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return setMessage("Password dan Konfirmasi wajib diisi.");
    }

    if (newPassword !== confirmPassword) {
      return setMessage("Password dan konfirmasi tidak cocok.");
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/change-password`, {
        method: "PUT", // disesuaikan ke PUT
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, confirmPassword }), // sesuai backend
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password berhasil diubah.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Terjadi kesalahan.");
      }
    } catch (error) {
      setMessage("Gagal mengirim permintaan.");
    }
  };

  return (
    <div className='row gy-4'>
      <div className='col-lg-8'>
        <div className='card h-100'>
          <div className='card-body p-24'>
            <form onSubmit={handleSubmit}>
              <div className='mb-20'>
                <label
                  htmlFor='new-password'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  New Password <span className='text-danger-600'>*</span>
                </label>
                <div className='position-relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className='form-control radius-8'
                    id='new-password'
                    placeholder='Enter New Password*'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className='cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light'
                    onClick={togglePasswordVisibility}
                  >
                    <Icon icon={passwordVisible ? "ri:eye-off-line" : "ri:eye-line"} />
                  </span>
                </div>
              </div>

              <div className='mb-20'>
                <label
                  htmlFor='confirm-password'
                  className='form-label fw-semibold text-primary-light text-sm mb-8'
                >
                  Confirm Password <span className='text-danger-600'>*</span>
                </label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className='form-control radius-8'
                  id='confirm-password'
                  placeholder='Confirm New Password*'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {message && (
                <div className='alert alert-info text-sm'>{message}</div>
              )}

              <button type='submit' className='btn btn-primary'>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfileLayer;
