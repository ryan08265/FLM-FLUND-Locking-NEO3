import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardBody } from "./../components/card/card.jsx";

function PagesError() {
  const navigate = useNavigate();

  function handleBackBtn() {
    navigate(-1);
  }

  return (
    <div className="error-page">
      <div className="error-page-content">
        <Card className="mb-5 mx-auto" style={{ maxWidth: "320px" }}>
          <CardBody>
            <Card>
              <div className="error-code">404</div>
            </Card>
          </CardBody>
        </Card>
        <h1>Oops!</h1>
        <h3>We can't seem to find the page you're looking for</h3>
        <hr />
        <p className="mb-1">Here are some helpful links instead:</p>
        <p className="mb-5">
          <Link
            to="/"
            className="text-decoration-none text-white text-opacity-50"
          >
            Home
          </Link>
          <span className="link-divider"></span>
          <Link
            to="/class/romeo"
            className="text-decoration-none text-white text-opacity-50"
          >
            Romeo and Juliet
          </Link>
        </p>
        <button
          onClick={handleBackBtn}
          className="btn btn-outline-theme px-3 rounded-pill"
        >
          <i className="fa fa-arrow-left me-1 ms-n1"></i> Go Back
        </button>
      </div>
    </div>
  );
}

export default PagesError;
