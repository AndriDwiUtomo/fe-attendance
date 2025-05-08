import { Icon } from "@iconify/react/dist/iconify.js";
import ReactApexChart from "react-apexcharts";
import useReactApexChart from "../../hook/useReactApexChart";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SalesStatisticOne = () => {
  const [range, setRange] = useState("Today");
  const [chartData, setChartData] = useState({
    categories: [],
    series: []
  });
  const [summary, setSummary] = useState({
    total: 0,
    percentChange: 0,
    perDay: 0
  });

  const fetchChartData = async (selectedRange) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/dashboard/attendance-statistics?range=${selectedRange}`,
        {
          headers: {
            Authorization: `${token}`,
          }
        }
      );
      if (res.data?.code === 200) {
        const chartPoints = res.data.data.chartData;
        const summaryData = res.data.data.summary;

        const categories = chartPoints.map((item) => item.period);
        const data = chartPoints.map((item) => parseInt(item.total, 10));

        setChartData({
          categories,
          series: [
            {
              name: "Kehadiran",
              data
            }
          ]
        });

        setSummary(summaryData);
      }
    } catch (err) {
      console.error("Gagal memuat statistik kehadiran:", err);
    }
  };

  useEffect(() => {
    fetchChartData(range);
  }, [range]);

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth" },
    xaxis: {
      categories: chartData.categories
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} kehadiran`
      }
    }
  };

  return (
    <div className='col-xxl-12 col-xl-12'>
      <div className='card h-100'>
        <div className='card-body'>
          <div className='d-flex flex-wrap align-items-center justify-content-between'>
            <h6 className='text-lg mb-0'>Statistik Kehadiran</h6>
            <select
              className='form-select bg-base form-select-sm w-auto'
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value='Yearly'>Yearly</option>
              <option value='Monthly'>Monthly</option>
              <option value='Weekly'>Weekly</option>
              <option value='Today'>Today</option>
            </select>
          </div>
          <div className="d-flex flex-wrap align-items-center gap-2 mt-8">
            <h6 className="mb-0">{summary.total} Kehadiran</h6>
            <span className={`text-sm fw-semibold rounded-pill ${
                summary.percentChange >= 0
                  ? "bg-success-focus text-success-main br-success"
                  : "bg-danger-focus text-danger-main br-danger"
              } border px-8 py-4 line-height-1 d-flex align-items-center gap-1`}
            >
              {summary.percentChange >= 0 ? (
                <Icon icon="bxs:up-arrow" className="text-xs" />
              ) : (
                <Icon icon="bxs:down-arrow" className="text-xs" />
              )}
              {summary.percentChange}%
            </span>
            <span className="text-xs fw-medium">+ {summary.perDay} Per Hari</span>
          </div>

          <ReactApexChart
            options={chartOptions}
            series={chartData.series}
            type="area"
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesStatisticOne;
