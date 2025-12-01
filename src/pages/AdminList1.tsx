import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ReusableServerTable from "../components/ReusableTable";

const AdminList = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdmins = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/users/admins`, {
        params: { page, search },
      });
      if (res.data.success) {
        setAdmins(res.data.data);
        setPagination({
          totalRecords: res.data.totalRecords,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(pagination.currentPage, searchTerm);
  }, [pagination.currentPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="container-fluid mt-4">
      <ReusableServerTable
        title="Admin List"
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" }
        ]}
        data={admins}
        pagination={pagination}
        onPageChange={(page) => setPagination((p) => ({ ...p, currentPage: page }))}
        onSearch={handleSearch}
        loading={loading}
      />
    </div>
  );
};

export default AdminList;
