import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StudentListLayer from "../components/StudentListLayer";

const StudentListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Siswa - List' />

        {/* ClassListLayer */}
        <StudentListLayer />
      </MasterLayout>
    </>
  );
};

export default StudentListPage;
