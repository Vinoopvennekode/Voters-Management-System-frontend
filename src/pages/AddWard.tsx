import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control


const AddWard = () => {
  const { id } = useParams<{ id?: string }>(); // optional param
  const navigate = useNavigate();
  const [ward, setWard] = useState({
    name: "",
    code: "",
    districtId: "",
    localBodyId: "",
  });


  const [districts, setDistricts] = useState<string[]>([]);
  const [localBodies, setLocalBodies] = useState<string[]>([]);


  useEffect(() => {
    // Optionally fetch wards from API if dynamic
    fetcDistricts()
    fetcLocalbodies()
  }, []);

  const fetcLocalbodies = async () => {
    try {
      const response = await api.get("/master/localBodies");

      if (response.data.success) {
        setLocalBodies(response.data.data || []);
        // Optionally save token for future requests

      } else {

        // alert(response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      loader.hide(); // optional, since interceptors already hide it
    }
  }


  const fetcDistricts = async () => {
    try {
      const response = await api.get("/master/districts");

      if (response.data.success) {
        setDistricts(response.data.data || []);
        // Optionally save token for future requests

      } else {

        // alert(response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      loader.hide(); // optional, since interceptors already hide it
    }
  }


  useEffect(() => {
    if (id) {
      const fetchApi = async () => {
        await api.get(`/master/ward/${id}`)
          .then((res: any) => {
            if (res.data.success) {
              setWard((prev) => ({ ...prev, ...res.data.data }));
            }
          });
      }
      fetchApi()
    }
  }, [id]);

  useEffect(() => {
    // Optionally fetch wards from API if dynamic
    fetchWards()
  }, []);

  const fetchWards = async () => {
    try {
      const response = await api.get("/master/districts");

      if (response.data.success) {
        setDistricts(response.data.data || []);
        // Optionally save token for future requests

      } else {

        // alert(response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      loader.hide(); // optional, since interceptors already hide it
    }
  }




  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setWard({ ...ward, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (id) {
        const response = await api.put(`/master/ward/${id}`, ward);

        if (response.data.success) {

          navigate("/wards");
          // Optionally save token for future requests

        } else {

          alert(response.data.message);
        }
      } else {

        const response = await api.post("/master/ward", ward);

        if (response.data.success) {
          navigate("/wards");

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
          <h6 className="m-0 fw-semibold">{`${id ? "Update" : "Add"} Ward`}</h6>
        </div>
        <div className="card-body p-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={ward.name}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  name="code"
                  value={ward.code}
                  onChange={handleChange}
                  className="form-control form-control-sm"
                  required
                />
              </div>
              {id && <div className="col-md-3">
                <label className="form-label">District</label>
                <select
                  name="districtId"
                  value={ward.districtId}
                  onChange={handleChange}
                  className="form-select form-select-sm"
                  disabled
                >
                  <option value="">Select District</option>
                  {districts?.map((d: any, index) => (
                    <option key={index} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>}
              <div className="col-md-3">
                <label className="form-label">Local Body</label>
                <select
                  name="localBodyId"
                  value={ward.localBodyId}
                  onChange={handleChange}
                  className="form-select form-select-sm"
                  required
                >
                  <option value="">Select Local Body</option>
                  {localBodies?.map((d: any, index) => (
                    <option key={index} value={d._id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            <div className="text-end mt-3">
              <button className="btn btn-primary btn-sm px-3" type="submit">
                {`${id ? "Update" : "Add"}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWard;
