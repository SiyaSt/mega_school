import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { About } from "./pages/About";
import { Landing } from "./pages/Landing";
import { Trial } from "./pages/Trial";
import { LessonSetup } from "./pages/LessonSetup";
import { LessonPlay } from "./pages/LessonPlay";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { DashboardStudent } from "./pages/DashboardStudent";
import { DashboardParent } from "./pages/DashboardParent";
import { Store } from "./pages/Store";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showHeader showFooter>
            <Landing />
          </Layout>
        }
      />
      <Route
        path="/rating"
        element={
          <Layout showHeader showFooter>
            <About />
          </Layout>
        }
      />
      <Route
        path="/trial"
        element={
          <Layout showHeader showFooter>
            <Trial />
          </Layout>
        }
      />
      <Route
        path="/lesson/setup"
        element={
          <Layout showHeader showFooter>
            <LessonSetup />
          </Layout>
        }
      />
      <Route
        path="/lesson/play"
        element={
          <Layout showHeader showFooter flag={true}>
            <LessonPlay />
          </Layout>
        }
      />

      <Route
        path="/auth/login"
        element={
          <Layout showHeader showFooter>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/auth/register"
        element={
          <Layout showHeader showFooter>
            <Register />
          </Layout>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout showHeader showFooter>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute>
            <Layout showHeader showFooter>
              <DashboardStudent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/parent"
        element={
          <ProtectedRoute>
            <Layout showHeader showFooter>
              <DashboardParent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/store"
        element={
          <ProtectedRoute>
            <Layout showHeader showFooter>
              <Store />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
