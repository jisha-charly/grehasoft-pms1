import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api/auth.service';
import { Button } from '../../components/common/Button';
import { InputField } from '../../components/forms/InputField';
import { dateHelper } from '../../utils/dateHelper';

const UserProfile: React.FC = () => {
  const { user, updateProfileState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    try {
      const updatedUser = await authService.updateProfile(formData);
      updateProfileState(updatedUser); // Update context
      setSuccess('Profile updated successfully.');
    } catch (err) {
      console.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container-fluid animate-fade-in">
      <div className="mb-4">
        <h3 className="fw-bold">My Account</h3>
        <p className="text-muted">Manage your personal information and security settings.</p>
      </div>

      <div className="row g-4">
        {/* Profile Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="fw-bold mb-0">Personal Information</h5>
            </div>
            <div className="card-body p-4">
              {success && (
                <div className="alert alert-success border-0 small mb-4">
                  <i className="bi bi-check-circle me-2"></i>{success}
                </div>
              )}
              <form onSubmit={handleUpdateProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <InputField
                      label="First Name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <InputField
                      label="Last Name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-12">
                    <InputField
                      label="Email Address"
                      value={user.email}
                      disabled
                      helperText="Contact Admin to change your work email."
                    />
                  </div>
                </div>
                <div className="text-end mt-4">
                  <Button type="submit" variant="primary" loading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="fw-bold mb-0 text-danger">Security</h5>
            </div>
            <div className="card-body p-4">
              <p className="small text-muted">Update your password to keep your account secure.</p>
              <button className="btn btn-outline-danger btn-sm fw-bold">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Org Info */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm bg-primary text-white mb-4">
            <div className="card-body p-4 text-center">
              <div className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 fw-bold" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <h5 className="fw-bold mb-0">{user.full_name}</h5>
              <p className="small opacity-75">{user.role_name}</p>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="xsmall text-muted text-uppercase fw-bold mb-3 border-bottom pb-2">Organizational Details</h6>
              <div className="mb-3">
                <label className="xsmall text-muted d-block">Department</label>
                <span className="fw-bold">{user.department?.name || 'Unassigned'}</span>
              </div>
              <div className="mb-3">
                <label className="xsmall text-muted d-block">Employee ID</label>
                <span className="fw-bold">#GS-{user.id.toString().padStart(4, '0')}</span>
              </div>
              <div>
                <label className="xsmall text-muted d-block">Member Since</label>
                <span className="fw-bold">{dateHelper.formatDisplay(user.date_joined)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;