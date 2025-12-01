import api from "../api/axiosInstance"; // ✅ import your axios instance
import { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const PartyList = () => {

    const [party, setParty] = useState<any[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 10;

    const filtered = party.filter(
        (d) =>
            d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.code.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    useEffect(() => {
        getParties()
    }, [])


    // const getParties = async () => {
    //     const response = await api.get("/master/parties")
    //     if (response.data.success) {
    //         setParty(response.data.data)
    //         console.log('response.data.data', response.data.data);

    //     }
    // }


    const getParties = async () => {
        try {
            const response = await api.get("/master/parties")
            // Assuming backend returns a success flag or token
            if (response.data.success) {
                setParty(response.data.data || []);
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
    const handleDelete = async (id: any) => {
        try {
            const res = await api.delete(`/master/party/${id}`)
            if (res.data.success) {
                // Optionally save token for future requests
                alert(res.data.message);
                getParties()

            }

        } catch (error) {
            console.error("Login error:", error);

        }
    }
    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                    <h6 className="m-0 fw-semibold">Party List</h6>
                    <Link className="btn btn-light btn-sm px-2 py-1" to="/addParties">
                        <i className="bi bi-plus-circle me-1"></i> Add
                    </Link>
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
                                <th>Color</th>
                                <th>Actions</th>


                            </tr>
                        </thead>
                        <tbody>
                            {party?.map((u: any) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td className="text-nowrap">{u.name}</td>
                                    <td className="text-truncate" style={{ maxWidth: "160px" }}>
                                        {u.code}
                                    </td>
                                    <td>
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: u.color, // Use the color property
                                                border: '1px solid #ccc',
                                                margin: '0 auto', // Center the swatch
                                                borderRadius: '4px'
                                            }}
                                            title={u.color} // Show hex code on hover
                                        />
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center">

                                            <Link className="btn btn-sm btn-outline-primary me-2 px-1 py-0" to={`/addParties/${u._id}`}>
                                                <i className="bi bi-pencil-square small"></i>
                                            </Link>
                                            <button className="btn btn-sm btn-outline-danger px-1 py-0" onClick={() => handleDelete(u._id)}>
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

export default PartyList;
