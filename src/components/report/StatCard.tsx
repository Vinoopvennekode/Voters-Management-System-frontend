import { Card } from "react-bootstrap";

const StatCard = ({ title, value }: any) => (
  <Card className="p-3 text-center mb-3 shadow-sm">
    <h6 className="text-muted">{title}</h6>
    <h3>{value}</h3>
  </Card>
);

export default StatCard;
