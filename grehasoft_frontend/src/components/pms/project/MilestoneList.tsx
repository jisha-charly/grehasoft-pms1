import React from 'react';
import type { Milestone } from '../../../types/pms';
import { dateHelper } from '../../../utils/dateHelper';

export const MilestoneList: React.FC<{ milestones: Milestone[] }> = ({ milestones }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-header bg-white py-3 border-0">
      <h6 className="fw-bold mb-0">Project Milestones</h6>
    </div>
    <div className="list-group list-group-flush">
      {milestones.length > 0 ? (
        milestones.map((m) => (
          <div key={m.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center gap-3">
              <i className={`bi ${m.is_completed ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'} fs-5`}></i>
              <div>
                <div className={`small fw-bold ${m.is_completed ? 'text-decoration-line-through text-muted' : ''}`}>
                  {m.title}
                </div>
                <div className="xsmall text-muted">Target: {dateHelper.formatDisplay(m.due_date)}</div>
              </div>
            </div>
            {!m.is_completed && dateHelper.isOverdue(m.due_date) && (
              <span className="badge bg-danger xsmall">OVERDUE</span>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted small">No milestones defined.</div>
      )}
    </div>
  </div>
);