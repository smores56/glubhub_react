import gql from "graphql-tag";

const memberFragment = gql`
  fragment memberFields on Member {
    email
    firstName
    preferredName
    lastName
    phoneNumber
    picture
    passengers
    location
    onCampus
    about
    major
    minor
    hometown
    arrivedAtTech
    gatewayDrug
    conflicts
    dietaryRestrictions
    semester
    enrollment
    section
  }
`;

const eventFragment = gql`
  fragment eventFields on Event {
    id
    name
    semester
    type
    callTime
    releaseTime
    points
    comments
    location
    gigCount
    defaultAttend
    section
    gig
    userAttendance
  }
`;

const absenceRequestFragment = gql`
  fragment absenceRequestFields on AbsenceRequest {
    1
  }
`;