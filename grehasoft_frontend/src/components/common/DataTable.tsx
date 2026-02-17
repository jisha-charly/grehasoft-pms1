import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
}

function DataTable<T extends { id: number }>({ data, columns }: Props<T>) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted py-4">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col, index) => (
                  <td key={index}>{String(row[col.accessor])}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
