import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Home } from "./components/home/Home";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import VeterinarianListing from "./components/veterinarian/VeterinarianListing";
import BookAppointment from "./components/appointment/BookAppointment";
import Veterinarian from "./components/veterinarian/Veterinarian";
import UserRegistration from "./components/user/UserRegistration";
import Login from "./components/auth/Login";
import UserDashboard from "./components/user/UserDashboard";
import UserUpdate from "./components/user/UserUpdate";
import AdminDashboard from "./components/admin/AdminDashboard";
import EmailVerification from "./components/auth/EmailVerification";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PasswordResetRequest from "./components/auth/PasswordResetRequest";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/veterinarians" element={<VeterinarianListing />} />

        <Route
          path="/veterinarian-reviews/:veterinarianId/veterinarian"
          element={<Veterinarian />}
        />
        <Route path="/register" element={<UserRegistration />} />

        <Route path="/login" element={<Login />} />

        <Route path="/email-verification" element={<EmailVerification />} />

        <Route
          path="/password-reset-request"
          element={<PasswordResetRequest />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN", "ROLE_VET", "ROLE_PATIENT"]}
              useOutlet={true}
            />
          }
        >
          <Route
            path="/user-dashboard/:userId/my-dashboard"
            element={<UserDashboard />}
          />
          <Route
            path="/book-appointment/:recipientId/new-appointment"
            element={<BookAppointment />}
          />

          <Route path="/user-update/:userId/update" element={<UserUpdate />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} useOutlet={true} />
          }
        >
          <Route
            path="/admin-dashboard/:userId/admin-dashboard"
            element={<AdminDashboard />}
          />
        </Route>
      </Route>,
    ),
  );
  return (
    <main className="">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
