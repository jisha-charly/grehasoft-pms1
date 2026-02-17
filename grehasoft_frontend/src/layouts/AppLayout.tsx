import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import MainLayout from "./MainLayout";
import AuthLayout from "./AuthLayout";

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthLayout>{children}</AuthLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default AppLayout;
