import React, { useState, useCallback, useEffect } from "react";
import {
  RouteEvents,
  routeEvents,
  EventTab,
  eventDetails,
  eventSetlist,
  eventCarpools,
  eventAttendees,
  eventAttendance
} from "../../utils/route";
import { useGlubRoute } from "../../utils/context";
import {
  RemoteData,
  loading,
  notAsked,
  loaded,
  errorLoading,
  resultToRemote,
  mapLoaded
} from "../../utils/state";
import { GlubEvent, GlubEventType } from "../../utils/models";
import { get } from "../../utils/request";
import {
  Section,
  Sidebar,
  Title,
  RequiresPermission,
  Columns,
  AttendanceIcon,
  Divider
} from "../../components/Basics";
import { BackButton } from "../../components/Buttons";
import Attendance from "./Attendance";
import Attendees from "./Attendees";
import { Setlist } from "./Setlist";
import { Carpools } from "./Carpools";
import { RequestAbsence } from "./RequestAbsence";
import { editAttendance } from "../../utils/permissions";
import { SelectableList } from "../../components/List";
import { eventIsOver } from "../../utils/utils";
import { EditEvent } from "./Edit/Page";

export const Events: React.FC<{ route: RouteEvents }> = ({ route }) => {
  const { replaceRoute } = useGlubRoute();

  const [events, setEvents] = useState<RemoteData<GlubEvent[]>>(loading);
  const [selected, setSelected] = useState<RemoteData<GlubEvent>>(notAsked);

  const selectEvent = useCallback(
    (event: GlubEvent) => {
      setSelected(loaded(event));
      replaceRoute(routeEvents(event.id, null));
    },
    [setSelected, replaceRoute]
  );

  const unselectEvent = useCallback(() => {
    setSelected(notAsked);
    replaceRoute(routeEvents(null, null));
  }, [setSelected, replaceRoute]);

  const changeTab = useCallback(
    (tab: EventTab) => {
      if (selected.state === "loaded") {
        replaceRoute(routeEvents(selected.data.id, tab));
      }
    },
    [selected, replaceRoute]
  );

  const loadEvent = useCallback(
    async (eventId: number) => {
      const result = await get<GlubEvent>(`events/${eventId}`);

      if (result.successful) {
        selectEvent(result.data);
      } else {
        setSelected(errorLoading(result.error));
      }
    },
    [setSelected, selectEvent]
  );

  const propagateEventUpdate = useCallback(
    (event: GlubEvent) => {
      setSelected(loaded(event));
      setEvents(
        mapLoaded(events, x => x.map(e => (e.id === event.id ? event : e)))
      );
    },
    [events, setEvents, setSelected]
  );

  useEffect(() => {
    const loadEvents = async () => {
      const result = await get<GlubEvent[]>("events?attendance=true");
      setEvents(mapLoaded(resultToRemote(result), events => events.reverse()));
    };

    loadEvents();
    if (route.eventId !== null) {
      loadEvent(route.eventId);
    }
  }, [setEvents, route, loadEvent]);

  const selectedId = selected.state === "loaded" ? selected.data.id : null;
  const upcomingEvents = mapLoaded(events, x =>
    x.filter(event => !eventIsOver(event))
  );
  const pastEvents = mapLoaded(events, x => x.filter(eventIsOver));

  return (
    <>
      <Section>
        <EventColumns
          events={upcomingEvents}
          selectedId={selectedId}
          onSelect={selectEvent}
        />
        <Divider content="Past" />
        <EventColumns
          events={pastEvents}
          selectedId={selectedId}
          onSelect={selectEvent}
        />
      </Section>
      <Sidebar
        data={selected}
        close={unselectEvent}
        render={event => (
          <TabContent
            tab={route.tab}
            event={event}
            changeTab={changeTab}
            unselectEvent={unselectEvent}
            updateEvent={propagateEventUpdate}
          />
        )}
      />
    </>
  );
};

//         ( OnDeleteEvent eventId, _ ) ->
//             ( { model
//                 | selected = NotAsked
//                 , events = model.events |> mapLoaded (List.filter (\e -> e.id /= eventId))
//               }
//             , Cmd.none
//             )

//         ( OnEditEvent event, _ ) ->
//             let
//                 eventMapper e =
//                     if e.id == event.id then
//                         event

//                     else
//                         e

