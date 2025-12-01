import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

const VoterTable: React.FC = () => {
    const [voters, setVoters] = useState<any[]>([]);
    const [votedFilter, setVotedFilter] = useState("all");
    const [partyFilter, setPartyFilter] = useState("all");
    const [loading, setLoading] = useState(false);

    const fetchVoters = async () => {
        try {
            setLoading(true);
            const res = await api.get("/voters/all");
            if (res.data.success) setVoters(res.data.data);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVoters();
    }, []);

    // Apply Filters
    const filteredVoters = voters.filter((v) => {
        const matchVoted =
            votedFilter === "all" ? true : votedFilter === "voted" ? v.voted : !v.voted;

        const matchParty =
            partyFilter === "all" ? true : v.partySupport?.name === partyFilter;

        return matchVoted && matchParty;
    });

    const uniqueParties = [...new Set(voters.map((v) => v.partySupport?.name).filter(Boolean))];

    return (
        <div className="card shadow-sm p-3">
            <h5 className="fw-bold mb-3 text-primary">📋 Voter Table with Filters</h5>

            {/* Filters */}
            <div className="row g-3 mb-3">
                <div className="col-md-4">
                    <label className="form-label fw-semibold">Filter by Vote Status</label>
                    <select
                        className="form-select"
                        value={votedFilter}
                        onChange={(e) => setVotedFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="voted">Voted</option>
                        <option value="notVoted">Not Voted</option>
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Filter by Party</label>
                    <select
                        className="form-select"
                        value={partyFilter}
                        onChange={(e) => setPartyFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {uniqueParties.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-light">
                            <tr>
                                <th>Serial</th>
                                <th>Name</th>
                                <th>Guardian</th>
                                <th>House</th>
                                <th>Party</th>
                                <th>Voted Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVoters.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted">No data</td>
                                </tr>
                            ) : (
                                filteredVoters.map((v) => (
                                    <tr key={v._id}>
                                        <td>{v.serialNo}</td>
                                        <td>{v.name}</td>
                                        <td>{v.guardianName}</td>
                                        <td>{v.houseName}</td>
                                        <td style={{ color: v.partySupport?.color }}>
                                            {v.partySupport?.name}
                                        </td>
                                        <td>
                                            {v.voted ? (
                                                <span className="badge bg-success">Voted</span>
                                            ) : (
                                                <span className="badge bg-danger">Not Voted</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default VoterTable;
