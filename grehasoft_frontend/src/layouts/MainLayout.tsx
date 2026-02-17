import { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const { user } = useAuth();

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-grow-1 min-vh-100 bg-light">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <div className="container-fluid py-4">
          {children}
        </div>

        {/* Footer */}
        <footer className="text-center py-3 border-top small text-muted">
          © {new Date().getFullYear()} Grehasoft PMS • {user?.department}
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
