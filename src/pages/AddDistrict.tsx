import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const AddDistrict = () => {
  const { id } = useParams<{ id?: string }>(); // optional param
  const navigate = useNavigate();
  const [district, setDistrict] = useState({ name: "", code: "" });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDistrict({ ...district, [name]: value });
  };

  useEffect(() => {
    if (id) {
      const fetchApi = async () => {
        await api.get(`/master/district/${id}`)
          .then((res: any) => {
            if (res.data.success) {
              setDistrict((prev) => ({ ...prev, ...res.data.data }));
            }
          });
      }
      fetchApi()
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (id) {
        const response = await api.put(`/master/district/${id}`, district);

        if (response.data.success) {

          navigate("/districts");
          // Optionally save token for future requests

        } else {

          alert(response.data.message);
        }
      } else {

        const response = await api.post("/master/district", district);

        if (response.data.success) {
          navigate("/districts");

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
          <h6 className="m-0 fw-semibold">  {`${id ? "Update" : "Add"} District`}</h6>
        </div>
        <div className="card-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">District Name</label>
                <input
                  type="text"
                  name="name"
                  value={district.name}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Enter District Name"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">District Code</label>
                <input
                  type="text"
                  name="code"
                  value={district.code}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  placeholder="Enter Code"
                  required
                />
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

export default AddDistrict;
