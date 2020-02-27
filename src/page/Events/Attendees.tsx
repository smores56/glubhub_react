import React, { useState, useEffect } from "react";
import { RemoteData, loading, resultToRemote } from "../../utils/state";
import { EventAttendee } from "../../utils/models";
import { get } from "../../utils/request";
import { RemoteContent, Column, Title } from "../../components/Basics";
import { fullName } from "../../utils/utils";

const Attendees: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [attendees, setAttendees] = useState<RemoteData<EventAttendee[]>>(
    loading
  );

  useEffect(() => {
    const loadAttendees = async () => {
      const url = `events/${eventId}/see_whos_attending`;
      const resp = await get<EventAttendee[]>(url);
      setAttendees(resultToRemote(resp));
    };

    loadAttendees();
  }, [eventId, setAttendees]);

  return (
    <RemoteContent
      data={attendees}
      render={attendees => <AttendeeTables attendees={attendees} />}
    />
  );
};

const AttendeeTables: React.FC<{ attendees: EventAttendee[] }> = ({
  attendees
}) => {
  const { attending, notAttending } = separateAttendees(attendees);

  return (
    <Column>
      <Title centered>Attending</Title>
      <AttendeeTable {...attending} />
      <Title centered>Not Attending</Title>
      <AttendeeTable {...notAttending} />
    </Column>
  );
};

const AttendeeTable: React.FC<SeparateByConfirmed> = ({
  confirmed,
  notConfirmed
}) => (
  <table className="table is-fullwidth">
    <thead>
      <tr>
        <th>Confirmed</th>
        <th>Not Confirmed</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <AttendeeNameList attendees={confirmed} />
        <AttendeeNameList attendees={notConfirmed} />
      </tr>
    </tbody>
  </table>
);

const AttendeeNameList: React.FC<{ attendees: EventAttendee[] }> = ({
  attendees
}) => (
  <td style={{ width: "50%" }}>
    {attendees.map((attendee, index) => (
      <>
        {fullName(attendee.member)}
        {index !== attendees.length - 1 && <br />}
      </>
    ))}
  </td>
);

interface SeparateByAttending {
  attending: SeparateByConfirmed;
  notAttending: SeparateByConfirmed;
}

interface SeparateByConfirmed {
  confirmed: EventAttendee[];
  notConfirmed: EventAttendee[];
}

const separateAttendees = (attendees: EventAttendee[]): SeparateByAttending => {
  const attending = attendees.filter(a => a.attendance.shouldAttend);
  const notAttending = attendees.filter(a => !a.attendance.shouldAttend);

  return {
    attending: {
      confirmed: attending.filter(a => a.attendance.confirmed),
      notConfirmed: attending.filter(a => !a.attendance.confirmed)
    },
    notAttending: {
      confirmed: notAttending.filter(a => a.attendance.confirmed),
      notConfirmed: notAttending.filter(a => !a.attendance.confirmed)
    }
  };
};

export default Attendees;
