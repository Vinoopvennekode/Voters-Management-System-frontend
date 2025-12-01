import React, { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control
import ChildModal from "./modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";


const VotersList = () => {

    const [votersexport, setVotersexport] = useState<any>([]);

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
    const [show, setShow] = useState(false);
    // Store voter selected for editing
    const [selectedVoter, setSelectedVoter] = useState(null);


    const loadData = async () => {
        const res = await api.get(
            `/voters/voters?wardId=${selectedWard}&pollingStationId=${selectedPollingStation}`
        );
        console.log('res.data.data', res.data.data);

        setVotersexport(res.data.data);
    };





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
    const fetchPollingStations = async (wardId: any) => {
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


            loadData()
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

    useEffect(() => {
        if (selectedWard && selectedPollingStation)
            fetchVoters(page);
    }, [page]);


    const handleDelete = async (id: any) => {
        try {
            const res = await api.delete(`/master/localBody/${id}`)
            if (res.data.success) {
                // Optionally save token for future requests
                alert(res.data.message);

            }

        } catch (error) {
            console.error("Login error:", error);

        }
    }
    // When user clicks edit button
    const handleEdit = (voter: any) => {
        setSelectedVoter(voter);
        setShow(true);
    };

    // 🔹 After modal updates voter
    const handleUpdated = () => {
        fetchVoters(); // reload table
        setShow(false); // close modal
    };




    const exportVotersPDF = (voters: any) => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Voter List", 14, 20);

        const tableColumn = [
            "Serial No",
            "Name",
            "House No",
            "Gender/Age",
            "Party",
            "Voted"
        ];

        const tableRows = voters.map((v: any) => [
            v.serialNo,
            v.name,
            v.oldWardOrHouseNo,
            v.genderAge,
            v.partySupport?.name || "",
            v.voted ? "Yes" : "No",
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            theme: "grid",
        });

        doc.save("voters.pdf");
    };




    const exportVotersExcel = async (voters: any) => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Voters");

        // Columns
        sheet.columns = [
            { header: "Serial No", key: "serialNo", width: 15 },
            { header: "Name", key: "name", width: 25 },
            { header: "Guardian Name", key: "guardianName", width: 25 },
            { header: "House No", key: "oldWardOrHouseNo", width: 20 },
            { header: "House Name", key: "houseName", width: 20 },
            { header: "Gender/Age", key: "genderAge", width: 15 },
            { header: "Section ID", key: "newSecIdNo", width: 20 },
            { header: "Party", key: "partySupport", width: 20 },
            { header: "Voted", key: "voted", width: 12 },
            { header: "Canvassed", key: "canvassed", width: 12 }
        ];

        // Header style
        const header = sheet.getRow(1);
        header.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0073E6" } };
        });

        // Add rows
        voters?.forEach((voter: any) => {
            const row = sheet.addRow({
                serialNo: voter.serialNo,
                name: voter.name,
                guardianName: voter.guardianName,
                oldWardOrHouseNo: voter.oldWardOrHouseNo,
                houseName: voter.houseName,
                genderAge: voter.genderAge,
                newSecIdNo: voter.newSecIdNo,
                partySupport: voter.partySupport?.name || "",
                voted: voter.voted ? "Yes" : "No",
                canvassed: voter.canvassed ? "Yes" : "No",
            });
            // Apply color to PARTY column
            const partyColor = voter.partySupport?.color; // e.g. "#FF0000"
            if (partyColor) {
                row.getCell("partySupport").fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: partyColor.replace("#", "FF") }
                    // "FF" prefix = full opacity
                };
            }

        });

        // Generate buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Download
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), "voters.xlsx");
    };

    return (
        <div className="container-fluid mt-4">
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
                        {wards.map((ward: any) => (
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
                        {pollingStations.map((ps: any) => (
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
                        {/* <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => fetchVoters(1)}
                        >
                            <i className="bi bi-search"></i>
                        </button> */}
                    </div>
                </div>
            </div>
            <div className="mt-3 text-center text-md-end">
                <button
                    className="btn btn-primary px-4"
                    onClick={() => fetchVoters(1)}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch"}
                </button>
            </div>
            <div className="d-flex justify-content-end mt-2">

                <button onClick={() => exportVotersExcel(votersexport)} className="btn btn-success ms-2">
                    Export Excel
                </button>

                <button onClick={() => exportVotersPDF(votersexport)} className="btn btn-danger ms-2">
                    Export PDF
                </button>
            </div>
            <div className="card shadow-sm border-0 mt-2">
                {/* Header */}
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2">
                    <h6 className="m-0 fw-semibold">Voters List</h6>
                    <div>

                        <Link className="btn btn-light btn-sm px-2 py-1 " to={"/addVoters"}>
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
                    {/* <small className="text-muted">Total: {filtered.length}</small> */}
                </div>

                <div className="table-responsive rounded">
                    <table className="table table-bordered table-striped table-hover table-sm align-middle text-center">
                        <thead className="">
                            <tr>
                                <th>serialNo</th>
                                <th>Name</th>
                                <th>GuardianName</th>
                                <th>oldWardOrHouseNo</th>
                                <th>House Name</th>
                                <th>Gender / Age</th>
                                <th>New SecIdNo</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {voters.map((user: any) => (
                                <tr key={user.serialNo}>
                                    <td>{user.serialNo}</td>
                                    <td className="text-nowrap">{user.name}</td>
                                    <td className="text-truncate">
                                        {user.guardianName}
                                    </td>
                                    <td>{user.oldWardOrHouseNo}</td>
                                    <td>{user.houseName}</td>
                                    <td>{user.genderAge}</td>
                                    <td>{user.newSecIdNo}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center align-items-center">

                                            <button className="btn btn-sm btn-outline-primary me-2 px-1 py-0" onClick={() => handleEdit(user)}>
                                                <i className="bi bi-pencil-square small"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger px-1 py-0" onClick={() => handleDelete(user._id)}>
                                                <i className="bi bi-trash small"></i>
                                            </button>
                                        </div>
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

            {/* Child Modal */}
            <ChildModal show={show} onHide={() => setShow(false)} selectedVoter={selectedVoter} handleUpdated={handleUpdated} />
        </div>
    );
};

export default VotersList;
