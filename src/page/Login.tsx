import React, { useState, useCallback, useContext } from "react";
import { Md5 } from "ts-md5";
import { setToken } from "utils/helpers";
import { Column, Box } from "components/Basics";
import { postReturning, NewToken } from "utils/request";
import { GlubHubContext, useGlubRoute } from "utils/context";
import { SubmitButton, LinkButton } from "components/Buttons";
import { notSentYet, sending, errorSending, isSending } from "state/types";
import { TextInput, emailType, passwordType, Control } from "components/Forms";
import { routeHome, routeForgotPassword, routeEditProfile } from "state/route";

export const Login: React.FC = () => {
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
    const body = { email, passHash: Md5.hashStr(password) };
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
        <Column narrow>
          <Box>
            <form onSubmit={submit}>
              <img style={{ width: "100%" }} alt="" src="./glubhub.svg" />
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
                <SubmitButton
                  color="is-primary"
                  fullwidth
                  loading={isSending(state)}
                >
                  I posit that I am worthy
                </SubmitButton>
                <br />
                <div className="field is-grouped is-grouped-centered is-expanded">
                  <Control>
                    <LinkButton route={routeForgotPassword}>
                      I have forgotten who I am
                    </LinkButton>
                  </Control>
                  <Control>
                    <LinkButton
                      route={routeEditProfile}
                      color="is-primary"
                      outlined
                    >
                      I am not anyone yet
                    </LinkButton>
                  </Control>
                </div>
              </div>
            </form>
          </Box>
        </Column>
      </div>
    </div>
  );
};
