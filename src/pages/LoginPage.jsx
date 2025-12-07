import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Form, Input, Button, Checkbox, Alert } from "antd";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./login.css"; // optional additional styles

export default function LoginPage() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  React.useEffect(() => {
    if (token) nav("/users");
  }, [token]);

  const onFinish = async (values) => {
    await dispatch(loginUser(values));
    // redirect happens in effect after token is set
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <h2 style={{ textAlign: "center" }}>Login</h2>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: "eve.holt@reqres.in", password: "cityslicka", remember: true }}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email required" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Password required" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}