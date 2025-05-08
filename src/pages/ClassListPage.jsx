import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ClassListLayer from "../components/ClassListLayer";

const ClassListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Kelas - List' />

        {/* ClassListLayer */}
        <ClassListLayer />
      </MasterLayout>
    </>
  );
};

export default ClassListPage;
