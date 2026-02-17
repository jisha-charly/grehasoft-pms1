import React from "react";
import { Lead } from "../../types/crm";
import LeadStatusBadge from "./LeadStatusBadge";
import Button from "../common/Button";

interface Props {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
}

const LeadTable: React.FC<Props> = ({ leads, onView, onConvert }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.company_name}</td>
              <td>{lead.email}</td>
              <td>
                <LeadStatusBadge status={lead.status} />
              </td>
              <td className="text-end">
                <Button
                  variant="outline-primary"
                  className="me-2"
                  onClick={() => onView(lead)}
                >
                  View
                </Button>

                {lead.status === "qualified" && (
                  <Button
                    variant="success"
                    onClick={() => onConvert(lead)}
                  >
                    Convert
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
