// import Login from "./pages/Login.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
// import Sidebar from "./components/Sidebar.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import FindLearners from "./pages/FindLearners.jsx";
import CallPage from "./pages/CallPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* // public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* // protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-learners"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FindLearners />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/call"
          element={
            <ProtectedRoute>
              <CallPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
