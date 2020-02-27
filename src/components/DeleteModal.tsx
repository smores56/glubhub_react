import React from "react";
import { SubmissionState } from "../utils/state";
import ErrorBox from "./ErrorBox";
import { DeleteButton } from "./Buttons";

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
    {/* [ Buttons.button
            { content = "Delete"
            , onClick = Just data.confirm
            , attrs =
                [ Buttons.IsLoading (data.state == Sending)
                , Buttons.Color Buttons.IsDanger
                ]
            }
        , Buttons.button
            { content = "Cancel"
            , onClick = Just data.cancel
            , attrs = []
            } */}
    {props.state.state === "errorSending" && (
      <ErrorBox error={props.state.error} />
    )}
  </footer>
);

export default DeleteModal;
