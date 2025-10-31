import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Envelope, Telephone, GeoAlt } from "react-bootstrap-icons";
import m1 from "../assets/image/Raksa.png";
import m2 from "../assets/image/Sivmey.png";
import m3 from "../assets/image/Solang.JPG";

const About = () => {
    return (
        <>
            {/* Header Section */}
            <div className="container-fluid bg-info mb-5">
                <div className="text text-center p-5">
                    <h1>
                        <strong>About eTrade</strong>
                    </h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae
                        omnis, voluptatem corrupti repellendus quia hic nemo.
                        <br />
                        Cumque quibusdam nulla odio nesciunt excepturi quas a voluptatem quia
                        ipsum soluta, esse fugit?
                    </p>
                </div>
            </div>

            {/* Meet Our Team Section */}
            <div
                className="container text-center mb-5"
                style={{ marginTop: "100px" }}
            >
                <h3>
                    <strong>Meet Our Team</strong>
                </h3>
                <p className="text-muted">
                    The passionate journalists and experts behind eTrade
                </p>

                <div className="row d-flex justify-content-center mt-5">
                    {/* Member 1 */}
                    <div className="col-sm-12 col-md-4 col-lg-4 mb-4">
                        <div className="card w-75 mx-auto shadow-sm border-0">
                            <div className="img">
                                <img src={m1} alt="Soun Raksa" className="card-img-top" />
                            </div>
                            <div className="txt p-3">
                                <h3>
                                    <strong>Soun Raksa</strong>
                                </h3>
                                <h5 className="text-primary">Web Developer</h5>
                                <p>Computer Science Student with Frontend and Backend skills.</p>
                            </div>
                        </div>
                    </div>

                    {/* Member 2 */}
                    <div className="col-sm-12 col-md-4 col-lg-4 mb-4">
                        <div className="card w-75 mx-auto shadow-sm border-0">
                            <div className="img">
                                <img src={m2} alt="Seng Sievmey" className="card-img-top" />
                            </div>
                            <div className="txt p-4">
                                <h3>
                                    <strong>Seng Sievmey</strong>
                                </h3>
                                <h5 className="text-primary">Web Developer</h5>
                                <p>Computer Science Student with Frontend and Backend skills.</p>
                            </div>
                        </div>
                    </div>

                    {/* Member 3 */}
                    <div className="col-sm-12 col-md-4 col-lg-4 mb-4">
                        <div className="card w-75 mx-auto shadow-sm border-0">
                            <div className="img">
                                <img src={m3} alt="Vin Solang" className="card-img-top" />
                            </div>
                            <div className="txt p-3">
                                <h3>
                                    <strong>Vin Solang</strong>
                                </h3>
                                <h5 className="text-primary">Web Developer</h5>
                                <p>Computer Science Student with Frontend and Backend skills.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Get in Touch Section */}
            <Container className="text-center mb-5" style={{ marginTop: "80px" }}>
                <h2 className="fw-bold mb-3">Get in Touch</h2>
                <p className="text-muted mb-5">
                    Have a story tip or want to collaborate? We'd love to hear from you.
                </p>

                <Row className="justify-content-center">
                    {/* Email */}
                    <Col xs={12} md={4} className="mb-4">
                        <div className="p-4 border-0">
                            <div
                                className="d-flex justify-content-center align-items-center mb-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#f0f6ff",
                                    borderRadius: "50%",
                                    margin: "0 auto",
                                }}
                            >
                                <Envelope size={28} color="#0d6efd" />
                            </div>
                            <h5 className="fw-bold">Email Us</h5>
                            <p className="text-muted mb-1">etrde@gmail.com</p>
                            <p className="text-muted">tips@etrade.com</p>
                        </div>
                    </Col>

                    {/* Call */}
                    <Col xs={12} md={4} className="mb-4">
                        <div className="p-4 border-0">
                            <div
                                className="d-flex justify-content-center align-items-center mb-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#f0f6ff",
                                    borderRadius: "50%",
                                    margin: "0 auto",
                                }}
                            >
                                <Telephone size={28} color="#0d6efd" />
                            </div>
                            <h5 className="fw-bold">Call Us</h5>
                            <p className="text-muted mb-1">+855 89696675</p>
                            <p className="text-muted">Mon-Fri, 9AM-6PM EST</p>
                        </div>
                    </Col>

                    {/* Visit */}
                    <Col xs={12} md={4} className="mb-4">
                        <div className="p-4 border-0">
                            <div
                                className="d-flex justify-content-center align-items-center mb-3"
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    backgroundColor: "#f0f6ff",
                                    borderRadius: "50%",
                                    margin: "0 auto",
                                }}
                            >
                                <GeoAlt size={28} color="#0d6efd" />
                            </div>
                            <h5 className="fw-bold">Visit Us</h5>
                            <p className="text-muted mb-1">Welcome eTrade</p>
                            <p className="text-muted">Phnom Penh, Cambodia</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default About;
