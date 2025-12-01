import React from "react";

interface Column {
  key: string;
  label: string;
}

interface PaginationModel {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

interface ReusableTableProps {
  title: string;
  columns: Column[];
  data: any[];
  pagination: PaginationModel;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  title,
  columns,
  data,
  pagination,
  onPageChange,
  onSearch,
  searchPlaceholder = "Search...",
  loading = false,
}) => {
  return (
    <div className="card shadow-sm border-0">
      {/* Header */}
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
        <h6 className="m-0 fw-semibold">{title}</h6>
      </div>

      {/* Search */}
      {onSearch && (
        <div className="p-2 px-3 d-flex justify-content-between align-items-center">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="form-control form-control-sm w-25"
            onChange={(e) => onSearch(e.target.value)}
          />
          <small className="text-muted">
            Total Records: {pagination.totalRecords}
          </small>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: "600px" }}>
        <table className="table table-hover align-middle table-sm small mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th style={{ width: "40px" }}>#</th>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    {(pagination.currentPage - 1) * 10 + idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key}>{row[col.key]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="text-center text-muted py-3">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="card-footer bg-light py-2 d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Page {pagination.currentPage} of {pagination.totalPages || 1}
        </small>
        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-1"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage <= 1}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;
