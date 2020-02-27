import React, { useState, useEffect } from "react";
import { RemoteData, loading, resultToRemote } from "../../utils/state";
import {
  EventCarpool,
  Member,
  GlubEvent,
  SimpleAttendance
} from "../../utils/models";
import { get } from "../../utils/request";
import {
  RemoteContent,
  RequiresPermission,
  AttendanceIcon
} from "../../components/Basics";
import { editCarpool } from "../../utils/permissions";
import { renderRoute, routeEditCarpools } from "../../utils/route";
import { fullName } from "../../utils/utils";

export const Carpools: React.FC<{ event: GlubEvent }> = ({ event }) => {
  const [carpools, setCarpools] = useState<RemoteData<EventCarpool[]>>(loading);

  useEffect(() => {
    const loadCarpools = async () => {
      const result = await get<EventCarpool[]>(`events/${event.id}/carpools`);
      setCarpools(resultToRemote(result));
    };

    loadCarpools();
  }, [event, setCarpools]);

  return (
    <RemoteContent
      data={carpools}
      render={carpools => (
        <>
          {carpools.length === 0 ? (
            <div>No carpools set for this event.</div>
          ) : (
            <ul>
              {carpools.map(carpool => (
                <table>
                  <CarpoolPartialTable carpool={carpool} event={event} />
                </table>
              ))}
            </ul>
          )}
          <RequiresPermission permission={editCarpool}>
            <div style={{ padding: "10px" }}>
              <a
                className="button"
                href={renderRoute(routeEditCarpools(event.id))}
              >
                Edit Carpools
              </a>
            </div>
          </RequiresPermission>
        </>
      )}
    />
  );
};

interface EditCarpoolSelection {
  selectedMembers: Member[];
  select: (member: Member) => void;
  selectEmptyCarpool: (carpool: EventCarpool) => void;
}

interface CarpoolTableBaseProps {
  event: GlubEvent;
  selection?: EditCarpoolSelection;
  includeIcon?: boolean;
}

interface CarpoolTablesProps extends CarpoolTableBaseProps {
  carpools: EventCarpool[];
}

export const CarpoolTables: React.FC<CarpoolTablesProps> = props => (
  <table>
    {props.carpools.map(carpool => (
      <CarpoolTable carpool={carpool} {...props} />
    ))}
  </table>
);

interface CarpoolTableProps extends CarpoolTableBaseProps {
  carpool: EventCarpool;
}

export const CarpoolTable: React.FC<CarpoolTableProps> = props => (
  <table>
    <CarpoolPartialTable {...props} />
  </table>
);

const CarpoolPartialTable: React.FC<CarpoolTableProps> = ({
  event,
  carpool,
  selection,
  includeIcon
}) => (
  <>
    <thead>
      <CarpoolRow
        member={carpool.driver}
        event={event}
        isDriver
        selection={selection}
        includeIcon={includeIcon}
      />
    </thead>
    <tbody>
      {carpool.passengers.length === 0 ? (
        <NoMembersRow select={() => selection?.selectEmptyCarpool(carpool)} />
      ) : (
        <>
          {carpool.passengers.map((passenger, index) => (
            <CarpoolRow
              member={passenger}
              event={event}
              selection={selection}
              includeIcon={includeIcon && index === 0}
            />
          ))}
        </>
      )}
    </tbody>
  </>
);

const NoMembersRow: React.FC<{ select: () => void }> = ({ select }) => (
  <tr>
    <td colSpan={5} style={{ width: "100%" }} onClick={select}>
      <article className="message">
        <div className="message-body">It sure is lonely here...</div>
      </article>
    </td>
  </tr>
);

interface CarpoolRowProps extends CarpoolTableBaseProps {
  member: Member;
  attendance?: SimpleAttendance;
  isDriver?: boolean;
}

const CarpoolRow: React.FC<CarpoolRowProps> = props => {
  const isSelected = props.selection?.selectedMembers.some(
    m => m.email === props.member.email
  );
  const passengerCount = props.member.passengers
    ? `${props.member.passengers}`
    : "";
  const ColumnElement: React.FC = ({ children }) =>
    props.isDriver ? <th>{children}</th> : <td>{children}</td>;

  return (
    <tr
      onClick={() => props.selection?.select(props.member)}
      style={{ cursor: "pointer", width: "100%", minWidth: "100%" }}
      className={isSelected ? "is-selected" : undefined}
    >
      <ColumnElement>
        {props.includeIcon && (
          <span className="icon">
            <i className={"fas fa-" + props.isDriver ? "user" : "users"} />
          </span>
        )}
      </ColumnElement>
      <ColumnElement>{fullName(props.member)}</ColumnElement>
      <ColumnElement>{props.member.location}</ColumnElement>
      <ColumnElement>{passengerCount}</ColumnElement>
      <ColumnElement>
        <AttendanceIcon
          event={{ ...props.event, attendance: props.attendance || null }}
        />
      </ColumnElement>
    </tr>
  );
};
