
const Dashboard = () => {
    return (
        <div className="p-4">
            <h4 className="fw-bold mb-4">Dashboard Overview</h4>

            <div className="row g-4">
                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 p-3">
                        <h6 className="text-muted">Users</h6>
                        <h3 className="fw-bold text-primary">125</h3>
                    </div>
                </div>

                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 p-3">
                        <h6 className="text-muted">Active Sessions</h6>
                        <h3 className="fw-bold text-success">38</h3>
                    </div>
                </div>

                <div className="col-md-4 col-12">
                    <div className="card shadow-sm border-0 p-3">
                        <h6 className="text-muted">Revenue</h6>
                        <h3 className="fw-bold text-warning">$12,450</h3>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
