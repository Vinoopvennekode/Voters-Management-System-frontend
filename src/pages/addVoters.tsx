import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AddVoters = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null);

    const [wards, setWards] = useState([]);
    const [pollingStations, setPollingStations] = useState([]);
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedPollingStation, setSelectedPollingStation] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");



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

    useEffect(() => {
        fetchWards();
    }, []);

    useEffect(() => {
        if (selectedWard) fetchPollingStations(selectedWard);
    }, [selectedWard]);


    const handleUpload = async () => {
        if (!file) {
            alert("Please select an Excel file");
            return;
        }
        if (!selectedWard || !selectedPollingStation) {
            alert("Please enter both Ward ID and Polling Station ID");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("wardId", selectedWard);
        formData.append("pollingStationId", selectedPollingStation);

        try {
            setLoading(true);
            const res = await api.post("/voters/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(res.data.message || "Voters uploaded successfully!");
        } catch (err: any) {
            console.error("Upload error:", err);
            setMessage(err.response?.data?.message || "Upload failed");
        } finally {
            setLoading(false);
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row g-3 align-items-end">
                <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Select Ward</label>
                    <select
                        className="form-select mobile-select"
                        value={selectedWard}
                        onChange={(e) => {
                            setSelectedWard(e.target.value);
                            setSelectedPollingStation("");
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
                    <label className="form-label fw-semibold">Excel File</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>

            </div>
            <div className="mt-4 text-end">
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="btn btn-primary px-4"
                >
                    {loading ? "Uploading..." : "Upload Voters"}
                </button>
            </div>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default AddVoters;
