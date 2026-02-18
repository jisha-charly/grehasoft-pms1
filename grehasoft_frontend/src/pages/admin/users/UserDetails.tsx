import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '../../../api/auth.service';
import { reportService } from '../../../api/report.service';
import type{ User } from '../../../types/auth';
import type { ActivityLog } from '../../../types/activity';
import { dateHelper } from '../../../utils/dateHelper';
import { ActivityTimeline } from '../../../components/activity/ActivityTimeline';
import { Button } from '../../../components/common/Button';
import{ Spinner } from '../../../components/common/Spinner';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  //const navigate = useNavigate();
  
  const [userData, setUserData] = useState<User | null>(null);
  const [userLogs, setUserLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      // In a full implementation, authService would have a getUserById method
      // For now, we simulate the fetch
      const response = await authService.getCurrentUser(); 
      setUserData(response);

      // Fetch audit logs specific to this user
      const logsRes = await reportService.getActivityLogs({ user: id });
      setUserLogs(logsRes.data.results);
    } catch (err) {
      console.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  const handleStatusChange = async (newStatus: 'active' | 'suspended') => {
    if (!userData) return;
    setUpdating(true);
    try {
      // API call to backend UserService.update_user_status
      await authService.updateProfile({ status: newStatus } as any); 
      setUserData({ ...userData, status: newStatus });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Spinner center size="lg" />;
  if (!userData) return <div className="text-center py-5">User not found.</div>;

  return (
    <div className="container-fluid animate-fade-in">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/admin/users">Staff Directory</Link></li>
          <li className="breadcrumb-item active">{userData.full_name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Account Profile */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                {userData.first_name[0]}{userData.last_name[0]}
              </div>
              <h4 className="fw-bold mb-1">{userData.full_name}</h4>
              <p className="text-muted small">{userData.email}</p>
              
              <div className="d-flex justify-content-center gap-2 mt-3">
                <span className={`badge ${userData.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                  {userData.status.toUpperCase()}
                </span>
                <span className="badge bg-light text-dark border">
                  {userData.role_name}
                </span>
              </div>
            </div>
            <div className="card-footer bg-white border-top-0 p-4">
              <h6 className="xsmall text-muted text-uppercase fw-bold mb-3">Account Controls</h6>
              <div className="d-grid gap-2">
                {userData.status === 'active' ? (
                  <Button 
                    variant="danger" 
                    loading={updating} 
                    onClick={() => handleStatusChange('suspended')}
                  >
                    <i className="bi bi-slash-circle me-2"></i>Suspend Account
                  </Button>
                ) : (
                  <Button 
                    variant="success" 
                    loading={updating} 
                    onClick={() => handleStatusChange('active')}
                  >
                    <i className="bi bi-check-circle me-2"></i>Reactivate Account
                  </Button>
                )}
                <Button variant="outline-primary">
                  <i className="bi bi-key me-2"></i>Force Password Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="xsmall text-muted text-uppercase fw-bold mb-3">Organization Details</h6>
              <div className="mb-3">
                <label className="xsmall text-muted d-block">Department</label>
                <span className="fw-bold text-primary">{userData.department?.name || 'Not Assigned'}</span>
              </div>
              <div className="mb-3">
                <label className="xsmall text-muted d-block">Employee Since</label>
                <span className="fw-bold">{dateHelper.formatDisplay(userData.date_joined)}</span>
              </div>
              <div>
                <label className="xsmall text-muted d-block">System Access</label>
                <span className="fw-bold">{userData.is_staff ? 'Standard Staff' : 'External/Restricted'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Management & Audit */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-0">
              <h5 className="fw-bold mb-0">Role & Permission Override</h5>
            </div>
            <div className="card-body p-4">
              <form className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Primary System Role</label>
                  <select className="form-select" defaultValue={userData.role}>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="TEAM_MEMBER">Team Member</option>
                    <option value="SALES_EXECUTIVE">Sales Executive</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Department Assignment</label>
                  <select className="form-select" defaultValue={userData.department?.id}>
                    <option value="1">Software Development</option>
                    <option value="2">Digital Marketing</option>
                  </select>
                </div>
                <div className="col-12 text-end mt-4">
                  <Button variant="primary">Update Permissions</Button>
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0">User Activity History</h5>
              <button className="btn btn-sm btn-outline-secondary">View Full Audit</button>
            </div>
            <div className="card-body p-4">
              {userLogs.length > 0 ? (
                <ActivityTimeline logs={userLogs} />
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-clock-history fs-2 mb-2 d-block"></i>
                  No recent activity logged for this user.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;