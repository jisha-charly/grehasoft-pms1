import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api/auth.service';
import Spinner from '../../components/common/Spinner';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setSuccess('Profile updated successfully.');
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Spinner />;

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">My Profile</h4>

      <div className="row">
        {/* LEFT SIDE – PROFILE INFO */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">

              {success && (
                <div className="alert alert-success">{success}</div>
              )}

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      className="form-control"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      className="form-control"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – ACCOUNT INFO */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body text-center">
              <div className="rounded-circle bg-secondary-subtle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 100, height: 100, fontSize: 32 }}
              >
                {user.first_name?.charAt(0)}
              </div>

              <h6 className="fw-bold mb-1">
                {user.first_name} {user.last_name}
              </h6>
              <p className="text-muted small mb-2">{user.email}</p>

              <span className="badge bg-primary">
                {user.role}
              </span>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Account Info</h6>

              <p className="small mb-1">
                <strong>Department:</strong> {user.department}
              </p>

              <p className="small mb-1">
                <strong>Role:</strong> {user.role}
              </p>

              <p className="small mb-0">
                <strong>Status:</strong>{' '}
                {user.is_active ? (
                  <span className="text-success">Active</span>
                ) : (
                  <span className="text-danger">Inactive</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
