import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'





// interface Party {
//     partyName: string;
//     voted: number;
// }

// interface PollingSummary {
//     totalVoters: number;
//     voted: number;
//     pollingStationId: string;
//     pollingStationName: string;
//     wardId: string;
//     turnout: number;
//     parties: Party[];
// }

// interface WardSummary {
//     totalVoters: number;
//     voted: number;
//     wardId: string;
//     wardName: string;
//     turnout: number;
// }

// interface PartySummary {
//     totalVoters: number;
//     voted: number;
//     partyId: string;
//     partyName: string;
//     color: string;
//     turnout: number;
// }

// interface WardPartySummary {
//     wardId: string;
//     wardName: string;
//     parties: Party[];
// }

// interface DashboardProps {
//     data: {
//         success: boolean;
//         summary: {
//             totalVoters: number;
//             voted: number;
//             turnout: string;
//         };
//         wardSummary: WardSummary[];
//         pollingSummary: PollingSummary[];
//         partySummary: PartySummary[];
//         wardPartySummary: WardPartySummary[];
//     };
// }



// function Report() {
//     const [data, SetData] = useState<any>([])

//     const fetchReport = async () => {


//         const res = await api.get("/report/votingSummary")
//         debugger
//         SetData(res.data)

//     }
//     return (

//         <div className="container py-4">
//              <button onClick={() => { fetchReport() }}>report</button>

//             {/* -------------------- SUMMARY CARDS -------------------- */}
//             <h4 className="mb-3 fw-bold">Overall Summary</h4>
//             <div className="row g-3">
//                 <div className="col-md-4">
//                     <div className="card shadow-sm">
//                         <div className="card-body text-center">
//                             <p className="text-muted">Total Voters</p>
//                             <h3>{data.summary?.totalVoters}</h3>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-md-4">
//                     <div className="card shadow-sm">
//                         <div className="card-body text-center">
//                             <p className="text-muted">Voted</p>
//                             <h3>{data.summary?.voted}</h3>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="col-md-4">
//                     <div className="card shadow-sm">
//                         <div className="card-body text-center">
//                             <p className="text-muted">Turnout</p>
//                             <h3>{data.summary?.turnout}%</h3>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* -------------------- WARD SUMMARY TABLE -------------------- */}
//             <h4 className="mt-5 mb-3 fw-bold">Ward Summary</h4>
//             <div className="table-responsive">
//                 <table className="table table-bordered table-striped">
//                     <thead className="table-light">
//                         <tr>
//                             <th>Ward Name</th>
//                             <th>Total Voters</th>
//                             <th>Voted</th>
//                             <th>Turnout (%)</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.wardSummary?.map((w: any) => (
//                             <tr key={w.wardId}>
//                                 <td>{w.wardName}</td>
//                                 <td>{w.totalVoters}</td>
//                                 <td>{w.voted}</td>
//                                 <td>{w.turnout}%</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* -------------------- POLLING SUMMARY -------------------- */}
//             <h4 className="mt-5 mb-3 fw-bold">Polling Station Summary</h4>
//             {data?.pollingSummary?.map((p: any) => (
//                 <div className="card mb-4 shadow-sm" key={p.pollingStationId}>
//                     <div className="card-body">
//                         <h5 className="fw-semibold">{p.pollingStationName}</h5>
//                         <p className="text-muted mb-3">Turnout: {p.turnout}%</p>

//                         <div className="table-responsive">
//                             <table className="table table-bordered">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>Party</th>
//                                         <th>Voted</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {p.parties.map((party: any, idx: any) => (
//                                         <tr key={idx}>
//                                             <td>{party.partyName}</td>
//                                             <td>{party.voted}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             ))}

//             {/* -------------------- PARTY SUMMARY CARDS -------------------- */}
//             <h4 className="mt-5 mb-3 fw-bold">Party Summary</h4>
//             <div className="row g-3">
//                 {data.partySummary?.map((party: any) => (
//                     <div className="col-md-3 col-sm-6" key={party.partyId}>
//                         <div className="card shadow-sm border-0">
//                             <div className="card-body text-center">
//                                 <h6 className="fw-bold">{party.partyName}</h6>
//                                 <p className="mb-1">Total: {party.totalVoters}</p>
//                                 <p className="mb-1">Voted: {party.voted}</p>
//                                 <p className="fw-bold">Turnout: {party.turnout}%</p>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* -------------------- WARD PARTY SUMMARY -------------------- */}
//             <h4 className="mt-5 mb-3 fw-bold">Ward Party Summary</h4>
//             {data?.wardPartySummary?.map((ward: any) => (
//                 <div className="card mb-4 shadow-sm" key={ward.wardId}>
//                     <div className="card-body">
//                         <h5 className="fw-semibold">{ward.wardName}</h5>

