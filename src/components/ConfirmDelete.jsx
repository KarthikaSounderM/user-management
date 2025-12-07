import { Modal } from "antd";

export const confirmDelete = (onOk) => {
  Modal.confirm({
    title: "Are you sure you want to delete this user?",
    content: "This action will remove the user from the list.",
    okText: "Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk,
  });
};