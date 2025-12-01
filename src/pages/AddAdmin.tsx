import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../components/LoaderManager"; // optional if you want manual control
import { useNavigate } from "react-router-dom";


const AddAdmin = () => {
  const { id } = useParams<{ id?: string }>(); // optional param
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    mobile: "",
    wardId: "",
    password: "123456",
  });

  useEffect(() => {
    if (id) {
      const fetchApi = async () => {
        await api.get(`/users/${id}`)
          .then((res: any) => {
            if (res.data.success) {
              setFormData((prev) => ({ ...prev, ...res.data.data }));
            }
          });
      }
      fetchApi()
    }
  }, [id]);

  const [wards, setWards] = useState<string[]>([]);

  const roles = [
    "SuperAdmin",
    "Admin",
    "Volunteer",
  ];

  const fetchWards = async () => {
    try {
      const response = await api.get("/master/wards");

      if (response.data.success) {
        setWards(response.data.data || []);
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
    // Optionally fetch wards from API if dynamic
    fetchWards()
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      if (id) {
        const response = await api.put(`/users/${id}`, formData);

        if (response.data.success) {

          navigate("/admins");
          // Optionally save token for future requests

        } else {

          alert(response.data.message);
        }
      } else {

        const response = await api.post("/users/register", formData);

        if (response.data.success) {
          navigate("/admins");

          // Optionally save token for future requests

        } else {

          alert(response.data.message);
        }

        console.log("Admin Added:", formData);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      loader.hide(); // optional, since interceptors already hide it
    }
  };
  console.log('formDATA', formData);

  let user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log('useruseruser', user);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white fw-semibold">
          {`${id ? "Update" : "Add"} Admin`}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter admin name"
                  required
                />
              </div>

              {/* Role */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Role</option>
                  {roles?.map((role: any, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Mobile</label>
                <input
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter mobile"
                  required
                />
              </div>

              {/* Ward Dropdown */}
              {(user.role == "SuperAdmin") && <div className="col-md-6">
                <label className="form-label fw-semibold">Ward</label>
                <select
                  name="wardId"
                  value={formData.wardId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Ward</option>
                  {wards?.map((ward: any, index) => (
                    <option key={index} value={ward._id}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>}
            </div>

            {/* Submit Button */}
            <div className="mt-4 text-end">
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-plus-circle me-2"></i>{`${id ? "Update" : "Add"} Admin`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
