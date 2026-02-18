import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/forms/InputField';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state or default to root
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
     await login({ email, password });

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Grehasoft</h2>
            <p className="text-muted small">PMS & CRM Portal</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small border-0 mb-4" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              placeholder="name@grehasoft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label small" htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to={PATHS.AUTH.RESET_PASSWORD} className="small text-decoration-none">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" variant="primary" className="w-100 py-2 fw-bold" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-muted x-small mb-0">Internal Enterprise System</p>
            <p className="text-muted x-small">&copy; {new Date().getFullYear()} Grehasoft Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;