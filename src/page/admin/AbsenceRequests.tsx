import React, { useState, useEffect, useCallback } from "react";
import {
  RemoteData,
  loading,
  notSentYet,
  resultToRemote,
  sending,
  checkSubmissionResult,
  loaded,
  mapLoaded,
  isLoaded,
} from "state/types";
import { Title, Box } from "components/Basics";
import { get, post } from "utils/request";
import { ButtonGroup, Button } from "components/Buttons";
import { AbsenceRequest, GlubEvent, AbsenceRequestState } from "state/models";
import { renderRoute, routeEvents, routeProfile } from "state/route";
import { dateFormatter, timeFormatter } from "utils/datetime";
import {
  RemoteContent,
  SubmissionStateBox,
  MemberName,
} from "components/Complex";
import { Table } from "components/Table";
import { useRemoteQuery } from "graphql/query";
import {
  ABSENCE_REQUESTS_FOR_SEMESTER,
  RESPOND_TO_ABSENCE_REQUEST,
} from "graphql/queries";
import { useStateMutation } from "graphql/remote_query";

interface AbsenceRequestWithEvent {
  member: string;
  time: number;
  reason: string;
  state: AbsenceRequestState;
  event: {
    id: number;
    name: string;
    callTime: string;
    location: string | null;
  };
}

interface RespondToRequest {
  approved: boolean;
  eventId: number;
  member: string;
}

export const AbsenceRequests: React.FC = () => {
  const { data } = useRemoteQuery<AbsenceRequestWithEvent[]>(
    ABSENCE_REQUESTS_FOR_SEMESTER
  );
  const [respondToRequest, { state }] = useStateMutation<any, RespondToRequest>(
    RESPOND_TO_ABSENCE_REQUEST,
    { refetchQueries: [{ query: ABSENCE_REQUESTS_FOR_SEMESTER }] }
  );

  const respondToAbsenceRequest = useCallback(
    async (request: AbsenceRequestWithEvent, action: "approve" | "deny") => {
      await respondToRequest({
        variables: {
          approved: action === "approve",
          member: request.member,
          eventId: request.event.id,
        },
      });
    },
    [respondToRequest]
  );

  return (
    <div style={{ width: "100%" }}>
      <Title>Open Absence Requests</Title>
      <Box>
        <RemoteContent
          data={mapLoaded(data, (x) => x.filter((r) => r.state === "PENDING"))}
          render={(requests) => (
            <AbsenceRequestTable
              requests={requests}
              respond={respondToAbsenceRequest}
            />
          )}
        />
      </Box>
      <Title>Closed Absence Requests</Title>
      <Box>
        <RemoteContent
          data={mapLoaded(data, (x) => x.filter((r) => r.state !== "PENDING"))}
          render={(requests) => (
            <AbsenceRequestTable
              requests={requests}
              respond={respondToAbsenceRequest}
            />
          )}
        />
      </Box>
      <SubmissionStateBox state={state} />
    </div>
  );
};

type RespondToAbsenceRequestFn = (
  request: AbsenceRequestWithEvent,
  action: "approve" | "deny"
) => Promise<void>;

interface AbsenceRequestTableProps {
  requests: AbsenceRequestWithEvent[];
  respond: RespondToAbsenceRequestFn;
}

const AbsenceRequestTable: React.FC<AbsenceRequestTableProps> = ({
  requests,
  respond,
}) => (
  <Table scrollable style={{ width: "100%" }}>
    <thead>
      <tr style={{ width: "100%" }}>
        <th>When Submitted</th>
        <th>Event Name</th>
        <th>Event Date</th>
        <th>Loser</th>
        <th>Excuse</th>
      </tr>
    </thead>
    <tbody>
      {requests.map((request) => (
        <>
          <AbsenceRequestRow request={request} />
          <AbsenceRequestButtons request={request} respond={respond} />
        </>
      ))}
    </tbody>
  </Table>
);

interface AbsenceRequestRowProps {
  request: AbsenceRequestWithEvent;
}

const AbsenceRequestRow: React.FC<AbsenceRequestRowProps> = ({ request }) => (
  <tr key={request.time} className="no-bottom-border">
    <td>
      {dateFormatter(request.time)}
      <br />
      {timeFormatter(request.time)}
    </td>
    <td>
      <a href={renderRoute(routeEvents(request.event.id, null))}>
        {request.event.name}
      </a>
    </td>
    <td>
      {dateFormatter(request.event.callTime)}
      <br />
      {timeFormatter(request.event.callTime)}
      <br />
      {request.event.location || ""}
    </td>
    <td>
      <a href={renderRoute(routeProfile(request.member, null))}>
        <MemberName email={request.member} />
      </a>
    </td>
    <td>
      <i>{`"${request.reason}"`}</i>
    </td>
  </tr>
);

interface AbsenceRequestButtonsProps {
  request: AbsenceRequestWithEvent;
  respond: RespondToAbsenceRequestFn;
}

const AbsenceRequestButtons: React.FC<AbsenceRequestButtonsProps> = ({
  request,
  respond,
}) => {
  let leftButton: JSX.Element;
  let rightButton: JSX.Element;

  switch (request.state) {
    case "PENDING":
      leftButton = (
        <Button onClick={() => respond(request, "deny")}>Get fukt nerd</Button>
      );
      rightButton = (
        <Button color="is-primary" onClick={() => respond(request, "approve")}>
          Bestow mercy
        </Button>
      );
      break;

    case "APPROVED":
      leftButton = (
        <Button onClick={() => respond(request, "deny")}>
          Jk get fukt nerd
        </Button>
      );
      rightButton = <Button>Mercy bestowed</Button>;
      break;

    case "DENIED":
      leftButton = <Button>Nerd got fukt</Button>;
      rightButton = (
        <Button
          style={{ whiteSpace: "normal", maxWidth: "150px", height: "initial" }}
          onClick={() => respond(request, "approve")}
        >
          I have heard your pleas and acquiesced to your request
        </Button>
      );
      break;
  }

  return (
    <tr className="no-bottom-border">
      <td colSpan={5}>
        <ButtonGroup alignment="is-right">
          {leftButton}
          {rightButton}
        </ButtonGroup>
      </td>
    </tr>
  );
};
