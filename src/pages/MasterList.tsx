import { Link } from "react-router-dom";

const MasterList = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const masterData = [
        // {
        //     id: 1,
        //     title: "Users",
        //     count: 125,
        //     icon: "bi-people-fill",
        //     color: "primary",
        //     path: "/districts",

        // },
        {
            id: 2,
            title: "Admins",
            count: 38,
            icon: "bi-person-gear",
            color: "success",
            path: "/admins",
            roles: ["SuperAdmin", "Admin"],   // ONLY SuperAdmin can see
        },
        {
            id: 3,
            title: "Districts",
            count: 24,
            icon: "bi-geo-alt-fill",
            color: "warning",
            path: "/districts",
            roles: ["SuperAdmin"],   // Visible to both
        },
        {
            id: 4,
            title: "LocalBodys",
            count: 39,
            icon: "bi-house",
            color: "danger",
            path: "/localBodies",
            roles: ["SuperAdmin"],   // Visible to both

        },
        {
            id: 5,
            title: "Wards",
            count: 54,
            icon: "bi-front",
            color: "info",
            path: "/wards",
            roles: ["SuperAdmin"],   // Visible to both

        },
        {
            id: 5,
            title: "Plolling Stations",
            count: 54,
            icon: "bi-pc",
            color: "success",
            path: "/pollingStations",
            roles: ["SuperAdmin", "Admin"],   // Visible to both

        },
        // {
        //     id: 6,
        //     title: "table",
        //     count: 54,
        //     icon: "bi-front",
        //     color: "info",
        //     path: "/table",

        // },
        {
            id: 7,
            title: "Voters",
            count: 54,
            icon: "bi-people-fill",
            color: "info",
            path: "/voters",
            roles: ["SuperAdmin"],   // Visible to both

        }
        // ,
        // {
        //     id: 8,
        //     title: "Adminsnew",
        //     count: 54,
        //     icon: "bi-front",
        //     color: "info",
        //     path: "/adminsnew",

        // }

        ,
        {
            id: 9,
            title: "Parties",
            count: 54,
            icon: "bi-filter-circle",
            color: "warning",
            path: "/parties",
            roles: ["SuperAdmin"],   // Visible to both

        }

    ];




    return (
        <div className="p-4">
            <h4 className="fw-bold mb-4">Settings</h4>

            <div className="row g-4">
                {masterData
                    .filter(item => item.roles.includes(user.role)) // 💥 ROLE FILTER HERE
                    .map((item) => (
                        <div key={item.id} className="col-md-4 col-12">
                            <Link
                                to={item.path}
                                className="text-decoration-none"
                            >

                                <div className="card shadow-sm border-0 p-3 d-flex align-items-center flex-row">
                                    <div
                                        className={`bg-${item.color} bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center`}
                                        style={{ width: "60px", height: "60px" }}
                                    >
                                        <i className={`bi ${item.icon} text-${item.color} fs-3`}></i>
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="text-muted mb-1">{item.title}</h6>
                                        {/* <h4 className={`fw-bold mb-0 text-${item.color}`}>{item.count}</h4> */}
                                    </div>
                                </div>
                            </Link>

                        </div>
                    ))}
            </div>
        </div>

    );
};

export default MasterList;
