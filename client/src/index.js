import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import { LoginCallback, Security } from "@okta/okta-react";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  issuer: `https://dev-05664828.okta.com/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: `https://dev-05664828.okta.com/oauth2/default/login/callback`,
});

function SecuredRoutes(props) {
  const navigate = useNavigate();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Link exact="true" to="/">
        <App></App>
      </Link>
      <Link exact="true" to="/login/callback">
        <LoginCallback />
      </Link>
    </Security>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <SecuredRoutes />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
