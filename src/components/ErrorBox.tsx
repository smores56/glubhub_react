import { GlubHubError } from "../utils/error";
import React from "react";
import { SUBMISSION_STATE_BOX_ID } from "../utils/constants";

interface ErrorBoxProps {
  error: GlubHubError;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error }) => {
  let title: string;
  let content: string;

  if (error.message === "login required") {
    title = "unauthorized";
    content = "You aren't allowed to be here! Go on, get!";
  } else if (error.message === "member not active yet") {
    title = "not active yet";
    content =
      "You're gonna need to confirm your account for the semester to do stuff.";
  } else if (error.message === "member already logged in") {
    title = "already logged in";
    content = "You tried to login twice, dummy. No need to work so hard.";
  } else if (error.message === "access forbidden") {
    title = error.requiredPermission
      ? `unable to ${error.requiredPermission}`
      : "forbidden";
    content =
      "Well, well, well, looks like you tried to do something you weren't allowed to. Go to your room!";
  } else if (error.message === "resource not found") {
    title = "resource not found";
    content =
      "I've looked everywhere, but I can't find what you're looking for...";
  } else if (error.message === "bad request") {
    title = "bad request";
    content = `I've got some bad news for ya: ${error.reason}`;
  } else if (error.message === "server error") {
    title = "server error";
    content = `Oh lordy, something terrible has come to pass: ${error.error}`;
  } else if (error.message === "database error") {
    title = "database error";
    content = `Don't shoot the messenger, but this came in from headquarters: ${error.error}`;
  } else if (error.message === "error connecting to database") {
    title = "connection error";
    content = `Blame my friend the database, for they have broken something: ${error.error}`;
  } else {
    title = `unknown error (status ${error.statusCode})`;
    content = `I don't even know what happened: ${error.error}`;
  }

  return (
    <article
      id={SUBMISSION_STATE_BOX_ID}
      className="message is-danger"
      style={{ paddingTop: "5px", paddingBottom: "5px" }}
    >
      <div className="message-header">
        <p>
          Something went wrong. (<i>{title}</i>)
        </p>
      </div>
      <div className="message-body">{content}</div>
    </article>
  );
};

export default ErrorBox;
