import React from "react";
import { Modal, Form, Input } from "antd";

export default function UserModal({ open, onCancel, initialValues, onSubmit }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
  }, [initialValues, form, open]);

  return (
    <Modal
      title={initialValues ? "Edit User" : "Create User"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={initialValues ? "Update" : "Submit"}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "First name required" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: "Last name required" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, message: "Email required" }, { type: "email", message: "Invalid email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="avatar" label="Profile Image Link" rules={[{ required: true, message: "Avatar url required" }]}>
          <Input placeholder="https://reqres.in/img/faces/3-image.jpg" />
        </Form.Item>
      </Form>
    </Modal>
  );
}