import React from "react";
import { SubmissionState, isSending, failedToSend } from "state/types";
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

const ModalButtons: React.FC<DeleteModalProps> = ({
  confirm,
  state,
  cancel
}) => (
  <footer className="modal-card-foot">
    <Button onClick={confirm} loading={isSending(state)} color="is-danger">
      Delete
    </Button>
    <Button onClick={cancel}>Cancel</Button>
    {failedToSend(state) && <ErrorBox error={state.error} />}
  </footer>
);

export default DeleteModal;
