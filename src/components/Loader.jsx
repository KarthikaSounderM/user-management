import React from "react";
import { Spin } from "antd";

export default function Loader() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <Spin size="large" />
    </div>
  );
}