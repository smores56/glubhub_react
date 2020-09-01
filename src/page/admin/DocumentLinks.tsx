import React, { useState } from "react";
import { useCombinedSubmissionStates } from "state/types";
import { DocumentLink, emptyDocumentLink } from "state/models";
import { Title, Box } from "components/Basics";
import { TextInput, stringType } from "components/Forms";
import { Button, DeleteButton } from "components/Buttons";
import { RemoteContent, SubmissionStateBox } from "components/Complex";
import { useRemoteQuery, useStateMutation } from "graphql/remote_query";
import {
  DOCUMENTS,
  UPDATE_DOCUMENT,
  DELETE_DOCUMENT,
  CREATE_DOCUMENT,
} from "graphql/queries";

export const DocumentLinks: React.FC = () => {
  const { data } = useRemoteQuery<{ documents: DocumentLink[]; }>(DOCUMENTS);
  const [newLink, updateNewLink] = useState<DocumentLink>(emptyDocumentLink);

  const [updateDocument, { state: updateState }] = useStateMutation<
    any,
    DocumentLink
  >(UPDATE_DOCUMENT, { refetchQueries: [{ query: DOCUMENTS }] });
  const [
    deleteDocument,
    { state: deleteState },
  ] = useStateMutation(DELETE_DOCUMENT, {
    refetchQueries: [{ query: DOCUMENTS }],
  });
  const [createDocument, { state: createState }] = useStateMutation(
    CREATE_DOCUMENT,
    {
      onCompleted: () => updateNewLink(emptyDocumentLink),
      refetchQueries: [{ query: DOCUMENTS }],
    }
  );

  const state = useCombinedSubmissionStates(
    updateState,
    deleteState,
    createState
  );

  return (
    <>
      <Title>Document Links</Title>
      <Box>
        <RemoteContent
          data={data}
          render={(data) => (
            <table style={{ borderSpacing: "5px", borderCollapse: "separate" }}>
              {data.documents.map((link) => (
                <tr key={link.name}>
                  <td style={{ paddingRight: "10px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      {link.name}
                    </span>
                  </td>
                  <td>
                    <TextInput
                      type={stringType}
                      value={link.url}
                      onInput={(url) =>
                        updateDocument({ variables: { ...link, url } })
                      }
                      placeholder="URL"
                    />
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        verticalAlign: "middle",
                      }}
                    >
                      <DeleteButton
                        click={() =>
                          deleteDocument({ variables: { name: link.name } })
                        }
                      />
                    </span>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <b>New</b>
                </td>
              </tr>
              <NewLinkRow
                newLink={newLink}
                update={updateNewLink}
                create={() => {
                  if (newLink.name && newLink.url) {
                    createDocument({ variables: newLink });
                  }
                }}
              />
            </table>
          )}
        />
        <SubmissionStateBox state={state} />
      </Box>
    </>
  );
};

interface NewLinkRowProps {
  newLink: DocumentLink;
  create: () => void;
  update: (link: DocumentLink) => void;
}

const NewLinkRow: React.FC<NewLinkRowProps> = ({ newLink, update, create }) => (
  <tr>
    <td>
      <TextInput
        type={stringType}
        value={newLink.name}
        onInput={(name) => update({ ...newLink, name })}
        placeholder="Name"
      />
    </td>
    <td>
      <TextInput
        type={stringType}
        value={newLink.url}
        onInput={(url) => update({ ...newLink, url })}
        placeholder="URL"
      />
    </td>
    <td>
      <Button onClick={create}>sí</Button>
    </td>
  </tr>
);
