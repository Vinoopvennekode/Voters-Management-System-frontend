import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const AddParty = () => {
    const { id } = useParams<{ id?: string }>(); // optional param
    const navigate = useNavigate()
    const [party, setParty] = useState({ name: "", code: "", color: "#000000" });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setParty({ ...party, [name]: value });
    };


    useEffect(() => {
        if (id) {
            const fetchApi = async () => {
                await api.get(`/master/party/${id}`)
                    .then((res: any) => {
                        if (res.data.success) {
                            setParty((prev) => ({ ...prev, ...res.data.data }));
                        }
                    });
            }
            fetchApi()
        }
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();



        e.preventDefault();

        try {
            if (id) {
                const response = await api.put(`/master/party/${id}`, party);

                if (response.data.success) {

                    navigate("/parties");
                    // Optionally save token for future requests

                } else {

                    alert(response.data.message);
                }
            } else {

                const response = await api.post("/master/party", party);

                if (response.data.success) {
                    navigate("/parties");

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
                    <h6 className="m-0 fw-semibold"> {`${id ? "Update" : "Add"} Party`}</h6>
                </div>
                <div className="card-body p-3">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Party Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={party.name}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    placeholder="Enter Party Name"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Party Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={party.code}
                                    onChange={handleChange}
                                    className="form-control form-control-sm"
                                    placeholder="Enter Code"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label d-block">Party Color</label>
                                <input
                                    type="color"
                                    name="color"
                                    value={party.color}
                                    onChange={handleChange}
                                    className="form-control form-control-sm form-control-color" // Added form-control-color for Bootstrap 5 styling
                                    title="Choose a color"
                                />
                                {/* Optional: Display the hex code next to the picker */}
                                <small className="text-muted ms-2">{party.color}</small>
                            </div>
                        </div>
                        <div className="text-end mt-3">
                            <button className="btn btn-primary btn-sm px-3" type="submit">
                                {`${id ? "Update" : "Add"} `}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddParty;
