import { GlubEvent, AbsenceRequest } from "../../utils/models";
import { useState, useCallback, useContext } from "react";
import { notSentYet, errorSending, sending } from "../../utils/state";
import { post, success } from "../../utils/request";
import { BackButton, ButtonGroup } from "../../components/Buttons";
import { Subtitle, Title } from "../../components/Basics";
import React from "react";
import { TextareaInput } from "../../components/Forms";
import ErrorBox from "../../components/ErrorBox";
import { GlubHubContext } from "../../utils/context";

interface RequestAbsenceProps {
  event: GlubEvent;
  cancel: () => void;
  success: (request: AbsenceRequest) => void;
}

export const RequestAbsence: React.FC<RequestAbsenceProps> = props => {
  const { user } = useContext(GlubHubContext);

  const [reason, setReason] = useState("");
  const [state, setState] = useState(notSentYet);

  const submit = useCallback(async () => {
    setState(sending);

    const body = { reason };
    const url = `absence_requests/${props.event.id}`;
    const resp = await post(url, body);

    if (resp.successful) {
      const newRequest = {
        member: user?.email || "",
        event: props.event.id,
        time: new Date().getTime(),
        reason,
        state: "Pending"
      };
      success(newRequest);
    } else {
      setState(errorSending(resp.error));
    }
  }, [setState, reason, props, user]);

  return (
    <div>
      <BackButton content="back to event" click={props.cancel} />
      <Title centered>Absence Request</Title>
      <Subtitle centered>for {props.event.name}</Subtitle>
      <br />
      <form onSubmit={submit}>
        <TextareaInput
          value={reason}
          onInput={setReason}
          title="But y tho"
          placeholder="Excuses, excuses"
          required
        />
        <ButtonGroup alignment="is-right">
          <button
            type="submit"
            className={
              "is-primary" + state.state === "loading" ? " is-loading" : ""
            }
          >
            Beg for Mercy
          </button>
        </ButtonGroup>
      </form>
      {state.state === "errorSending" && <ErrorBox error={state.error} />}
    </div>
  );
};
