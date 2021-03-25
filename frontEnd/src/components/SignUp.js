import React, { useState } from "react";
import "./SignUp.css";

import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import app from "./../fbase";

function SignUp(props) {
  //Firebase image uploding function
  const [fileUrl, setFileUrl] = React.useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file.name);
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const path = await fileRef.getDownloadURL();

    setFileUrl(path);
  };
  //Error Handling
  const [res, setRes] = useState();
  const [rstatus, setRstatus] = useState(false);
  if (rstatus) {
    setTimeout(() => {
      setRes("");
      setRstatus(false);
    }, 2000);
  }
  //Initial state

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    dateOfBirth: "",
    profileUrl: "",
  });
  //Change handler function
  const changeHandler = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.id]: e.target.value,
      profileUrl: fileUrl,
    }));
  };
  //On submit function
  const formSubmit = (e) => {
    e.preventDefault();

    const fn = async () => {
      try {
        const res = await axios.post("http://127.0.0.1:4000/user/signup", user);
        if (res.data.token) {
          props.setToken(res.data.token);
        }
      } catch (err) {
        setRes("Please provide all the required fields.");
        setRstatus(true);
      }
    };
    fn();
  };

  return (
    <div className="signUpContainer">
      <h1  >Hello</h1>
      <h4>Please enter your details.</h4>
      <form>
        <input type="file" className="input" onChange={onFileChange} />
        <input
          type="text"
          id="firstName"
          className="input"
          placeholder="First Name*"
          value={user.firstName}
          onChange={changeHandler}
        />
        <input
          type="text"
          id="lastName"
          className="input"
          placeholder="Last Name"
          value={user.lastName}
          onChange={changeHandler}
        />
        <input
          type="text"
          id="dateOfBirth"
          className="input"
          placeholder="DD/MM/YYYY*"
          value={user.dateOfBirth}
          onChange={changeHandler}
        />

        <input
          type="text"
          id="phoneNumber"
          className="input"
          placeholder="Phone Number"
          value={user.phoneNumber}
          onChange={changeHandler}
        />
        <input
          type="email"
          id="email"
          className="input"
          placeholder="Email Address*"
          value={user.email}
          onChange={changeHandler}
        />
        <input
          type="password"
          id="password"
          className="input"
          placeholder="Password*"
          value={user.password}
          onChange={changeHandler}
        />
        <button onClick={formSubmit}>Sign up</button>
        {rstatus ? <h4 style={{ color: "red" }}>{res}</h4> : null}
      </form>
    </div>
  );
}

export default SignUp;
