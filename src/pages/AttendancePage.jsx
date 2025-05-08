import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AttendanceLayer from "../components/AttendanceLayer";

const AttendancePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Daftar Kehadiran' />

        {/* ImageGeneratorLayer */}
        <AttendanceLayer />
      </MasterLayout>
    </>
  );
};

export default AttendancePage;