//                         <div className="table-responsive">
//                             <table className="table table-bordered">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>Party</th>
//                                         <th>Voted</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {ward?.parties?.map((p: any, idx: any) => (
//                                         <tr key={idx}>
//                                             <td>{p.partyName}</td>
//                                             <td>{p.voted}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                     </div>
//                 </div>
//             ))}

//         </div>
//     )
// }

// export default Report


import React from "react";
import WardDashboard from "../components/report/WardDashboard";
// import BarChart from "../components/report/BarChart";
import PollingStationDashboard from "../components/report/PollingStationDashboard";
// import LineChart from "../components/report/LineChart";




const Dashboard = () => {

    const [wards, setWards] = useState<any[]>([]);
    const [pollingStations, setPollingStations] = useState<any[]>([]);

    const [selectedWard, setSelectedWard] = useState("");
    const [selectedPollingStation, setSelectedPollingStation] = useState("");

    const [data, setData] = useState<any>([])

    useEffect(() => {
        loadWards();
    }, []);

    // 🔹 Fetch Wards
    const loadWards = async () => {
        const res = await api.get("/master/wards");

        setWards(res.data.data);
    };

    // 🔹 Fetch Polling Stations when Ward changes
    const loadPollingStations = async (wardId: string) => {
        const res = await api.get(`/master/pollingStations?wardId=${wardId}&mode=byward`);
        setPollingStations(res.data.data);
    };

    // 🔹 Common fetch function for dashboard
    const fetchReport = async (wardId: string, stationId: string) => {
        const res = await api.get(
            `/report/votingSummarytest?wardId=${wardId}&pollingStationId=${stationId}`
        );
        setData(res.data);
    };

    // 🔹 Handle Ward Change
    const handleWardChange = (e: any) => {
        const wardId = e.target.value;
        setSelectedWard(wardId);
        setSelectedPollingStation("");

        setData(null); // clear dashboard until fetch

        if (wardId) {
            loadPollingStations(wardId);
            fetchReport(wardId, ""); // Fetch for ward-level summary
        }
    };

    // 🔹 Handle Polling Station Change
    const handlePollingChange = (e: any) => {
        const stationId = e.target.value;
        setSelectedPollingStation(stationId);

        if (selectedWard) {
            fetchReport(selectedWard, stationId);
        }
    };


    // if (data.mode === "POLLING_STATION") {
    //     return <PollingStationDashboard data={data} />;
    // }

    // if (data.mode === "WARD") {
    //     return <WardDashboard data={data} />;
    // }

    // return <p>No data available</p>;

    console.log('wardswardswardswards', wards);

    return (
        <div className="container py-3">
            <h4>Dashboard</h4>
            {/* ------------------ FILTERS ------------------ */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <label className="form-label fw-semibold">Select Ward</label>
                    <select
                        className="form-select"
                        value={selectedWard}
                        onChange={handleWardChange}
                    >
                        <option value="">-- Select Ward --</option>
                        {wards?.map((w: any) => (
                            <option key={w._id} value={w._id}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold">Select Polling Station</label>
                    <select
                        className="form-select"
                        value={selectedPollingStation}
                        onChange={handlePollingChange}
                        disabled={!selectedWard}
                    >
                        <option value="">-- All Polling Stations --</option>
                        {pollingStations?.map((ps: any) => (
                            <option key={ps._id} value={ps._id}>
                                {ps.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ------------------ DASHBOARD RENDER ------------------ */}
            {!data && <p>Select Ward / Polling Station to view dashboard...</p>}

            {data?.mode === "POLLING_STATION" && (
                <PollingStationDashboard data={data} />
            )}

            {data?.mode === "WARD" && <WardDashboard data={data} />}

            {data && !["POLLING_STATION", "WARD"].includes(data.mode) && (
                <p>No data available</p>
            )}
        </div>
    );
};

export default Dashboard;