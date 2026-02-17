import React, { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { Lead } from "../../types/crm";
import { crmService } from "../../api/crmService";

interface Props {
  show: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ConvertLeadModal: React.FC<Props> = ({
  show,
  lead,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [pmId, setPmId] = useState("");

  const handleConvert = async () => {
    if (!lead || !pmId) return;

    try {
      setLoading(true);
      await crmService.convertLead(lead.id, Number(pmId));
      onSuccess();
      onClose();
    } catch {
      alert("Conversion failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  return (
    <Modal
      show={show}
      title="Convert Lead to Project"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} variant="success" onClick={handleConvert}>
            Confirm
          </Button>
        </>
      }
    >
      <p>
        Convert <strong>{lead.name}</strong> into a project?
      </p>

      <div className="mb-3">
        <label className="form-label">Project Manager ID</label>
        <input
          type="number"
          className="form-control"
          value={pmId}
          onChange={(e) => setPmId(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default ConvertLeadModal;
