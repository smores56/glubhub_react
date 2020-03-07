import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  notSentYet,
  loading,
  RemoteData,
  resultToRemote,
  sending,
  resultToSubmissionState,
  mapLoaded
} from "state/types";
import { fullName } from "utils/helpers";
import { get, post } from "utils/request";
import { EventAttendee } from "state/models";
import { GlubHubContext } from "utils/context";
import { RemoteContent, SubmissionStateBox } from "components/Basics";
import { CheckboxInput, TextInput, numberType } from "components/Forms";

export const Attendance: React.FC<{ eventId: number }> = ({ eventId }) => {
  const { info } = useContext(GlubHubContext);

  const [state, setState] = useState(notSentYet);
  const [attendees, setAttendees] = useState<RemoteData<EventAttendee[]>>(
    loading
  );

  const updateAttendance = useCallback(
    async (attendee: EventAttendee) => {
      setState(sending);
      setAttendees(
        mapLoaded(attendees, x =>
          x.map(a => (a.member.email === attendee.member.email ? attendee : a))
        )
      );

      const url = `events/${eventId}/attendance/${attendee.member.email}`;
      const resp = await post(url, attendee.attendance);

      setState(resultToSubmissionState(resp));
    },
    [attendees, eventId, setState]
  );

  useEffect(() => {
    const loadAttendees = async () => {
      const url = `events/${eventId}/see_whos_attending`;
      const resp = await get<EventAttendee[]>(url);
      setAttendees(resultToRemote(resp));
    };

    loadAttendees();
  }, [eventId]);

  return (
    <div>
      <RemoteContent
        data={attendees}
        render={attendees => (
          <table className="table is-fullwidth">
            {groupAttendees(attendees, info?.sections || []).map(group => (
              <>
                <thead>
                  <tr>
                    <td>{group.section}</td>
                    <td>Did Attend</td>
                    <td>Should Attend</td>
                    <td>Confirmed</td>
                    <td>Minutes Late</td>
                  </tr>
                </thead>
                <tbody>
                  {group.attendees.map(attendee => (
                    <AttendeeRow
                      attendee={attendee}
                      updateAttendee={updateAttendance}
                    />
                  ))}
                </tbody>
              </>
            ))}
          </table>
        )}
      />
      <SubmissionStateBox state={state} />
    </div>
  );
};

interface AttendeeRowProps {
  attendee: EventAttendee;
  updateAttendee: (a: EventAttendee) => void;
}

const AttendeeRow: React.FC<AttendeeRowProps> = ({
  attendee,
  updateAttendee
}) => (
  <tr className="no-bottom-border">
    <td>{fullName(attendee.member)}</td>
    <td>
      <CheckboxInput
        content=""
        checked={attendee.attendance.didAttend}
        onChange={didAttend =>
          updateAttendee({
            ...attendee,
            attendance: { ...attendee.attendance, didAttend }
          })
        }
      />
    </td>
    <td>
      <CheckboxInput
        content=""
        checked={attendee.attendance.shouldAttend}
        onChange={shouldAttend =>
          updateAttendee({
            ...attendee,
            attendance: { ...attendee.attendance, shouldAttend }
          })
        }
      />
    </td>
    <td>
      <CheckboxInput
        content=""
        checked={attendee.attendance.confirmed}
        onChange={confirmed =>
          updateAttendee({
            ...attendee,
            attendance: { ...attendee.attendance, confirmed }
          })
        }
      />
    </td>
    <td>
      <TextInput
        type={numberType}
        value={attendee.attendance.minutesLate}
        onInput={minutesLate =>
          updateAttendee({
            ...attendee,
            attendance: {
              ...attendee.attendance,
              minutesLate: minutesLate || 0
            }
          })
        }
      />
    </td>
  </tr>
);

interface AttendeeGroup {
  section: string;
  attendees: EventAttendee[];
}

const groupAttendees = (
  attendees: EventAttendee[],
  sections: string[]
): AttendeeGroup[] => {
  const noSection = "Homeless";

  const groups = new Map<string, EventAttendee[]>();
  attendees.forEach(attendee => {
    const section = attendee.member.section || noSection;
    const existingGroup = groups.get(section) || [];
    groups.set(section, [...existingGroup, attendee]);
  });

  return [...sections, noSection]
    .sort()
    .map(section => ({ section, attendees: groups.get(section)! }));
};
