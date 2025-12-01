import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const AdminList = () => {
  const [allAdmins, setAllAdmins] = useState<any[]>([]);




  const fetchAllAdmins = async () => {
    try {
      const response = await api.get("/users/admins");
      // Assuming backend returns a success flag or token
      if (response.data.success) {
        setAllAdmins(response.data.data || []);
        // Optionally save token for future requests

      } else {

        alert(response.data.message);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      loader.hide(); // optional, since interceptors already hide it
    }
  }



  useEffect(() => {
    fetchAllAdmins()
    // Simulate fetching data from an API
    // In a real application, you would replace this with an actual API call
    // For example: fetch('/api/admins').then(response => response.json()).then(data => setAllAdmins(data));
  }, []);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = allAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );
  const handleDelete = async (id: any) => {
    try {
      const res = await api.delete(`users/${id}`)
      if (res.data.success) {
        // Optionally save token for future requests
        alert(res.data.message);
        fetchAllAdmins()

      }

    } catch (error) {
      console.error("Login error:", error);

    }
  }
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        {/* Header */}
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
          <h6 className="m-0 fw-semibold">Admin List</h6>
          <div>

            <Link className="btn btn-light btn-sm px-2 py-1" to={"/addAdmin"}>
              <i className="bi bi-plus-circle me-1"></i> Add
            </Link>
            <Link className="btn btn-secondary btn-sm px-2 py-1 ms-2" to={"/settings"}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </Link>
          </div>
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
        {/* <div
          className="table-responsive"
       
        >
          <table className="table table-hover align-middle table-sm small mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "40px" }}>#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col" className="text-center" style={{ width: "90px" }}>
                  Actions
                </th>
                <th>title1</th>
                <th>title2</th>
                <th>title3</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((admin) => (
                  <tr key={admin.id}>
                    <td>{admin.id}</td>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.role}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2 px-1 py-0">
                        <i className="bi bi-pencil-square small"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger px-1 py-0">
                        <i className="bi bi-trash small"></i>
                      </button>
                    </td>
                    <td>ro1sjldvkjbsdv</td>
                    <td>ro2ksndvjds</td>
                    <td>ro3sdkhvbkjadbkjbsdv</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> */}

        <div className="table-responsive rounded">
          <table className="table table-bordered table-striped table-hover table-sm align-middle text-center">
            <thead className="">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Role</th>
                <th scope="col" className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="text-nowrap">{user.name}</td>
                  <td className="text-truncate" style={{ maxWidth: "160px" }}>
                    {user.mobile}
                  </td>
                  <td>{user.role}</td>
                  <td className="text-center d-flex">
                    {/* <button className="btn btn-sm btn-outline-primary me-2 px-1 py-0">
                        <i className="bi bi-pencil-square small"></i>
                      </button> */}

                    <Link className="btn btn-sm btn-outline-primary me-2 px-1 py-0" to={`/addAdmin/${user._id}`}>
                      <i className="bi bi-pencil-square small"></i>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger px-1 py-0" onClick={() => handleDelete(user._id)}>
                      <i className="bi bi-trash small"></i>
                    </button>
                  </td>
                </tr>
              ))}
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

export default AdminList;