//                 updatedModel =
//                     { model
//                         | selected = model.selected |> mapLoaded (Tuple.mapFirst (\_ -> event))
//                         , events = model.events |> mapLoaded (List.map eventMapper)
//                     }
//             in
//             changeTab event EventDetails updatedModel

interface EventColumnsProps {
  events: RemoteData<GlubEvent[]>;
  selectedId: number | null;
  onSelect: (event: GlubEvent) => void;
}

const EventColumns: React.FC<EventColumnsProps> = ({
  events,
  selectedId,
  onSelect
}) => {
  const column = (title: string, allowedEventTypes: GlubEventType[]) => (
    <SelectableList
      title={title}
      listItems={mapLoaded(events, all => [
        all.filter(event => allowedEventTypes.includes(event.type))
      ])}
      isSelected={event => event.id === selectedId}
      onSelect={onSelect}
      render={event => <EventRow event={event} />}
      messageIfEmpty="No events here, misster."
    />
  );

  return (
    <Columns>
      {column("Volunteer", ["Volunteer Gig"])}
      {column("Rehearsal", ["Rehearsal", "Sectional"])}
      {column("Tutti", ["Tutti Gig"])}
      {column("Ombuds", ["Ombuds", "Other"])}
    </Columns>
  );
};

const EventRow: React.FC<{ event: GlubEvent }> = ({ event }) => (
  <>
    <td style={{ textAlign: "center" }}>
      <AttendanceIcon event={event} />
    </td>
    <td>{simpleDateFormatter(event.callTime)}</td>
    <td>{event.name}</td>
  </>
);

interface EventTabsProps {
  event: GlubEvent;
  currentTab: EventTab | null;
  changeTab: (tab: EventTab) => void;
}

const EventTabs: React.FC<EventTabsProps> = props => {
  const isGig = !!(
    "performanceTime" in props.event && props.event.performanceTime
  );

  return (
    <div className="tabs">
      <ul>
        <TabLink tab={eventDetails} {...props} />
        <TabLink tab={eventAttendees} {...props} />
        {isGig && <TabLink tab={eventSetlist} {...props} />}
        {isGig && <TabLink tab={eventCarpools} {...props} />}
        <RequiresPermission permission={editAttendance}>
          <TabLink tab={eventAttendance} {...props} />
        </RequiresPermission>
      </ul>
    </div>
  );
};

interface TabLinkProps {
  tab: EventTab;
  currentTab: EventTab | null;
  changeTab: (tab: EventTab) => void;
}

const TabLink: React.FC<TabLinkProps> = ({ tab, currentTab, changeTab }) => (
  <li className={tab.route === currentTab?.route ? "is-active" : undefined}>
    <a onClick={() => changeTab(tab)}>{tab.name}</a>
  </li>
);

interface TabContentProps {
  event: GlubEvent;
  tab: EventTab | null;
  unselectEvent: () => void;
  changeTab: (tab: EventTab) => void;
  updateEvent: (event: GlubEvent) => void;
}

const TabContent: React.FC<TabContentProps> = props => {
  const header = (
    <>
      <BackButton content="all events" click={props.unselectEvent} />
      <Title centered>{props.event.name}</Title>
      <EventTabs
        event={props.event}
        changeTab={props.changeTab}
        currentTab={props.tab}
      />
    </>
  );

  switch (props.tab?.route) {
    case "attendance":
      return (
        <>
          {header}
          <Attendance eventId={props.event.id} />
        </>
      );

    case "attendees":
      return (
        <>
          {header}
          <Attendees eventId={props.event.id} />
        </>
      );

    case "setlist":
      return (
        <>
          {header}
          <Setlist eventId={props.event.id} />
        </>
      );

    case "carpools":
      return (
        <>
          {header}
          <Carpools event={props.event} />
        </>
      );

    case "request-absence":
      return (
        <RequestAbsence
          event={props.event}
          cancel={() => props.changeTab(eventDetails)}
          success={absenceRequest =>
            props.updateEvent({ ...props.event, absenceRequest })
          }
        />
      );

    case "edit":
      return (
        <>
          <BackButton
            content="cancel editing"
            click={() => props.changeTab(eventDetails)}
          />
          <EditEvent event={props.event} updateEvent={props.updateEvent} />
        </>
      );

    default:
      return (
        <>
          {header}
          <Details event={props.event} />
        </>
      );
  }
};
