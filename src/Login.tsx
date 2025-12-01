import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../src/api/axiosInstance"; // ✅ import your axios instance
import { loader } from "../src/components/LoaderManager"; // optional if you want manual control
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";



const Login = ({ setIsLoggedIn }: any) => {
    const [form, setForm] = useState({ mobile: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.mobile || !form.password) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // 🔥 API Call
            const response = await api.post("/users/login", {
                mobile: form.mobile,
                password: form.password,
            });

            // Assuming backend returns a success flag or token
            if (response.data.success || response.data.token) {
                setIsLoggedIn(true);

                // Optionally save token for future requests
                localStorage.setItem("user", JSON.stringify(response.data.data));
                localStorage.setItem("authToken", response.data.token);

                navigate("/dashboard");
            } else {
                alert(response.data.message || "Invalid credentials");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "Something went wrong!");
        } finally {
            loader.hide(); // optional, since interceptors already hide it
        }
    };

    return (
        <>
            <Container
                fluid
                className="d-flex justify-content-center align-items-center"
                style={{
                    minHeight: "100vh",
                    background: "#F0F4FF",
                    padding: "20px"
                }}
            >
                <Row className="w-100 justify-content-center">
                    <Col xs={12} sm={10} md={6} lg={4}>
                        <Card
                            className="shadow-lg p-4"
                            style={{
                                borderRadius: "16px",
                                borderTop: "6px solid #004AAD"
                            }}
                        >
                            <div className="text-center mb-3">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    alt="voter icon"
                                    height="65"
                                />
                                <h3 className="mt-2 fw-bold" style={{ color: "#004AAD" }}>
                                    Voter Management System
                                </h3>
                                <p style={{ fontSize: "14px", color: "#555" }}>
                                    Secure Login Portal
                                </p>
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Mobile</Form.Label>
                                    <Form.Control
                                        name="mobile"
                                        placeholder="Enter mobile number"
                                        value={form.mobile}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Password</Form.Label>
                                    <Form.Control
                                        name="password"
                                        placeholder="Enter password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        style={{ borderRadius: "10px" }}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mt-2"
                                    style={{
                                        padding: "10px",
                                        fontWeight: "600",
                                        borderRadius: "10px",
                                        backgroundColor: "#004AAD"
                                    }}
                                >
                                    Login
                                </Button>
                            </Form>

                            {/* <div className="text-center mt-3">
                                <small style={{ color: "#666" }}>
                                    © {new Date().getFullYear()} Election Authority • All Rights Reserved
                                </small>
                            </div> */}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    
    );
};

export default Login;
