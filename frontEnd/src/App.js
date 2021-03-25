import { useState } from "react";
import "./App.css";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Profile from "./components/Profile";

function App() {
  //Varibals to store token and for the conditionally rendering of the components.
  const [token, setToken] = useState("");
  const [route, setRoute] = useState(true);
  console.log(token, "From app.js");
  return (
    <div className="App">
      {token ? (
        <Profile token={token} />
      ) : route ? (
        <SignIn setToken={setToken} setRoute={setRoute} />
      ) : (
        <SignUp setToken={setToken} />
      )}
    </div>
  );
}

export default App;
