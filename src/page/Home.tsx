import React, { useState, useEffect, useCallback, useContext } from "react";
import { RemoteData, loading, resultToRemote } from "state/types";
import { GlubEvent, Enrollment } from "state/models";
import { get } from "utils/request";
import {
  RemoteContent,
  Container,
  Columns,
  Section,
  Title,
  Column,
  Box,
  Spinner,
  Tooltip
} from "components/Basics";
import { GlubHubContext } from "utils/context";
import { eventIsOver, romanNumeral } from "utils/helpers";
import { fullDateTimeFormatter, dateFormatter } from "utils/datetime";

export const Home: React.FC = () => {
  const [events, setEvents] = useState<RemoteData<GlubEvent[]>>(loading);
  const [hovered, setHovered] = useState<HoveredEvent | null>(null);

  const hoverOverEvent = useCallback(
    (newHovered: HoveredEvent | null) => {
      if (hovered?.event.id === newHovered?.event.id) {
        setHovered(null);
      } else {
        setHovered(newHovered);
      }
    },
    [setHovered, hovered]
  );

  useEffect(() => {
    const loadEvents = async () => {
      const result = await get<GlubEvent[]>(`events?full=true`);
      setEvents(resultToRemote(result));
    };

    loadEvents();
  }, [setEvents]);

  return (
    <RemoteContent
      data={events}
      render={events => {
        const [pastEvents, futureEvents] = organizeEvents(events);
        const finalGrade = events[events.length - 1].change?.partialScore;

        return (
          <>
            <GradesBlock
              finalGrade={finalGrade !== undefined ? finalGrade : 100}
              pastEvents={pastEvents}
            />
            {hovered && <EventHoverBox hovered={hovered} />}
            <Section>
              <Container>
                <Columns>
                  <UpcomingEvents futureEvents={futureEvents} />
                  <Volunteerism pastEvents={pastEvents} />
                </Columns>
              </Container>
            </Section>
          </>
        );
      }}
    />
  );
};

interface HoveredEvent {
  event: GlubEvent;
  x: number;
  y: number;
}

const timelineId = "timeline-box";

const attendanceIssueEmail =
  "mailto:gleeclub_officers@lists.gatech.edu?subject=Attendance%20Issue";

const organizeEvents = (events: GlubEvent[]): [GlubEvent[], GlubEvent[]] => {
  const sorted = events.sort((e1, e2) => e1.callTime - e2.callTime);

  return [sorted.filter(eventIsOver), sorted.filter(e => !eventIsOver(e))];
};

const attendanceMessage = (
  enrollment: Enrollment | null,
  finalGrade: number
): string => {
  if (!enrollment) {
    return "Do you even go here?";
  } else if (finalGrade >= 90.0) {
    return "Ayy lamo nice.";
  } else if (finalGrade >= 80.0) {
    return "OK not bad, I guess";
  } else if (finalGrade >= 70.0) {
    return "Pls";
  } else {
    return "BRUH get it together.";
  }
};

interface GradesBlockProps {
  pastEvents: GlubEvent[];
  finalGrade: number;
}

const GradesBlock: React.FC<GradesBlockProps> = ({
  pastEvents,
  finalGrade
}) => {
  const { user } = useContext(GlubHubContext);

  return (
    <Section>
      <Container>
        <Title>Score</Title>
        <p>
          Right now you have a <strong>{finalGrade}</strong>.
          <br />
          <span className="has-text-grey-light is-italic">
            {attendanceMessage(user?.enrollment || null, finalGrade)}
          </span>
        </p>
        {pastEvents.length ? (
          <>
            {/* {graphGrades} TODO: this */}
            <p>
              <br />
              Do you have an issue? Do you need a daddy tissue?{" "}
              <a href={attendanceIssueEmail}>Email the officers</a> to cry about
              it.
            </p>
          </>
        ) : (
          <>
            <p>New semester, new you! Make it count.</p>
            <br />
            <br />
          </>
        )}
      </Container>
    </Section>
  );
};

const EventHoverBox: React.FC<{ hovered: HoveredEvent }> = ({ hovered }) => (
  <div
    className="box shown"
    style={{
      position: "absolute",
      top: `${hovered.y}px`,
      left: `${hovered.x}px`,
      transform: "translateX(-50%)"
    }}
  >
    <p>
      <strong>{hovered.event.name}</strong>
    </p>
    <p>{fullDateTimeFormatter(hovered.event.callTime)}</p>
    <p>
      {hovered.event.change?.change || 0.0} points{" "}
      <span className="icon is-primary has-text-primary">
        <i className="fas fa-arrow-right" />
      </span>{" "}
      {hovered.event.change?.partialScore}%
    </p>
    <p>
      <em>{hovered.event.change?.reason}</em>
    </p>
  </div>
);

const UpcomingEvents: React.FC<{ futureEvents: GlubEvent[] }> = ({
  futureEvents
}) => (
  <Column>
    <Title>This Week</Title>
    <Box>
      <div className="timeline">
        <svg id={timelineId} width={500} height={500}>
          <Spinner />
        </svg>
      </div>
    </Box>
  </Column>
);

const Volunteerism: React.FC<{ pastEvents: GlubEvent[] }> = ({
  pastEvents
}) => {
  const { currentSemester } = useContext(GlubHubContext);
  const volunteerGigsAttended = pastEvents.filter(
    event => event.gigCount && !!event.attendance?.didAttend
  );
  const gigRequirement = currentSemester?.gigRequirement || 0;
  const metGigRequirement = volunteerGigsAttended.length >= gigRequirement;
  const gigList = metGigRequirement
    ? volunteerGigsAttended
    : [
        ...volunteerGigsAttended,
        ...new Array<GlubEvent | null>(gigRequirement).fill(null)
      ].slice(gigRequirement);

  return (
    <Column>
      <Title>Volunteerism</Title>
      <Box>
        {metGigRequirement ? (
          <p>
            The dedication! The passion! The attendance! You've been to{" "}
            {romanNumeral(volunteerGigsAttended.length)} volunteer gigs this
            semester. Glub salutes you and your volunteerism.
          </p>
        ) : (
          <p>
            OK so you've only been to{" "}
            {romanNumeral(volunteerGigsAttended.length)} volunteer gigs this
            semester and you need to go to {romanNumeral(gigRequirement)}. So.
            Uh, you know, do that.
          </p>
        )}
        <p style={{ textAlign: "center" }}>
          {gigList.map(gig => (
            <>
              <GigIcon gig={gig} />{" "}
            </>
          ))}
        </p>
      </Box>
    </Column>
  );
};

interface GigIconProps {
  gig: GlubEvent | null;
}

const GigIcon: React.FC<GigIconProps> = ({ gig }) => {
  if (gig) {
    return (
      <Tooltip content={`${gig.name} on ${dateFormatter(gig.callTime)}`}>
        <span className="icon is-large has-text-primary">
          <i className="far fa-2x fa-check-circle" />
        </span>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip content="Hopefully something soon...">
        <span className="icon is-large" style={{ color: "gray" }}>
          <i className="far fa-2x fa-frown" />
        </span>
      </Tooltip>
    );
  }
};
