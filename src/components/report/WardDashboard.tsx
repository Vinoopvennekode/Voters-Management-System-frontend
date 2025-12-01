import StatCard from "./StatCard";
import { Accordion, Card, Row, Col, Table } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import UniversalChart from "../UniversalChart";

// Register once
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const WardDashboard = ({ data }: any) => {
  console.log('WardDashboard', data);

  const wardList = data.data;

  const datachart = [
    { label: "Ward 1", values: [30, 50, 70] },  // For 3 parties
    { label: "Ward 2", values: [40, 20, 60] },
    { label: "Ward 3", values: [25, 35, 90] },
  ];

  const seriesNames = ["Party A", "Party B", "Party C"];

  return (
    <div className="container py-4">
      <h4>Ward Summary</h4>

      <Accordion defaultActiveKey="0">
        {wardList.map((ps: any, index: number) => (
          <Accordion.Item eventKey={String(index)} key={ps.pollingStationId}>
            <Accordion.Header>
              {ps.pollingStationName} — {ps.turnout}%
            </Accordion.Header>

            <Accordion.Body>
              <Row className="mb-3">
                <Col md={4}><StatCard title="Total" value={ps.totalVoters} /></Col>
                <Col md={4}><StatCard title="Voted" value={ps.voted} /></Col>
                <Col md={4}><StatCard title="Turnout (%)" value={ps.turnout} /></Col>
              </Row>

              <PartyChart party={ps.partySummary} />


              <Table bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Party</th>
                    <th>Total</th>
                    <th>Voted</th>
                  </tr>
                </thead>
                <tbody>
                  {ps.partySummary.map((p: any) => (
                    <tr key={p._id}>
                      <td>{p.partyName}</td>
                      <td>{p.total}</td>
                      <td>{p.voted}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

const PartyChart = ({ party }: any) => {
  const data = {
    labels: party.map((p: any) => p.partyName),
    datasets: [
      {
        label: "Votes",
        data: party.map((p: any) => p.voted),
        backgroundColor: party.map((p: any) => p.color),
      },
    ],
  };

  return (
    <Card className="p-3 shadow-sm">
      {/* <Bar data={data} /> */}
      <UniversalChart
        type="bar"
        height={180}
        data={data}
      />
    </Card>
  );
};

export default WardDashboard;
