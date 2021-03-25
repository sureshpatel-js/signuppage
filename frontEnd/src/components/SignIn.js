import React, { useState } from "react";
import "./SignIn.css";
import axios from "axios";

function SignIn(props) {
  //Error Handling
  const [res, setRes] = useState();
  const [rstatus, setRstatus] = useState(false);
  if (rstatus) {
    setTimeout(() => {
      setRes("");
      setRstatus(false);
    }, 2000);
  }
  //Variable for sending request to server to change password
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  //Change handler function
  const changeHandler = (e) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  //On submit function
  const formSubmit = (e) => {
    e.preventDefault();

    const fn = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:4000/user/signin",
          state
        );
        console.log(res);
        props.setToken(res.data.token);
      } catch (err) {
        console.log("Please provide valid Email and Password.");
        setRstatus(true);
        setRes("Please provide valid Email and Password.");
      }
    };
    fn();
  };
  return (
    <div className="signInContainer">
      <form>
        <input
          type="email"
          id="email"
          className="input"
          placeholder="Email Address*"
          value={state.email}
          onChange={changeHandler}
        />
        <input
          type="password"
          id="password"
          className="input"
          placeholder="Password*"
          value={state.password}
          onChange={changeHandler}
        />
        <button className="btn" onClick={formSubmit}>
          Sign in
        </button>
      </form>
      {rstatus ? <h4 style={{ color: "red" }}>{res}</h4> : null}
      <h4 className="pointer" onClick={() => props.setRoute(false)}>
        New user? Sign up.
      </h4>
    </div>
  );
}

export default SignIn;
