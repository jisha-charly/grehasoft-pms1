import React from "react";
import { Client } from "../../types/crm";
import Card from "../common/Card";

interface Props {
  client: Client;
}

const ClientCard: React.FC<Props> = ({ client }) => {
  return (
    <Card className="mb-3">
      <h6 className="fw-bold">{client.company_name}</h6>
      <div className="text-muted small">{client.email}</div>
      <div className="text-muted small">{client.phone}</div>
    </Card>
  );
};

export default ClientCard;
