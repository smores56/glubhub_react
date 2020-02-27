import React, { useState, useCallback, useContext } from "react";
import { notSentYet, sending, errorSending } from "../utils/state";
import { GlubHubContext, useGlubRoute } from "../utils/context";
import { Md5 } from "ts-md5";
import { postReturning, NewToken } from "../utils/request";
import { setToken } from "../utils/utils";
import {
  routeHome,
  renderRoute,
  routeForgotPassword,
  routeEditProfile
} from "../utils/route";
import { NarrowColumn, Box } from "../components/Basics";
import {
  TextInput,
  emailType,
  passwordType,
  Control
} from "../components/Forms";

const Login: React.FC = () => {
  const { refreshAll } = useContext(GlubHubContext);
  const { goToRoute } = useGlubRoute();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(notSentYet);

  const onSuccessfulLogin = useCallback(
    async (token: string) => {
      setToken(token);
      await refreshAll();
      goToRoute(routeHome);
    },
    [refreshAll, goToRoute]
  );

  const submit = useCallback(async () => {
    setState(sending);
    const body = { email, password: Md5.hashStr(password) };
    const resp = await postReturning<typeof body, NewToken>("login", body);

    if (resp.successful) {
      onSuccessfulLogin(resp.data.token);
    } else if (resp.error.message === "member already logged in") {
      onSuccessfulLogin(resp.error.token);
    } else {
      setState(errorSending(resp.error));
      alert("Your username and/or password were incorrect.");
    }
  }, [email, password, setState, onSuccessfulLogin]);

  return (
    <div className="container fullheight">
      <div
        className="columns is-centered is-vcentered"
        style={{ display: "flex" }}
      >
        <NarrowColumn>
          <Box>
            <form onSubmit={submit}>
              <img style={{ width: "100%" }} src="./glubhub.svg" />
              <TextInput
                type={emailType}
                value={email}
                onInput={setEmail}
                title="Who are you?"
                placeholder="gburdell3@gatech.edu"
              />
              <TextInput
                type={passwordType}
                value={password}
                onInput={setPassword}
                title="Oh yeah? Prove it."
                placeholder="••••••••"
              />

              <div>
                <button
                  type="submit"
                  className={
                    "is-primary is-fullwidth" +
                    (state.state === "sending" ? " is-loading" : "")
                  }
                >
                  I posit that I am worthy
                </button>
                <br />
                <div className="field is-grouped is-grouped-centered is-expanded">
                  <Control>
                    <a
                      className="button"
                      href={renderRoute(routeForgotPassword)}
                    >
                      I have forgotten who I am
                    </a>
                  </Control>
                  <Control>
                    <a
                      className="button is-primary is-outlined"
                      href={renderRoute(routeEditProfile)}
                    >
                      I am not anyone yet
                    </a>
                  </Control>
                </div>
              </div>
            </form>
          </Box>
        </NarrowColumn>
      </div>
    </div>
  );
};

export default Login;
