import React, { useState, useEffect } from 'react';
import { crmService } from '../../../api/crm.service';
import type { Client } from '../../../types/crm';
import { DataTable } from '../../../components/common/DataTable';
import type { Column } from '../../../components/common/DataTable';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await crmService.getClients();
        setClients(res.data.results);
      } catch (error) {
        console.error('Failed to fetch clients', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const columns: Column<Client>[] = [
    {
      header: 'Client Name',
      key: 'company_name',
      render: (c) => (
        <span className="fw-bold">{c.company_name}</span>
      ),
    },
    {
      header: 'Point of Contact',
      key: 'name',
    },
    {
      header: 'Email',
      key: 'email',
    },
    {
      header: 'Department',
      key: 'department_name',
    },
    {
      header: 'Actions',
      render: () => (
        <button className="btn btn-sm btn-light">
          View Projects
        </button>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Active Clients</h3>
      <DataTable<Client>
        columns={columns}
        data={clients}
        loading={loading}
      />
    </div>
  );
};

export default ClientList;
