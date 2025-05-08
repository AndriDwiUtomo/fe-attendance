import ReactApexChart from "react-apexcharts";
import useReactApexChart from "../../hook/useReactApexChart";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AttendanceDonutOne = () => {
  const [donutChartSeries, setDonutChartSeries] = useState([0, 0]); // Default to [0, 0]
  const [donutChartOptions, setDonutChartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Hadir", "Tidak Hadir"],
    colors: ["#28a745", "#dc3545"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
  });
  const [selectedRange, setSelectedRange] = useState("Today");
  const token = localStorage.getItem("token");

  const fetchAttendanceData = async (range) => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/attendance-donut`, {
        params: { range }, // Sending the selected range as a query parameter
        headers: {
          Authorization: `${token}`,
        }
      });

      const { series } = response.data.data; // Assuming your API returns an object with a 'series' property

      if (Array.isArray(series) && series.length === 2) {
        setDonutChartSeries(series); // Set data only if valid
      } else {
        setDonutChartSeries([0, 0]); // Fallback if data is invalid
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setDonutChartSeries([0, 0]); // Set fallback in case of error
    }
  };

  useEffect(() => {
    fetchAttendanceData(selectedRange);
  }, [selectedRange]); // Re-fetch data when selected range changes

  const handleRangeChange = (e) => {
    setSelectedRange(e.target.value);
  };

  return (
    <div className="col-xxl-6 col-xl-6">
      <div className="card h-100 radius-8 border-0 overflow-hidden">
        <div className="card-body p-24">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg">Users Overview</h6>
            <div className="">
              <select
                className="form-select form-select-sm w-auto bg-base border text-secondary-light"
                value={selectedRange}
                onChange={handleRangeChange}
              >
                <option value="Today">Today</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Conditionally render the chart */}
          {donutChartSeries && donutChartSeries.length > 0 ? (
            <ReactApexChart
              options={donutChartOptions}
              series={donutChartSeries}
              type="donut"
              height={264}
            />
          ) : (
            <div>Loading...</div> // Loading state or fallback content
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDonutOne;
