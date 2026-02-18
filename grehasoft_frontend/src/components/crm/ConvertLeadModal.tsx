import React, { useState} from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SelectField } from '../forms/SelectField';
import { crmService } from '../../api/crm.service';

interface Props {
  show: boolean;
  leadId: number;
  leadName: string;
  onClose: () => void;
  onSuccess: (project: any) => void;
}

export const ConvertLeadModal: React.FC<Props> = ({ show, leadId, leadName, onClose, onSuccess }) => {
  const [pmId, setPmId] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const res = await crmService.convertLead(leadId, pmId);
      onSuccess(res.data.project);
    } catch (err) {
      alert("Conversion failed. Ensure a Project Manager is selected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} title={`Convert Lead: ${leadName}`} onClose={onClose} 
      footer={
        <>
          <Button variant="light" onClick={onClose}>Cancel</Button>
          <Button variant="success" onClick={handleConvert} loading={loading} disabled={!pmId}>
            Start Project
          </Button>
        </>
      }>
      <p className="text-muted small mb-4">
        This will create a new Client record and initialize a Project Workspace.
      </p>
      <SelectField 
        label="Assign Project Manager"
        options={[{ value: 1, label: 'Default PM' }]} // Logic: Fetch users with PM role
        onChange={(e) => setPmId(Number(e.target.value))}
        required
      />
    </Modal>
  );
};