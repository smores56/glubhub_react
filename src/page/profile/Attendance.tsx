import React, { useState, useCallback, useEffect } from "react";
import { Member, Grades, SimpleAttendance, GlubEvent } from "state/models";
import {
  RemoteData,
  loading,
  isLoaded,
  notSentYet,
  sending,
  mapLoaded,
  resultToRemote,
  resultToSubmissionState,
  loaded
} from "state/types";
import { get, post } from "utils/request";
import { RemoteContent, SubmissionStateBox } from "components/Basics";
import { renderRoute, routeEvents } from "state/route";
import { CheckboxInput, TextInput, numberType } from "components/Forms";
import { dateFormatter } from "utils/datetime";
import { useGlubRoute } from "utils/context";

export const Attendance: React.FC<{ member: Member }> = ({ member }) => {
  const [grades, updateGrades] = useState<RemoteData<Grades>>(loading);
  const [state, setState] = useState(notSentYet);

  const loadAttendance = useCallback(async () => {
    const result = await get<{ grades: Grades }>(
      `members/${member.email}?grades=true`
    );
    updateGrades(mapLoaded(resultToRemote(result), member => member.grades));
  }, [updateGrades, member]);

  const updateAttendance = useCallback(
    async (eventId: number, attendance: SimpleAttendance) => {
      if (!isLoaded(grades)) return;

      updateGrades(
        loaded({
          ...grades.data,
          eventsWithChanges: grades.data.eventsWithChanges.map(event =>
            event.id === eventId ? { ...event, attendance } : event
          )
        })
      );
      setState(sending);

      const url = `events/${eventId}/attendance/${member.email}`;
      const result = await post(url, attendance);

      setState(resultToSubmissionState(result));
      if (result.successful) {
        loadAttendance();
      }
    },
    [grades, member.email, setState, loadAttendance]
  );

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <>
      <RemoteContent
        data={grades}
        render={grades => (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event</th>
                <th>Type</th>
                <th>Should Attend?</th>
                <th>Did Attend?</th>
                <th>Minutes Late</th>
                <th>Point Change</th>
                <th>Partial Score</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {grades.eventsWithChanges.map(event => (
                <AttendanceRow event={event} update={updateAttendance} />
              ))}
            </tbody>
          </table>
        )}
      />
      <SubmissionStateBox state={state} />
    </>
  );
};

interface AttendanceRowProps {
  event: GlubEvent;
  update: (eventId: number, attendance: SimpleAttendance) => void;
}

const AttendanceRow: React.FC<AttendanceRowProps> = ({ event, update }) => {
  const { goToRoute } = useGlubRoute();

  const attendance = event.attendance || {
    shouldAttend: false,
    didAttend: false,
    confirmed: false,
    minutesLate: 0
  };

  return (
    <tr className="no-bottom-border">
      <td>{dateFormatter(event.callTime)}</td>
      <td>
        <a onClick={() => goToRoute(routeEvents(event.id, null))}>
          {event.name}
        </a>
      </td>
      <td>{event.type}</td>
      <td>
        <CheckboxInput
          content=""
          checked={attendance.shouldAttend}
          onChange={shouldAttend =>
            update(event.id, { ...attendance, shouldAttend })
          }
        />
      </td>
      <td>
        <CheckboxInput
          content=""
          checked={attendance.didAttend}
          onChange={didAttend => update(event.id, { ...attendance, didAttend })}
        />
      </td>
      <td>
        <TextInput
          type={numberType}
          value={attendance.minutesLate}
          onInput={minutesLate =>
            update(event.id, { ...attendance, minutesLate: minutesLate || 0 })
          }
          placeholder="0"
        />
      </td>
      <td>{event.change?.change}</td>
      <td>{event.change?.partialScore}</td>
      <td>{event.change?.reason}</td>
    </tr>
  );
};
