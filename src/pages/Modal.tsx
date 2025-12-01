import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../api/axiosInstance";

const ChildModal = ({ show, onHide, selectedVoter, handleUpdated }: any) => {


    const [voter, setVoter] = useState({
        _id: "",
        name: "",
        guardianName: "",
        oldWardOrHouseNo: "",
        houseName: "",
        genderAge: "",
        newSecIdNo: "",
    });


    // 🔹 When selectedVoter changes → fill form automatically
    useEffect(() => {
        if (selectedVoter) {
            setVoter(selectedVoter);
        }
    }, [selectedVoter]);

    // 🔹 Handle input changes
    const handleChange = (e: any) => {
        const { name, value } = e.target;

        setVoter((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 🔹 Submit form
    const handleSubmit = async () => {


        try {
            console.log("Submitted voter data:", voter);

            const res = await api.put(`/voters/${voter._id}`, voter);

            console.log('Submitted voter data:', res);

            handleUpdated()

        } catch (err) {
            console.error("Error fetching wards:", err);
        }
    };


    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Update Voter</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    {/* Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={voter.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter name"
                        />
                    </Form.Group>

                    {/* Guardian Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>Guardian Name</Form.Label>
                        <Form.Control
                            name="guardianName"
                            value={voter.guardianName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter guardian name"
                        />
                    </Form.Group>

                    {/* Old Ward / House No */}
                    <Form.Group className="mb-3">
                        <Form.Label>Old Ward / House No</Form.Label>
                        <Form.Control
                            name="oldWardOrHouseNo"
                            value={voter.oldWardOrHouseNo}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter old ward or house number"
                        />
                    </Form.Group>

                    {/* House Name */}
                    <Form.Group className="mb-3">
                        <Form.Label>House Name</Form.Label>
                        <Form.Control
                            name="houseName"
                            value={voter.houseName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter house name"
                        />
                    </Form.Group>

                    {/* Gender & Age */}
                    <Form.Group className="mb-3">
                        <Form.Label>Gender / Age</Form.Label>
                        <Form.Control
                            name="genderAge"
                            value={voter.genderAge}
                            onChange={handleChange}
                            type="text"
                            placeholder="Eg: M / 34"
                        />
                    </Form.Group>

                    {/* New Sec ID */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Sec ID No</Form.Label>
                        <Form.Control
                            name="newSecIdNo"
                            value={voter.newSecIdNo}
                            onChange={handleChange}
                            type="text"
                            placeholder="Enter new sec id"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {/* <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary">
                    Save Changes
                </Button> */}
                <Button variant="primary" onClick={handleSubmit}>
                    Update Voter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChildModal;
