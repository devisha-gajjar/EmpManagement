import React, { useState } from "react";
import { login } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

export default function Login() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email or Username"
          onChange={(e) =>
            setForm({ ...form, usernameOrEmail: e.target.value })
          }
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">{loading ? "Loading..." : "Login"}</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
