import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { loader } from "../components/LoaderManager";


const UpdateVoters = () => {
    const navigate = useNavigate()
    const [file, setFile] = useState<File | null>(null);
    const { id } = useParams<{ id?: string }>(); // optional param

    const [voter, setVoter] = useState({
        name: "",
        guardianName: "",
        oldWardOrHouseNo: "",
        houseName: "",
        genderAge: "",
        newSecIdNo: "",
    });


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

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setVoter({ ...voter, [name]: value });
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (id) {
                const response = await api.put(`/master/voter/${id}`, voter);

                if (response.data.success) {

                    navigate("/localBodies");
                    // Optionally save token for future requests

                } else {

                    alert(response.data.message);
                }
            } else {

                const response = await api.post("/master/localBody", voter);

                if (response.data.success) {
                    navigate("/localBodies");

                    // Optionally save token for future requests

                } else {

                    alert(response.data.message);
                }

            }

        } catch (error: any) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "Something went wrong!");
        } finally {
            loader.hide(); // optional, since interceptors already hide it
        }
    };


    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white py-2">
                    <h6 className="m-0 fw-semibold">Add Voters</h6>
                </div>
                <div className="card-body p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.name}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Guardian Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.guardianName}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">House Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.houseName}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Gender Age</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.genderAge}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Old Ward Or HouseNo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.oldWardOrHouseNo}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={voter.newSecIdNo}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    required
                                />
                            </div>

                        </div>
                        <div className="text-end mt-3">
                            <button className="btn btn-primary btn-sm px-3" type="submit">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateVoters;
