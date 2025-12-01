import React, { useState } from "react";
import { Link } from "react-router-dom";

const RoleList = () => {
  const allRoles = [
    { id: 1, name: "superAdmin", code: "R001" },
    { id: 2, name: "Admin", code: "R002" },
    { id: 3, name: "volontiers", code: "R003" },
  ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = allRoles.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        {/* Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
          <h6 className="m-0 fw-semibold">Role List</h6>
          <Link className="btn btn-light btn-sm px-2 py-1" to="/addDistrict">
            <i className="bi bi-plus-circle me-1"></i> Add
          </Link>
        </div>

        {/* Search */}
        <div className="p-2 px-3 d-flex justify-content-between align-items-center">
          <input
            type="text"
            placeholder="Search..."
            className="form-control form-control-sm w-25"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <small className="text-muted">Total: {filtered.length}</small>
        </div>

        {/* Table */}
        <div className="table-responsive" style={{ maxHeight: "600px", overflowY: "auto" }}>
          <table className="table table-hover align-middle table-sm small mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length ? (
                paginated.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.name}</td>
                    <td>{d.code}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2 px-1 py-0">
                        <i className="bi bi-pencil-square small"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger px-1 py-0">
                        <i className="bi bi-trash small"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-3">
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
            Page {page} of {totalPages || 1}
          </small>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleList;
