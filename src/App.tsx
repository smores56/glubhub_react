import "./App.css";
import React from "react";

import { useGlubRoute, GlubHubContextProvider } from "utils/context";
import { Admin } from "page/admin/Page";
import { EditCarpools } from "page/events/EditCarpools";
import { EditProfile } from "page/EditProfile";
import { Events } from "page/events/Page";
import { ForgotPassword } from "page/ForgotPassword";
import Login from "page/Login";
import { Minutes } from "page/minutes/Page";
import { Profile } from "page/profile/Page";
import { Repertoire } from "page/repertoire/Page";
import { ResetPassword } from "page/ResetPassword";
import { Roster } from "page/Roster";
import { Navbar } from "components/Navbar";
import { ConfirmAccountHeader } from "components/ConfirmAccount";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Home } from "page/Home";

const history = createBrowserHistory();

const App: React.FC = () => (
  <GlubHubContextProvider>
    <Router history={history}>
      <div id="app">
        <Navbar />
        <ConfirmAccountHeader />
        <div style={{ paddingBottom: "50px" }} />
        <div className="center" style={{ height: "100%" }}>
          <CurrentPage />
        </div>
      </div>
    </Router>
  </GlubHubContextProvider>
);

export default App;

const CurrentPage: React.FC = () => {
  const { location } = useGlubRoute();

  switch (location?.route) {
    case "admin":
      return <Admin tab={location.tab} />;

    case "edit-carpools":
      return <EditCarpools eventId={location.eventId} />;

    case "edit-profile":
      return <EditProfile />;

    case "events":
      return <Events eventId={location.eventId} tab={location.tab} />;

    case "forgot-password":
      return <ForgotPassword />;

    case "login":
      return <Login />;

    case "minutes":
      return <Minutes minutesId={location.minutesId} tab={location.tab} />;

    case "profile":
      return <Profile email={location.email} tab={location.tab} />;

    case "repertoire":
      return <Repertoire songId={location.songId} />;

    case "reset-password":
      return <ResetPassword token={location.token} />;

    case "roster":
      return <Roster />;

    default:
      return <Home />;
  }
};
