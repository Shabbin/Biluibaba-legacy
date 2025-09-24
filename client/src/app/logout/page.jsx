"use client";

import React from "react";

import axios from "@/src/lib/axiosInstance";
export default class Logout extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get("/api/auth/logout");

      if (data.success) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error(error);
      window.location.href = "/my-account";
    }
  }

  render() {
    return <div>Logging out...</div>;
  }
}
