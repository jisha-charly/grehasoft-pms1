import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import api from '../../api/axiosInstance';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await api.post('auth/reset-password/', { email });
      setMessage('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0" style={{ width: 420 }}>
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3 text-center">Reset Password</h4>

          {message && (
            <div className="alert alert-success py-2 small">{message}</div>
          )}

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-3 text-center">
            <button
              className="btn btn-link text-decoration-none small"
              onClick={() => navigate(PATHS.AUTH.LOGIN)}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
