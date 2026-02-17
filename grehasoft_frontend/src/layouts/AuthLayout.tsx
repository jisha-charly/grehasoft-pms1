import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="auth-layout d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="auth-card card shadow-lg border-0 p-4" style={{ width: 400 }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold text-primary">Grehasoft PMS</h4>
          <small className="text-muted">
            {import.meta.env.VITE_APP_NAME}
          </small>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
