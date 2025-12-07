import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setPage,
} from "../redux/usersSlice";
import {
  Table,
  Card,
  Button,
  Input,
  Pagination,
  Row,
  Col,
  Space,
  Segmented,
  message,
} from "antd";
import UserModal from "../components/UserModal";
import { confirmDelete } from "../components/ConfirmDelete";
import Loader from "../components/Loader";
import "./users.css";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { data, loading, page, totalPages, perPage } = useSelector((s) => s.users);

  // UI states
  const [view, setView] = useState("table"); // table | card
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  // live client-side filtered list
  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter((u) => {
      const term = search.toLowerCase();
      return (
        (u.first_name && u.first_name.toLowerCase().includes(term)) ||
        (u.last_name && u.last_name.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term))
      );
    });
  }, [data, search]);

  // open create modal
  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  // open edit modal
  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // submit create/update
  const handleSubmit = async (values) => {
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser.id, body: values })).unwrap();
        message.success("User updated");
      } else {
        await dispatch(createUser(values)).unwrap();
        message.success("User created");
      }
      setModalOpen(false);
    } catch (err) {
      message.error("Operation failed");
    }
  };

  // delete
  const onDelete = (id) => {
    confirmDelete(async () => {
      try {
        await dispatch(deleteUser(id)).unwrap();
        message.success("User deleted");
      } catch {
        message.error("Delete failed");
      }
    });
  };

  // table columns
  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      render: (a) => <img src={a} alt="avatar" style={{ width: 40, borderRadius: 20 }} />,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Edit</Button>
          <Button danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="users-page">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2>Users</h2>
        </Col>

        <Col>
          <Space>
            <Input.Search placeholder="search by name or email" onChange={(e) => setSearch(e.target.value)} allowClear />
            <Segmented options={["table", "card"]} value={view} onChange={(v) => setView(v)} />
            <Button type="primary" onClick={openCreate}>Create User</Button>
          </Space>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : (
        <>
          {view === "table" ? (
            <Table dataSource={filtered} columns={columns} rowKey="id" pagination={false} />
          ) : (
            <div className="card-grid">
              {filtered.map((u) => (
                <Card key={u.id} style={{ width: 220, margin: 8 }}>
                  <img src={u.avatar} alt="" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 6 }} />
                  <div style={{ marginTop: 12, fontWeight: 600 }}>{u.first_name} {u.last_name}</div>
                  <div style={{ color: "#888", marginBottom: 12 }}>{u.email}</div>
                  <Space>
                    <Button onClick={() => openEdit(u)}>Edit</Button>
                    <Button danger onClick={() => onDelete(u.id)}>Delete</Button>
                  </Space>
                </Card>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Pagination
              current={page}
              total={totalPages * perPage}
              pageSize={perPage}
              onChange={(p) => dispatch(setPage(p))}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <UserModal
        open={modalOpen}
        initialValues={editingUser}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}