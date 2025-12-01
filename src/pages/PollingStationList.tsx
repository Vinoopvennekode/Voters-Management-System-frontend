import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control



const PollingStationList = () => {
  const [pollingStations, setPollingStations] = useState<any[]>([]);

  // const allStations = [
  //   { id: 1, name: "Station 1", code: "P001", district: "Kozhikode", localBody: "Kunnamangalam", ward: "Ward 1" },
  //   { id: 2, name: "Station 2", code: "P002", district: "Kannur", localBody: "Thalassery", ward: "Ward 3" },
  // ];

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = pollingStations.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase()) ||
      s.localBody.toLowerCase().includes(search.toLowerCase()) ||
      s.ward.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);




  const fetchAllPollingStations = async () => {
    try {
      const response = await api.get("/master/pollingStations");
      // Assuming backend returns a success flag or token
      if (response.data.success) {
        setPollingStations(response.data.data || []);
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
    fetchAllPollingStations()

  }, []);





  const handleDelete = async (id: any) => {
    try {
      const res = await api.delete(`/master/pollingStation/${id}`)
      if (res.data.success) {
        // Optionally save token for future requests
        alert(res.data.message);
        fetchAllPollingStations()

      }

    } catch (error) {
      console.error("Login error:", error);

    }
  }










  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
          <h6 className="m-0 fw-semibold">Polling Station List</h6>
          <div>

            <Link className="btn btn-light btn-sm px-2 py-1" to="/addPollingStation">
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
                <th>Ward</th>
                <th>Actions</th>


              </tr>
            </thead>
            <tbody>
              {paginated.map((s: any) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.code}</td>
                  <td>{s.district}</td>
                  <td>{s.localBody}</td>
                  <td>{s.ward}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Link className="btn btn-sm btn-outline-primary me-2 px-1 py-0" to={`/addPollingStation/${s._id}`}>
                        <i className="bi bi-pencil-square small"></i>
                      </Link>
                      <button className="btn btn-sm btn-outline-danger px-1 py-0" onClick={() => handleDelete(s._id)}>
                        <i className="bi bi-trash small"></i>
                      </button>
                    </div>
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

export default PollingStationList;
