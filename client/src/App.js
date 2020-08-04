import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import { Provider } from "react-redux";
import store from "./store";

// Load components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/layout/auth/Register";
import Login from "./components/layout/auth/Login";

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header off
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user in IsAuthenticatedn
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now / 1000;
  if (decoded.exp < currentTime) {
    // Logout the user
    store.dispatch(logoutUser);
    // TODO: Clear the current profile
    // Redirect to login page
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
