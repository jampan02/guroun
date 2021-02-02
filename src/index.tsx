import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./tsx/views/pages/Login";
import Top from "./tsx/views/pages/top/Top";
import Profile from "./tsx/views/pages/profile/Profile";
import Main from "./tsx/views/pages/main/Main";
import Datas from "./tsx/views/pages/main/datas/Datas";
import ErrorPage from "./tsx/views/pages/errorpage/ErrorPage";
import ResetPassword from "./tsx/views/pages/resetPassword/ResetPassword";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/home" component={Top} exact />
          <Route path="/profile" component={Profile} exact />
          <Route path="/main" component={Main} exact />
          <Route path="/main/:id" component={Datas} exact />
          <Route path="/reset_password" component={ResetPassword} exact />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
