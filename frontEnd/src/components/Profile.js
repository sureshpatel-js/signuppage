import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

function Profile(props) {
  //Variable to store items to be deleted.
  const [deleteField, setDeleteField] = useState([]);
  //Error Handling
  const [res, setRes] = useState();
  const [rstatus, setRstatus] = useState(false);
  if (rstatus) {
    setTimeout(() => {
      setRes("");
      setRstatus(false);
    }, 2000);
  }
  //Variable for running useEffect every time we delete items.
  const [count, setCount] = useState(0);
  //Variable to store user
  const [user, setUser] = useState();
  useEffect(() => {
    const fn = async () => {
      const getUser = await axios.get("http://127.0.0.1:4000/user", {
        headers: {
          token: props.token,
        },
      });
      setUser(getUser.data.user);
    };
    fn();
  }, [count]);

  //This code take care of style of selected fields
  deleteField.map((field) => {
    document.getElementById(field).style.color = "red";
  });

  //On submit function
  const deleteFunction = (e) => {
    console.log(deleteField);
    e.preventDefault();
    axios
      .post(
        "http://127.0.0.1:4000/user",
        { deleteField },
        {
          headers: {
            token: props.token,
          },
        }
      )
      .then(function (response) {
        setCount((prev) => prev + 1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //Change password
  //Variable for conditionally rendering Button
  const [show, setShow] = useState(false);
  const [pass, setPass] = useState({
    oldPassword: "",
    newPassword: "",
  });
  console.log(pass);
  //Change handler function
  const changeHandler = (e) => {
    setPass((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  //API call to change password

  const changePassword = () => {
    const fn = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:4000/user/updatepassword",
          { pass },
          {
            headers: {
              token: props.token,
            },
          }
        );
        console.log("Password changed successfully.");
        setRstatus(true);
        setRes("Password changed successfully.");
        setPass({
          oldPassword: "",
          newPassword: "",
        });
      } catch (err) {
        console.log("Please provide a valid password");
        setRstatus(true);
        setRes("Please provide a valid password");
      }
    };

    fn();
  };

  return user ? (
    <div className="ProfileContainer">
      <div>
        <img className="profileContainer" src={user.profileUrl}    />
        <h2  id="profileUrl" ><DeleteOutlineIcon
            onClick={() => setDeleteField([...deleteField, "profileUrl"])}
          /></h2>

        <h3 id="firstName">
          {user.firstName}
          <DeleteOutlineIcon
            onClick={() => setDeleteField([...deleteField, "firstName"])}
          />{" "}
        </h3>
        <h3 id="lastName">
          {user.lastName}
          <DeleteOutlineIcon
            onClick={() => setDeleteField([...deleteField, "lastName"])}
          />{" "}
        </h3>
        <h3 id="dateOfBirth">
          {user.dateOfBirth}
          <DeleteOutlineIcon
            onClick={() => setDeleteField([...deleteField, "dateOfBirth"])}
          />{" "}
        </h3>
        <h3 id="phoneNumber">
          {user.phoneNumber}
          <DeleteOutlineIcon
            onClick={() => setDeleteField([...deleteField, "phoneNumber"])}
          />{" "}
        </h3>
        <h3>{user.email}</h3>
        <button className="btn" onClick={deleteFunction}>
          Confirm
        </button>
      </div>
      <div>
        {!show ? (
          <button className="btn" onClick={() => setShow(true)}>
            Change Password
          </button>
        ) : null}

        {show ? (
          <div className="changePasswordContainer">
            <input
              type="password"
              id="oldPassword"
              className="input"
              placeholder="Old password"
              value={pass.oldPassword}
              onChange={changeHandler}
            />
            <input
              type="Password"
              id="newPassword"
              className="input"
              placeholder="New password"
              value={pass.newPassword}
              onChange={changeHandler}
            />
            <button className="btn" onClick={changePassword}>
              Confirm
            </button>
            {rstatus ? <h4 style={{ color: "red" }}>{res}</h4> : null}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

export default Profile;
