import { Icon } from "@iconify/react/dist/iconify.js";
import useReactApexChart from "../../hook/useReactApexChart";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TotalAttendanceWeekOne = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    data: []
  });

  const [summary, setSummary] = useState({
    total: 0,
    percentChange: 0,
    perDay: 0
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${BASE_URL}/dashboard/attendance-weekly-bar`,{
        headers: {
          Authorization: `${token}`,
        }
      });
      if (res.data?.code === 200) {
        const { chartData, summary } = res.data.data;
        setChartData(chartData);
        setSummary(summary);
      }
    } catch (err) {
      console.error("Gagal memuat data bar chart kehadiran mingguan:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "40%"
      }
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        rotate: -45
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#0d6efd"]
  };

  const barChartSeries = [
    {
      name: "Kehadiran",
      data: chartData.data
    }
  ];

  const isNegative = summary.percentChange < 0;
  const arrowIcon = isNegative ? "iconamoon:arrow-down-2-fill" : "bxs:up-arrow";
  const badgeClass = isNegative
    ? "bg-danger-focus border br-danger text-danger-main"
    : "bg-success-focus border br-success text-success-main";

  return (
    <div className='col-xxl-6 col-xl-6'>
      <div className='card h-100 radius-8 border'>
        <div className='card-body p-24'>
          <h6 className='mb-12 fw-semibold text-lg mb-16'>Total Kehadiran</h6>
          <div className='d-flex align-items-center gap-2 mb-20'>
            <h6 className='fw-semibold mb-0'>{summary.total.toLocaleString()}</h6>
            <p className='text-sm mb-0'>
              
              Per Minggu
            </p>
          </div>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type='bar'
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalAttendanceWeekOne;
