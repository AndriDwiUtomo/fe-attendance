import AttendanceStatisticOne from "./child/AttendanceStatisticOne";
import TotalSubscriberOne from "./child/TotalSubscriberOne";
import AttendanceDonutOne from "./child/AttendanceDonutsOne";
import LatestRegisteredOne from "./child/LatestRegisteredOne";
import TopPerformerOne from "./child/TopPerformerOne";
import TopCountries from "./child/TopCountries";
import GeneratedContent from "./child/GeneratedContent";
import UnitCountOne from "./child/UnitCountOne";
import TotalAttendanceWeekOne from "./child/TotalAttendanceWeekOne";

const DashBoardLayerOne = () => {
  return (
    <>
      {/* UnitCountOne */}
      <UnitCountOne />

      <section className='row gy-4 mt-1'>
        {/* SalesStatisticOne */}
        <AttendanceStatisticOne />

        {/* TotalSubscriberOne */}
        <TotalAttendanceWeekOne />

        {/* UsersOverviewOne */}
        <AttendanceDonutOne />

      </section>
    </>
  );
};

export default DashBoardLayerOne;
