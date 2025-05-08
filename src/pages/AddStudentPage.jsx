import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddStudentPageLayer from "../components/AddStudentPageLayer";

const AddClassPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Tambah Siswa' />

        {/* FormPageLayer */}
        <AddStudentPageLayer />
      </MasterLayout>
    </>
  );
};

export default AddClassPage;
