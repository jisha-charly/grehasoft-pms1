import React from 'react';
import type { LeadFollowUp } from '../../types/crm';
import { dateHelper } from '../../utils/dateHelper';

interface Props {
  followUps: LeadFollowUp[];
}

export const LeadFollowUpList: React.FC<Props> = ({ followUps }) => {
  return (
    <div className="lead-followup-timeline position-relative ps-4 border-start">
      {followUps.length > 0 ? (
        followUps.map((item) => (
          <div key={item.id} className="mb-4 position-relative">
            {/* Timeline Dot */}
            <div 
              className="position-absolute bg-white border border-primary rounded-circle shadow-sm" 
              style={{ width: '12px', height: '12px', left: '-31px', top: '4px' }} 
            />
            
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge bg-primary-subtle text-primary text-uppercase xsmall fw-bold">
                    {item.method}
                  </span>
                  <small className="text-muted">{dateHelper.formatDisplay(item.created_at)}</small>
                </div>
                <p className="small mb-2 text-dark">{item.notes}</p>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span className="xsmall text-muted">By: <strong>{item.created_by_name}</strong></span>
                  {item.next_followup_date && (
                    <span className="xsmall text-warning fw-bold">
                      <i className="bi bi-calendar-event me-1"></i>
                      Next: {dateHelper.formatDisplay(item.next_followup_date)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted small">No follow-ups recorded yet.</div>
      )}
    </div>
  );
};