import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const WardList = () => {
  const [wards, setWards] = useState<any[]>([]);

  // const allWards = [
  //   { id: 1, name: "Ward 1", code: "W001", district: "Kozhikode", localBody: "Kunnamangalam" },
  //   { id: 2, name: "Ward 2", code: "W002", district: "Kozhikode", localBody: "Kunnamangalam" },
  // ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;


  const fetchAllWards = async () => {
    try {
      const response = await api.get("/master/wards");
      // Assuming backend returns a success flag or token
      if (response.data.success) {
        setWards(response.data.data || []);
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
    fetchAllWards()

  }, []);





  const handleDelete = async (id: any) => {
    try {
      const res = await api.delete(`/master/ward/${id}`)
      if (res.data.success) {
        // Optionally save token for future requests
        alert(res.data.message);
        fetchAllWards()

      }

    } catch (error) {
      console.error("Login error:", error);

    }
  }


  const filtered = wards.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()) ||
      w.district.toLowerCase().includes(search.toLowerCase()) ||
      w.localBody.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);


  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
          <h6 className="m-0 fw-semibold">Ward List</h6>
          <div>

            <Link className="btn btn-light btn-sm px-2 py-1" to="/addWard">
              <i className="bi bi-plus-circle me-1"></i> Add
            </Link>
            <Link className="btn btn-secondary btn-sm px-2 py-1 ms-2" to={"/settings"}>
              <i className="bi bi-arrow-left me-1"></i> Back
            </Link>
          </div>
        </div>

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


        <div className="table-responsive rounded">
          <table className="table table-bordered table-striped table-hover table-sm align-middle text-center">
            <thead className="">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th>District</th>
                <th>Local Body</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              {paginated.map((w: any) => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>{w.name}</td>
                  <td>{w.code}</td>
                  <td>{w.districtName}</td>
                  <td>{w.localBodyName}</td>
                  <td className="text-center d-flex">
                    <Link className="btn btn-sm btn-outline-primary me-2 px-1 py-0" to={`/addWard/${w._id}`}>
                      <i className="bi bi-pencil-square small"></i>
                    </Link>
                    <button className="btn btn-sm btn-outline-danger px-1 py-0" onClick={() => handleDelete(w._id)}>
                      <i className="bi bi-trash small"></i>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default WardList;
