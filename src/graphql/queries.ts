import gql from "graphql-tag";
import { DocumentLink } from "state/models";

export const DOCUMENTS = gql`
  {
    documents {
      name
      url
    }
  }
`;

export const CREATE_DOCUMENT = gql`
  mutation createDocument($name: String!, $url: String!) {
    createDocument(name: $name, url: $url) {
      name
    }
  }
`;

export const UPDATE_DOCUMENT = gql`
  mutation updateDocument($name: String!, $url: String!) {
    updateDocument(name: $name, url: $url) {
      name
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation deleteDocument($name: String!) {
    deleteDocument(name: $name) {
      name
    }
  }
`;

export const ABSENCE_REQUESTS_FOR_SEMESTER = gql`
  {
    member
    time
    reason
    state
    event {
      id
      name
      callTime
      location
    }
  }
`;

export const RESPOND_TO_ABSENCE_REQUEST = gql`
  mutation respondToAbsenceRequest(
    $approved: Boolean!
    $eventId: Int!
    $member: String!
  ) {
    respondToAbsenceRequest(
      approved: $approved
      eventId: $eventId
      member: $member
    ) {
      member
    }
  }
`;
