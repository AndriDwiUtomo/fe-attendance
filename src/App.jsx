import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import ClassListPage from "./pages/ClassListPage";
import AddClassPage from "./pages/AddClassPage";
import AddStudentPage from "./pages/AddStudentPage";
import AttendancePage from "./pages/AttendancePage";
import PrivateRoute from "./helper/PrivateRoute";
import PublicRoute from "./helper/PublicRoute";
import ErrorPage from "./pages/ErrorPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentListPage from "./pages/StudentListPage";

function App() {
  return (
    <BrowserRouter>
      <RouteScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path='/' element={
          <PrivateRoute>
            <HomePageOne />
          </PrivateRoute>
        } />

        <Route path='/class-list' element={
          <PrivateRoute>
            <ClassListPage />
          </PrivateRoute>
        } />

        <Route path='/class-add' element={
          <PrivateRoute>
            <AddClassPage />
          </PrivateRoute>
        } />

        <Route
          path="/class-edit/:id"
          element={
            <PrivateRoute>
              <AddClassPage />
            </PrivateRoute>
          }
        />

        <Route path='/student-list' element={
          <PrivateRoute>
            <StudentListPage />
          </PrivateRoute>
        } />

        <Route path='/student-add' element={
          <PrivateRoute>
            <AddStudentPage />
          </PrivateRoute>
        } />

        <Route
          path="/student-edit/:id"
          element={
            <PrivateRoute>
              <AddStudentPage />
            </PrivateRoute>
          }
        />

        <Route path='/attendance' element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
          } 
        />

        <Route exact path='/sign-in' element={
          <PublicRoute>
            <SignInPage />
          </PublicRoute>
        } />

        <Route exact path='/view-profile' element={<ViewProfilePage />} />

        <Route exact path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
