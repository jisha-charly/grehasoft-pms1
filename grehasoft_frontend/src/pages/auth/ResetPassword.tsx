import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/forms/InputField';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Logic: Call authService.requestPasswordReset(email)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="mb-4">
            <h4 className="fw-bold">Reset Password</h4>
            <p className="text-muted small">Enter your work email to receive instructions.</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleReset}>
              <InputField
                label="Work Email"
                type="email"
                placeholder="name@grehasoft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-100 mb-3" loading={loading}>
                Send Instructions
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-success-subtle text-success p-3 rounded mb-4">
                <i className="bi bi-check-circle-fill fs-3 mb-2 d-block"></i>
                Check your email for a reset link.
              </div>
            </div>
          )}

          <div className="text-center">
            <Link to={PATHS.AUTH.LOGIN} className="small text-decoration-none">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;