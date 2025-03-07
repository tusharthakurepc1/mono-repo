import { Button, FlexboxGrid, Input, InputGroup, Text } from "rsuite";
import style from "./Login.module.scss";
import classNames from "classnames/bind";
import React from "react";
import { sendOtp, verifyOtp, getUser } from "@/services/Login.service";
import { login } from "@/store/auth";
import { useAppDispatch } from "@/store/hooks";
import { Outlet, useNavigate } from "react-router-dom";

const cx = classNames.bind(style);

const defaultPayloadValue = {
  email: "",
  otp: "",
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginPayload, setLoginPayload] = React.useState(defaultPayloadValue);
  const [isVerifyOtpVisible, setIsVerifyOtpVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFormPayloadChange = React.useCallback(
    (value: string, key: string) => {
      setLoginPayload({
        ...loginPayload,
        [key]: value,
      });
    },
    [loginPayload]
  );

  const handleOtpSend = React.useCallback(async () => {
    const inputValidation = !loginPayload.email.length;
    if (inputValidation) {
      return;
    }
    setLoading(true);
    await sendOtp(loginPayload);
    setIsVerifyOtpVisible(true);
    setLoading(false);
  }, [loginPayload]);

  const handleOtpVerify = React.useCallback(async () => {
    const inputValidation = !loginPayload.otp.length;
    if (inputValidation) {
      return;
    }

    setLoading(true);
    const otpResponse = await verifyOtp(loginPayload);
    if (otpResponse.status) {
      const response = await getUser();
      if (!!response.status) {
        dispatch(login({ user: response.user, isAuthorized: true }));
        navigate('/');
      }
    }
    setLoading(false);
  }, [loginPayload]);

  return (
    <div className={cx("login-container")}>
      <div className={cx("signup-form-card")}>
        <Text size="xxl" weight="extrabold">
          Welcome Back!
        </Text>

        {isVerifyOtpVisible ? (
          <>
            <InputGroup inside size="lg">
              <InputGroup.Addon>Otp:</InputGroup.Addon>
              <Input
                value={loginPayload.otp}
                onChange={(value) => handleFormPayloadChange(value, "otp")}
              />
            </InputGroup>
            <FlexboxGrid
              justify="center"
              align="middle"
              style={{ marginTop: 10 }}
            >
              <Button
                appearance="primary"
                className={cx("action-cta")}
                loading={loading}
                onClick={handleOtpVerify}
              >
                Verify Otp
              </Button>
            </FlexboxGrid>
          </>
        ) : (
          <>
            <InputGroup inside size="md">
              <InputGroup.Addon>Email:</InputGroup.Addon>
              <Input
                autoComplete="off"
                value={loginPayload.email}
                onChange={(value) => handleFormPayloadChange(value, "email")}
              />
            </InputGroup>
            <Text size={"sm"} weight="thin">
              We'll send an OTP on this email
            </Text>
            <FlexboxGrid justify="center" style={{ marginTop: 40 }}>
              <Button
                appearance="primary"
                className={cx("action-cta")}
                loading={loading}
                onClick={handleOtpSend}
              >
                Generate Otp
              </Button>
            </FlexboxGrid>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
