import React, { useState, useContext } from "react";
import CustomInput from "../components/CustomInput";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [me, setMe] = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      if (username.length < 4)
        throw new Error("Username must be at least 4 characters long");
      if (password.length < 6)
        throw new Error("Password must be at least 6 characters long");
      if (password !== passwordCheck) throw new Error("Passwords do not match");

      const result = await axios.post("/users/register", {
        name,
        username,
        password,
      });

      setMe({
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name,
      });

      toast.success("Success!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      style={{
        marginTop: 100,
        maxWidth: 350,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h3>Sign Up</h3>
      <form onSubmit={submitHandler}>
        <CustomInput label="Name" value={name} setValue={setName} />
        <CustomInput label="Username" value={username} setValue={setUsername} />
        <CustomInput
          label="Password"
          value={password}
          setValue={setPassword}
          type="password"
        />
        <CustomInput
          label="Password Confirmed"
          value={passwordCheck}
          setValue={setPasswordCheck}
          type="password"
        />
        <button type="submit">Sign Up!</button>
      </form>
    </div>
  );
};

export default RegisterPage;
