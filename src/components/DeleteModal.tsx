import React from "react";
import { SubmissionState } from "state/types";
import ErrorBox from "./ErrorBox";
import { DeleteButton, Button } from "./Buttons";

export interface DeleteModalProps {
  title: String;
  cancel: () => void;
  confirm: () => void;
  state: SubmissionState;
}

const DeleteModal: React.FC<DeleteModalProps> = props => (
  <div className="modal is-active">
    <div className="modal-background" onClick={props.cancel} />
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{props.title}</p>
        <DeleteButton click={props.cancel} />
      </header>
      <section className="modal-card-body">{props.children}</section>
      <ModalButtons {...props} />
    </div>
  </div>
);

const ModalButtons: React.FC<DeleteModalProps> = props => (
  <footer className="modal-card-foot">
    <Button
      onClick={props.confirm}
      loading={props.state.status === "sending"}
      color="is-danger"
    >
      Delete
    </Button>
    <Button onClick={props.cancel}>Cancel</Button>
    {props.state.status === "errorSending" && (
      <ErrorBox error={props.state.error} />
    )}
  </footer>
);

export default DeleteModal;
