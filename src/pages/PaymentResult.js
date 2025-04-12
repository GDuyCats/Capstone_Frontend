import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button, message } from "antd";
import { executePaypalPayment } from "../api/apiClient";
import { useRef } from "react";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return {
      paymentId: query.get("paymentId"),
      payerId: query.get("PayerID"),
      token: query.get("token"),
      projectId: query.get("projectId"),
    };
  }, [location.search]);

  const paymentProcessed = useRef(false);

  useEffect(() => {
    if (paymentProcessed.current) return;

    const { paymentId, payerId, token } = queryParams;

    if (paymentId && payerId && token) {
      paymentProcessed.current = true; // Mark as processed

      executePaypalPayment(paymentId, token, payerId)
        .then((response) => {
          if (response.data.success) {
            message.success("Payment succeeded!");
          } else {
            message.error("Payment failed: " + response.data.message);
          }
        })
        .catch((error) => {
          message.error(
            "Error: " + (error.response?.data?.message || error.message)
          );
        });
    }
  }, [queryParams]);

  return (
    <Result
      status="success"
      title="Payment Successful!"
      subTitle="Thank you for supporting this project."
      extra={[
        <Button type="primary" key="console" onClick={() => navigate("/")}>
          Back to Home
        </Button>,
        queryParams.projectId && (
          <Button
            key="project"
            onClick={() => navigate(`/project/${queryParams.projectId}`)}
          >
            View Project
          </Button>
        ),
      ]}
    />
  );
};

export default PaymentResult;
