import React from "react";
import { formatPhone } from "utils/helpers";

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

export const Column: React.FC<{ narrow?: boolean }> = ({
  narrow,
  children
}) => <div className={"column" + (narrow ? " is-narrow" : "")}>{children}</div>;

export const Box: React.FC = ({ children }) => (
  <div className="box">{children}</div>
);

export const Section: React.FC = ({ children }) => (
  <section className="section">{children}</section>
);

export const Container: React.FC = ({ children }) => (
  <div className="container">{children}</div>
);

interface TooltipProps {
  content: string;
  type?: "left" | "right" | "multiline";
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  type,
  children
}) => (
  <span
    style={{ cursor: "pointer" }}
    data-tooltip={content}
    className={"tooltip is-tooltip" + (type ? `is-tooltip-${type}` : "")}
  >
    {children}
  </span>
);

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
