import React, { useContext, PropsWithChildren } from "react";
import { formatPhone, eventIsOver, permittedTo } from "../utils/utils";
import { Member, GlubEvent } from "../utils/models";
import { RemoteData, SubmissionState } from "../utils/state";
import ErrorBox from "./ErrorBox";
import { GlubHubContext } from "../utils/context";

export const Spinner: React.FC = () => (
  <div className="spinner">
    <div className="spinner-inner">
      <i className="oldgold-text fas fa-circle-notch fa-2x fa-spin" />
    </div>
  </div>
);

interface CenteredProps {
  centered?: boolean;
}

export const Title: React.FC<CenteredProps> = ({ centered, children }) => (
  <h1 className="title" style={centered ? { textAlign: "center" } : undefined}>
    {children}
  </h1>
);

export const Title4: React.FC = ({ children }) => (
  <h4 className="title is-4">{children}</h4>
);

export const Subtitle: React.FC<CenteredProps> = ({ centered, children }) => (
  <h3
    className="subtitle is-3"
    style={centered ? { textAlign: "center" } : undefined}
  >
    {children}
  </h3>
);

export const Columns: React.FC = ({ children }) => (
  <div className="columns">{children}</div>
);

export const Column: React.FC = ({ children }) => (
  <div className="column">{children}</div>
);

export const NarrowColumn: React.FC = ({ children }) => (
  <div className="column is-narrow">{children}</div>
);

export const Box: React.FC = ({ children }) => (
  <div className="box">{children}</div>
);

export const Section: React.FC = ({ children }) => (
  <section className="section">{children}</section>
);

export const Container: React.FC = ({ children }) => (
  <div className="container">{children}</div>
);

// tooltip : String -> List (Html.Attribute msg)
// tooltip content =
//     [ class "tooltip is-tooltip"
//     , style "cursor" "pointer"
//     , attribute "data-tooltip" content
//     ]

// tooltipRight : String -> List (Html.Attribute msg)
// tooltipRight content =
//     class "is-tooltip-right" :: tooltip content

// multilineTooltip : String -> List (Html.Attribute msg)
// multilineTooltip content =
//     class "is-tooltip-multiline" :: tooltip content

export const CheckOrCross: React.FC<{ checked: boolean }> = ({ checked }) => (
  <span className="icon is-medium">
    <i className={"fas fa-lg fa-" + (checked ? "check" : "times")} />
  </span>
);

export interface DividerProps {
  vertical?: boolean;
  content?: string;
}

export const Divider: React.FC<DividerProps> = ({ vertical, content }) => {
  const className = vertical ? "is-divider-vertical" : "is-divider";

  if (content) {
    return <div className={className} data-content={content} />;
  } else {
    return <div className={className} />;
  }
};

export const EmailLink: React.FC<{ email: string }> = ({ email }) => (
  <a href={"mailto:" + email}>{email}</a>
);

export const PhoneLink: React.FC<{ phone: string }> = ({ phone }) => (
  <a href={"tel:" + phone}>{formatPhone(phone)}</a>
);

export const AttendanceIcon: React.FC<{ event: GlubEvent }> = ({ event }) => {
  if (!event.attendance || eventIsOver(event)) {
    return <></>;
  }

  const colorClass = event.attendance.confirmed
    ? "has-text-success"
    : "has-text-grey";
  const tooltipContent = `${
    event.attendance.confirmed ? "confirmed" : "unconfirmed"
  }, ${event.attendance.shouldAttend ? "attending" : "not attending"}`;

  // TODO: tooltip right with the above content

  return (
    <div className={colorClass}>
      <CheckOrCross checked={event.attendance.shouldAttend} />
    </div>
  );
};

interface RemoteContentProps<T> {
  data: RemoteData<T>;
  render: (data: T) => JSX.Element;
  notAsked?: JSX.Element;
}

export const RemoteContent = <T extends any>({
  data,
  render,
  notAsked
}: PropsWithChildren<RemoteContentProps<T>>) => {
  switch (data.state) {
    case "notAsked":
      return notAsked || <></>;

    case "loading":
      return <Spinner />;

    case "loaded":
      return render(data.data);

    case "errorLoading":
      return <ErrorBox error={data.error} />;
  }
};

export const RequiresPermission: React.FC<{ permission: string }> = ({
  permission,
  children
}) => {
  const { user } = useContext(GlubHubContext);

  return user && permittedTo(user, permission) ? <>{children}</> : <></>;
};

interface SidebarProps<T> {
  data: RemoteData<T>;
  render: (data: T) => JSX.Element;
  close: () => void;
}

export const Sidebar = <T extends any>({
  data,
  render,
  close
}: PropsWithChildren<SidebarProps<T>>) => {
  if (data.state === "notAsked") {
    return <div className="sidenav" hidden />;
  }

  return (
    <div>
      <div className="transparent-overlay" onClick={close} />
      <div className="sidenav" style={{ padding: "20px", paddingTop: "80px" }}>
        {data.state === "loading" ? (
          <Spinner />
        ) : data.state === "loaded" ? (
          render(data.data)
        ) : (
          <ErrorBox error={data.error} />
        )}
      </div>
    </div>
  );
};

export const SubmissionStateBox: React.FC<{ state: SubmissionState }> = ({
  state
}) => {
  switch (state.state) {
    case "notSentYet":
      return <></>;

    case "sending":
      return <Spinner />;

    case "errorSending":
      return <ErrorBox error={state.error} />;
  }
};

export const Modal: React.FC<{ close: () => void }> = ({ close, children }) => (
  <div className="modal is-active">
    <div className="modal-background" onClick={close} />
    <div className="modal-content" style={{ textAlign: "center" }}>
      <Box>{children}</Box>
    </div>
  </div>
);
