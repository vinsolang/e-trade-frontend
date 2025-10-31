import React from "react";
import { motion } from "framer-motion";
import mail from "../assets/image/mail.png";

const Contact = () => {
  return (
    <>
      {/* Inline CSS for component */}
      <style>
        {`
          .line {
              border-left: 5px solid #F5F5F5; 
              height: auto; 
              margin-right: 15px;
          }
          .line-one {
              border-left: 5px solid #F81539; 
              height: 15px; 
              margin-right: 15px;
              margin-top: 6px;
          }
          .custom-button {
              font-size: 16px;
              background-color: #F5F5F5 !important;
          }
          .icon-style {
              margin-right: 10px !important;
              color: #888;
          }
        `}
      </style>

      <div className="contact"></div>
      <div className="container-fluid"></div>
      <div className="container" style={{ marginTop: "100px" }}>
        <div className="row">
          {/* Left side - Contact Info */}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6">
            <h1 data-aos="fade-down-right" data-aos-duration="1200">
              LET'S CONNECT!
            </h1>
            <p>
              Feel free to reach out if you have any questions, opportunities,
              or just want to say hi.
            </p>
            <h3>
              <i className="fa-solid fa-envelope me-3 mb-3 "></i>
              etrade@gmail.com
            </h3>
            <h3>
              <i className="fa-solid fa-phone me-3"></i>+(884) 567-8910
            </h3>

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="relative"
            >
              <img src={mail} alt="Animated" className="w-50 rounded-full" />
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xxl-6">
            <div className="card p-4">
              <h3>Live Chat</h3>
              <form>
                <div className="mb-3">
                  <label
                    htmlFor="exampleInputName"
                    className="form-label fs-5"
                  >
                    Your Name
                  </label>
                  <input type="text" className="form-control" />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label fs-5"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput1"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label fs-5"
                  >
                    Your Message
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section with Map and Info */}
      <div className="container" style={{ marginTop: "100px", marginBottom: '100px' }}>
        <div className="row mt-5">
          <div className="col-12 col-sm-12 col-lg-6">
            <div
              style={{ flex: 1 }}
              className="section-map d-flex justify-content-end rounded-5"
            >
              <iframe
                className="rounded-4"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d6479.031130263114!2d104.88449586170465!3d11.559060978180742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2skh!4v1732202338723!5m2!1sen!2skh"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-lg-6">
            <div className="w-100 ms-4">
              <div className="d-flex mt-5">
                <div>
                  <div className="ms-md-2 ps-md-1">
                    <h3 className="mb-3 fw-bold">Contact Us For Information</h3>
                  </div>
                  <div className="d-flex">
                    <div className="d-flex">
                      <div className="line rounded-5"></div>
                    </div>
                    <div className="gruopletter mt-2">
                      <p>
                        <i className="fas fa-envelope icon-style"></i>
                        Email: birchfeild@hotel.com
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <i className="fas fa-phone icon-style"></i>
                        Phone: +1 (234) 567-8910
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <i className="fas fa-fax icon-style"></i>
                        Fax: +1 (234) 567-8910
                      </p>
                      <p style={{ marginBottom: "10px" }}>
                        <i className="fas fa-map-marker-alt icon-style"></i>
                        Address: 1234 Foxrun St, New Lenox, IL 123456
                      </p>
                    </div>
                  </div>
                  <div>
                    <button className="btn mt-3 rounded-4 custom-button">
                      <i className="fa-solid fa-flask icon-style"></i>
                      Responding 24 hours a day, 7 days a week
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
