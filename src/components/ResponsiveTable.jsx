import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";



const ResponsiveTable = () => {
    const [wards, setWards] = useState([]);
    const [pollingStations, setPollingStations] = useState([]);
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedPollingStation, setSelectedPollingStation] = useState("");
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;



    // ✅ Fetch all wards
    const fetchWards = async () => {
        try {
            const res = await api.get("/master/wards");
            if (res.data.success) setWards(res.data.data || []);
        } catch (err) {
            console.error("Error fetching wards:", err);
        }
    };

    // ✅ Fetch polling stations
    const fetchPollingStations = async (wardId) => {
        try {
            const res = await api.get(`/master/pollingStations?wardId=${wardId}&mode=byward`);
            if (res.data.success) setPollingStations(res.data.data || []);
        } catch (err) {
            console.error("Error fetching polling stations:", err);
        }
    };

    // ✅ Fetch voters
    const fetchVoters = async (newPage = 1) => {
        if (!selectedWard || !selectedPollingStation) {
            alert("Please select Ward and Polling Station");
            return;
        }
        try {
            setLoading(true);
            const res = await api.get(
                `/voters/by-location?wardId=${selectedWard}&pollingStationId=${selectedPollingStation}&page=${newPage}&limit=${limit}&search=${search}`
            );
            if (res.data.success) {
                setVoters(res.data.data);
                setTotalPages(res.data.pagination.pages);
                setTotal(res.data.pagination.total);
                setPage(newPage);
            }
        } catch (err) {
            console.error("Error fetching voters:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWards();
    }, []);

    useEffect(() => {
        if (selectedWard) fetchPollingStations(selectedWard);
    }, [selectedWard]);

    const users = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            phone: "9876543210",
            address: "123, Park Street, New Delhi",
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            zip: "110001",
            department: "IT",
            status: "Active",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Manager",
            phone: "9898989898",
            address: "45, Green Avenue, Mumbai",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            zip: "400001",
            department: "HR",
            status: "Inactive",
        },
        {
            id: 3,
            name: "Sam Wilson",
            email: "sam@example.com",
            role: "User",
            phone: "9900990099",
            address: "12, MG Road, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zip: "560001",
            department: "Sales",
            status: "Active",
        },
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            phone: "9876543210",
            address: "123, Park Street, New Delhi",
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            zip: "110001",
            department: "IT",
            status: "Active",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Manager",
            phone: "9898989898",
            address: "45, Green Avenue, Mumbai",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            zip: "400001",
            department: "HR",
            status: "Inactive",
        },
        {
            id: 3,
            name: "Sam Wilson",
            email: "sam@example.com",
            role: "User",
            phone: "9900990099",
            address: "12, MG Road, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zip: "560001",
            department: "Sales",
            status: "Active",
        },
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            phone: "9876543210",
            address: "123, Park Street, New Delhi",
            city: "New Delhi",
            state: "Delhi",
            country: "India",
            zip: "110001",
            department: "IT",
            status: "Active",
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "Manager",
            phone: "9898989898",
            address: "45, Green Avenue, Mumbai",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            zip: "400001",
            department: "HR",
            status: "Inactive",
        },
        {
            id: 3,
            name: "Sam Wilson",
            email: "sam@example.com",
            role: "User",
            phone: "9900990099",
            address: "12, MG Road, Bangalore",
            city: "Bangalore",
            state: "Karnataka",
            country: "India",
            zip: "560001",
            department: "Sales",
            status: "Active",
        },

    ];

    console.log('votersvotersvoters',voters);
    

    return (
        <div className="container">
            <h3 className="text-start mb-4 fw-bold">Fully Responsive Bootstrap Table</h3>
            <div className="row g-3 align-items-end">
                <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Select Ward</label>
                    <select
                        className="form-select mobile-select"
                        value={selectedWard}
                        onChange={(e) => {
                            setSelectedWard(e.target.value);
                            setSelectedPollingStation("");
                            setVoters([]);
                        }}
                    >
                        <option value="">-- Select Ward --</option>
                        {wards.map((ward) => (
                            <option key={ward._id} value={ward._id}>
                                {ward.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">
                        Select Polling Station
                    </label>
                    <select
                        className="form-select mobile-select"
                        value={selectedPollingStation}
                        onChange={(e) => setSelectedPollingStation(e.target.value)}
                        disabled={!selectedWard}
                    >
                        <option value="">-- Select Polling Station --</option>
                        {pollingStations.map((ps) => (
                            <option key={ps._id} value={ps._id}>
                                {ps.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Search</label>
                    <div className="input-group mobile-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Name, Guardian, Gender/Age, House, SEC ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchVoters(1)}
                        />
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => fetchVoters(1)}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Fetch Button */}
            <div className="mt-3 text-center text-md-end">
                <button
                    className="btn btn-primary px-4"
                    onClick={() => fetchVoters(1)}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch"}
                </button>
            </div>
            {/* Responsive wrapper */}
            <div className="table-responsive rounded">
                <table className="table table-bordered table-striped table-hover table-sm align-middle text-center">
                    <thead className="">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                            <th>Zip</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td className="text-nowrap">{user.name}</td>
                                <td className="text-truncate" style={{ maxWidth: "160px" }}>
                                    {user.email}
                                </td>
                                <td>{user.role}</td>
                                <td>{user.phone}</td>
                                <td className="text-truncate" style={{ maxWidth: "180px" }}>
                                    {user.address}
                                </td>
                                <td>{user.city}</td>
                                <td>{user.state}</td>
                                <td>{user.country}</td>
                                <td>{user.zip}</td>
                                <td>{user.department}</td>
                                <td>
                                    <span
                                        className={`badge ${user.status === "Active"
                                            ? "bg-success"
                                            : "bg-secondary"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-1">
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResponsiveTable;
