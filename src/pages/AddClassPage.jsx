import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddClassPageLayer from "../components/AddClassPageLayer";

const AddClassPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Tambah Kelas' />

        {/* FormPageLayer */}
        <AddClassPageLayer />
      </MasterLayout>
    </>
  );
};

export default AddClassPage;
