import React, { useState, useEffect } from 'react';
import { crmService } from '../../../api/crm.service';
import { Client } from '../../../types/crm';
import { DataTable } from '../../../components/common/DataTable';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmService.getClients().then(res => {
      setClients(res.data.results);
      setLoading(false);
    });
  }, []);

  const columns = [
    { header: 'Client Name', key: 'company_name', render: (c: Client) => <span className="fw-bold">{c.company_name}</span> },
    { header: 'Point of Contact', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Department', key: 'department_name' },
    { 
      header: 'Actions', 
      render: (c: Client) => (
        <button className="btn btn-sm btn-light">View Projects</button>
      ) 
    },
  ];

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Active Clients</h3>
      <DataTable columns={columns} data={clients} loading={loading} />
    </div>
  );
};

export default ClientList;