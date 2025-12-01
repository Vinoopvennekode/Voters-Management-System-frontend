import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance"; // your axios instance

const VotingDay: React.FC = () => {
    const [wards, setWards] = useState<any[]>([]);
    const [pollingStations, setPollingStations] = useState<any[]>([]);
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedPollingStation, setSelectedPollingStation] = useState("");
    const [voters, setVoters] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [votedCount, setVotedCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [highlighted, setHighlighted] = useState<string | null>(null);



    // ✅ Fetch all wards
    const fetchWards = async () => {
        try {
            const res = await api.get("/master/wards");
            if (res.data.success) setWards(res.data.data || []);
        } catch (err) {
            console.error("Error fetching wards:", err);
        }
    };

    // ✅ Fetch polling stations by ward
    const fetchPollingStations = async (wardId: string) => {
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
                `/voters/by-location?wardId=${selectedWard}&pollingStationId=${selectedPollingStation}&page=${newPage}&limit=${limit}&search=${search}&mode=votingDay`
            );
            if (res.data.success) {
                setVoters(res.data.data);
                setTotalPages(res.data.pagination.pages);
                setTotal(res.data.pagination.total);
                setVotedCount(res.data.pagination.votedCount);
                setPage(newPage);
            }
        } catch (err) {
            console.error("Error fetching voters:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Mark as voted
    const markAsVoted = async (voterId: string, currentStatus: boolean) => {
        try {
            const res = await api.patch(`/voters/${voterId}/mark-voted`);
            if (res.data.success) {
                setVoters((prev) =>
                    prev.map((v) =>
                        v._id === voterId ? { ...v, voted: !currentStatus } : v
                    )
                );
                // ✅ Update voted count from backend
                if (res.data.votedCount !== undefined) {
                    setVotedCount(res.data.votedCount);
                }
                setHighlighted(voterId);
                setTimeout(() => setHighlighted(null), 2000); // Flash effect
            }
        } catch (err) {
            console.error("Error marking voted:", err);
        }
    };

    useEffect(() => {
        fetchWards();
    }, []);

    useEffect(() => {
        if (selectedWard) fetchPollingStations(selectedWard);
    }, [selectedWard]);

    useEffect(() => {
        const timeout = setTimeout(() => fetchVoters(1), 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-3">
                <h5 className="fw-bold mb-3 text-primary">🗳️ Voting Day Panel</h5>

                {/* Filters */}
                <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                        <label className="form-label fw-semibold">Select Ward</label>
                        <select
                            className="form-select"
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
                        <label className="form-label fw-semibold">Select Polling Station</label>
                        <select
                            className="form-select"
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
                        <label className="form-label fw-semibold">Search (Serial / Name)</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type to search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="text-end mb-3">
                    <button className="btn btn-primary" onClick={() => fetchVoters(1)}>
                        Fetch Voters
                    </button>
                </div>

                {/* Stats */}
                <div className="mb-3 fw-semibold">
                    Voted: {votedCount} / {total} (
                    {((votedCount / total) * 100 || 0).toFixed(1)}%)
                </div>

                {/* Voter Cards */}
                {loading ? (
                    <div className="text-center py-4">Loading voters...</div>
                ) : voters.length === 0 ? (
                    <div className="text-center py-4 text-muted">No voters found.</div>
                ) : (
                    <div className="row g-3">
                        {voters.map((v) => (
                            <div
                                key={v._id}
                                className={`col-12 col-sm-6 col-md-4 col-lg-3 ${highlighted === v._id ? "flash-bg" : ""
                                    }`}
                            >
                                <div
                                    className={`card border-0 shadow-sm h-100 ${v.voted ? "bg-light" : ""
                                        }`}
                                >
                                    <div className="card-body p-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="fw-bold mb-1">
                                                {v.serialNo}. {v.name}
                                            </h6>
                                            <div className="d-flex flex-column align-items-center gap-1">
                                                <div>

                                                    {v.voted ? (
                                                        <span className="badge bg-success">Voted</span>
                                                    ) : (
                                                        <span className="badge bg-danger">Not Voted</span>
                                                    )}
                                                </div>
                                                <div style={{ color: v.partySupport?.color }}>
                                                    {v.partySupport.name}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="mb-1 small text-muted">
                                            <b>Guardian:</b> {v.guardianName || "-"}
                                        </p>
                                        <p className="mb-1 small text-muted">
                                            <b>House:</b> {v.houseName || "-"}
                                        </p>
                                        <p className="mb-1 small text-muted">
                                            <b>Gender/Age:</b> {v.genderAge || "-"}
                                        </p>

                                        <div className="mt-2 d-flex justify-content-end">
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                // disabled={v.voted}
                                                onClick={() => markAsVoted(v._id, v.voted)}
                                            >
                                                {/* Mark Voted ✅ */}
                                                {v.voted ? "Undo Vote" : "Mark Voted"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {voters.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === 1}
                            onClick={() => fetchVoters(page - 1)}
                        >
                            Prev
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={page === totalPages}
                            onClick={() => fetchVoters(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Flash Animation */}
            <style>{`
        .flash-bg {
          animation: flash 1.5s ease-in-out;
        }
        @keyframes flash {
          0% { background-color: #d1f7d1; }
          100% { background-color: transparent; }
        }
      `}</style>
        </div>
    );
};

export default VotingDay;
