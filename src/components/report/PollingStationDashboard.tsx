import StatCard from "./StatCard";
import { Pie } from "react-chartjs-2";
import { Card, Row, Col, Table } from "react-bootstrap";
import UniversalChart from "../UniversalChart";


const PollingStationDashboard = ({ data }: any) => {
  console.log('PollingStationDashboard', data);

  const summary = data.summary;
  const party = data.partySummary;

  const chartData = {
    labels: party.map((p: any) => p.partyName),
    datasets: [
      {
        label: "Voted",
        data: party.map((p: any) => p.voted),
        backgroundColor: party.map((p: any) => p.color),
      },
    ],
  };

  console.log('chartData', chartData);



  return (
    <div className="container py-4">
      <h4>Polling stations</h4>
      {/* --------------- STAT CARDS --------------- */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={4}>
          <StatCard title="Total Voters" value={summary.totalVoters} />
        </Col>
        <Col xs={12} md={4}>
          <StatCard title="Voted" value={summary.voted} />
        </Col>
        <Col xs={12} md={4}>
          <StatCard title="Turnout (%)" value={summary.turnout} />
        </Col>
      </Row>

      {/* --------------- CHART CARD --------------- */}
      <Card className="shadow-sm p-3 mb-4" style={{ borderRadius: "12px" }}>
        <h5 className="mb-3 fw-semibold">Party Voting Distribution</h5>

        <div className="d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: "380px" }}>
            <UniversalChart
              type="pie"
              height={300}
              data={chartData}
            />
          </div>
        </div>
      </Card>

      {/* --------------- TABLE CARD --------------- */}
      <Card className="shadow-sm p-3" style={{ borderRadius: "12px" }}>
        <h5 className="mb-3 fw-semibold">Party Voting Summary</h5>

        <Table bordered hover responsive className="mt-2">
          <thead>
            <tr>
              <th>Party</th>
              <th>Total</th>
              <th>Voted</th>
            </tr>
          </thead>
          <tbody>
            {party.map((p: any) => (
              <tr key={p._id}>
                <td>{p.partyName}</td>
                <td>{p.total}</td>
                <td>{p.voted}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

    </div>

  );
};

export default PollingStationDashboard;
