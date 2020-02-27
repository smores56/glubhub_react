import React, { useState, useCallback } from 'react';
import { EventTab } from '../../utils/route';
import { SubmissionState, notSentYet, sending, errorSending } from '../../utils/state';
import { post, deleteRequest } from '../../utils/request';
import { GlubEvent, SimpleAttendance, Uniform, Gig } from '../../utils/models';
import { eventIsOver, isGig } from '../../utils/utils';
import { RequiresPermission, Divider, PhoneLink, EmailLink } from '../../components/Basics';
import { viewEventPrivateDetails } from '../../utils/permissions';
import DeleteModal from '../../components/DeleteModal';

interface DetailsProps {
    event: GlubEvent;
    deletedEvent: () => void;
    switchTab: (tab: EventTab) => void;
    updateEvent: (event: GlubEvent) => void;
}

export const Details: React.FC<DetailsProps> = ({event, updateEvent, deletedEvent, switchTab}) => {
    const [deleteState, setDeleteState] = useState<SubmissionState | null>(null);
    const [rsvpState, setRsvpState] = useState<SubmissionState>(notSentYet);

    const updateAttending = useCallback(async (url: string, attending: boolean) => {
        if (!event.attendance) return;
    
        setRsvpState(sending);
        const result = await post(url, {});
        
        if (result.successful) {
            setRsvpState(notSentYet);
            updateEvent({...event, attendance: { ...event.attendance, confirmed: true, shouldAttend: attending }});
        } else {
            setRsvpState(errorSending(result.error))
        }
    }, [event, setRsvpState, updateEvent]);

    const rsvp = useCallback(
        (attending: boolean) =>
            updateAttending(`events/${event.id}/rsvp/${attending}`, attending),
    [event, updateAttending]);
        
    const confirm = useCallback(
        () => updateAttending(`events/${event.id}/confirm`, true),
    [event, updateAttending]);

    const deleteEvent = useCallback( async () => {
        setDeleteState(sending);
        const result = await deleteRequest(`events/${event.id}`);

        if (result.successful) {
            deletedEvent();
        } else {
            setDeleteState(errorSending(result.error));
        }
    }, [event, deletedEvent, setDeleteState]);

    return (
        <div>

        </div>
    )

    div [] <|
        List.concat
            [ [ subtitleAndLocation model.common model.event ]
            , model.event.comments
                |> maybeToList
                    (\comments ->
                        p [] [ text comments, br [] [], br [] [] ]
                    )
            , [ span [] <| attendanceBlock model ]
            , model.event.gig
                |> Maybe.map .performanceTime
                |> maybeToList
                    (\performanceTime ->
                        p []
                            [ text "Perform at: "
                            , text
                                (performanceTime
                                    |> timeFormatter model.common.timeZone
                                )
                            ]
                    )
            , [ p []
                    [ text "This event is worth "
                    , b []
                        [ text <| String.fromInt model.event.points
                        , text " points"
                        ]
                    ]
              ]
            , model.event.section
                |> maybeToList
                    (\section ->
                        p [] [ text <| "This event is for the " ++ section ++ " section" ]
                    )
            , model.event.gig
                |> Maybe.map .uniform
                |> Maybe.andThen (\id -> model.common.info.uniforms |> find (\uniform -> uniform.id == id))
                |> maybeToList uniformSection
            , [ absenceRequestButton model.common model.event ]
            , [ officerInfoSection model ]
            , [ case model.state of
                    ErrorSending error ->
                        Basics.errorBox error

                    _ ->
                        text ""
              ]
            ]
};






// type InternalMsg
//     = Rsvp Bool
//     | ConfirmAttending
//     | OnRsvp (GreaseResult Bool)
//     | TryToDeleteEvent
//     | CancelDeleteEvent
//     | SendDeleteEvent
//     | OnDeleteEvent (GreaseResult ())


// type OutMsg
//     = DeleteEvent Int
//     | EditEvent Event
//     | SwitchTab EventTab



// update : InternalMsg -> Model -> ( Model, Cmd Msg )
// update msg model =
//     case msg of
//         Rsvp attending ->
//             ( { model | state = Sending }, rsvp model.common model.event.id attending )

//         ConfirmAttending ->
//             ( { model | state = Sending }, confirm model.common model.event.id )

//         OnRsvp (Err error) ->
//             ( { model | state = ErrorSending error }, Cmd.none )

//         OnRsvp (Ok attending) ->
//             let
//                 event =
//                     model.event

//                 attendance =
//                     model.event.attendance
//                         |> Maybe.map (\a -> { a | confirmed = True, shouldAttend = attending })
//             in
//             ( { model | state = NotSentYet, event = { event | attendance = attendance } }
//             , Task.perform (\_ -> ForParent <| EditEvent { event | attendance = attendance }) (Task.succeed ())
//             )

//         TryToDeleteEvent ->
//             ( { model | deleteState = Just NotSentYet }, Cmd.none )

//         CancelDeleteEvent ->
//             ( { model | deleteState = Nothing }, Cmd.none )

//         SendDeleteEvent ->
//             ( { model | deleteState = Just Sending }, deleteEvent model.common model.event.id )

//         OnDeleteEvent (Ok _) ->
//             ( model, Task.perform (\_ -> ForParent <| DeleteEvent model.event.id) (Task.succeed ()) )

//         OnDeleteEvent (Err error) ->
//             ( { model | deleteState = Just <| ErrorSending error }, Cmd.none )


view : Model -> Html Msg
view model =
    div [] <|
        List.concat
            [ [ subtitleAndLocation model.common model.event ]
            , model.event.comments
                |> maybeToList
                    (\comments ->
                        p [] [ text comments, br [] [], br [] [] ]
                    )
            , [ span [] <| attendanceBlock model ]
            , model.event.gig
                |> Maybe.map .performanceTime
                |> maybeToList
                    (\performanceTime ->
                        p []
                            [ text "Perform at: "
                            , text
                                (performanceTime
                                    |> timeFormatter model.common.timeZone
                                )
                            ]
                    )
            , [ p []
                    [ text "This event is worth "
                    , b []
                        [ text <| String.fromInt model.event.points
                        , text " points"
                        ]
                    ]
              ]
            , model.event.section
                |> maybeToList
                    (\section ->
                        p [] [ text <| "This event is for the " ++ section ++ " section" ]
                    )
            , model.event.gig
                |> Maybe.map .uniform
                |> Maybe.andThen (\id -> model.common.info.uniforms |> find (\uniform -> uniform.id == id))
                |> maybeToList uniformSection
            , [ absenceRequestButton model.common model.event ]
            , [ officerInfoSection model ]
            , [ case model.state of
                    ErrorSending error ->
                        Basics.errorBox error

                    _ ->
                        text ""
              ]
            ]


const SubtitleAndLocation: React.FC<{event: GlubEvent}> = ({event}) => (
    <p className="subtitle is-5">
        {fullDateTimeFormatter(event.callTime)}
        <br/>
        {event.location && (
            <a href={`https://www.google.com/maps/search/${event.location}`} target="_blank">
                {event.location}
            </a>
        )}
    </p>
);

interface AttendanceBlockProps {
    event: GlubEvent;
    rsvpState: SubmissionState;
    confirm: () => void;
    rsvp: (attending: boolean) => void;
}

const AttendanceBlock: React.FC<AttendanceBlockProps> = ({event, rsvpState, confirm, rsvp}) => {
    const { attendance, rsvpIssue } = event;
    
    if (!attendance) {
        // No attendance for inactive members
        return <></>;
    } else if (eventIsOver(event)) {
        // Show whether the member attended the event
        return <AttendanceSummary points={event.points} attendance={attendance}/>;   
    } else if (!rsvpIssue) {
        // If the event isn't over but they can still RSVP
        return <RsvpActions rsvp={rsvp} rsvpState={rsvpState} attendance={attendance}/>;
    } else if (attendance.confirmed) {
        // If they can't RSVP but are already confirmed
        return <>We know you're coming</>;
    } else if (["Sectional", "Tutti Gig", "Rehearsal" ].includes(event.type)) {
        // If they can't RSVP but are still allowed to confirm
        return <>
            <p>You're coming, right?</p>
            <button onClick={confirm} className={'button is-primary' + (rsvpState.state === 'sending' ? ' is-loading' : '')}>
            yep, I'll be there
            </button>
        </>;
    } else {
        // Can't confirm or RSVP, so show the error
        return <p className="has-text-grey-light is-italic">{rsvpIssue}</p>;
    }
}

interface RsvpActionsProps {
    attendance: SimpleAttendance;
    rsvpState: SubmissionState;
    rsvp: (attending: boolean) => void;
}

const RsvpActions: React.FC<RsvpActionsProps> = ({attendance, rsvpState, rsvp}) => {
    const rsvpButton = (attending: boolean, content: string) => (
        <button onClick={() => rsvp(attending)} className={['button', 'is-primary', (rsvpState.state === 'sending' )&& 'is-loading', !attending && 'is-outlined'].filter(x => !!x).join(' ')}>
            {content}
        </button>
    );

    if (attendance.confirmed) {
        if (attendance.shouldAttend) {
        return <>
            <p>You're <b>confirmed</b> to be <b>attending</b></p>
            {rsvpButton(false, 'oops jk, gotta dip')}
        </>;
        } else {
        return <>
            <p>The officers know you won't be there</p>
            {rsvpButton(true, "sike I can come. put me in coach!")}
        </>;
        }
    } else {
        if (attendance.shouldAttend) {
        return <>
            <p>You're coming, right?</p>
            {rsvpButton(false, "sorry fam, not this time")}
            <span> </span>
            {rsvpButton(true, "yep, I'll be there")}
        </>;
        } else {
        return <>
            <p>You're not coming, right?</p>
            {rsvpButton(true, "akshually I can come. you're welcome")}
        </>;
        }
    }
}

interface AttendanceSummaryProps {
    points: number;
    attendance: SimpleAttendance;
}

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({points, attendance}) => {
    if (attendance.didAttend) {
        if (attendance.shouldAttend) {
            return <>You were there! What a great time. Real #tbt material.</>;
        } else {
            return <>Wow, thanks for coming. What a guy!</>;
        }
    } else {
        if (attendance.shouldAttend) {
            return <>You <b>weren't there</b>, and that's <b>not ok</b>. You lost {`${points}`} points. <a href="mailto:gleeclub_officers@lists.gatech.edu?subject=Attendance Issue">Email the officers</a> if you think that's not right.</>;
        } else {
            return <>You <b>weren't there</b>, but that's <b>ok</b>.</>;
        }
    }
}

const UniformSection: React.FC<{uniform: Uniform}> = ({uniform}) => (
    <p>
        <span>{uniform.name} </span>
        <span style={{cursor: 'pointer'}} className="icon tooltip has-tooltip-bottom is-tooltip-multiline has-text-grey-light is-small" data-tooltip={uniform.description || ''}>
            <i className="far fa-question-circle"/>
        </span>
        <br/>
    </p>
);

interface AbsenceRequestButtonProps {
    event: GlubEvent;
    requestAbsence: () => void;
}

const AbsenceRequestButton: React.FC<AbsenceRequestButtonProps> = ({event, requestAbsence}) => {
    if (eventIsOver(event) && !event.rsvpIssue) {
        return <></>;
    } else if (event.absenceRequest) {
        return (
            <button className='button is-primary is-outlined' onClick={requestAbsence}>
                {`Request ${event.absenceRequest.state}`}
            </button>
        );
    } else {
        return (
            <button className='button is-primary is-outlined' disabled>
                Request Absence
            </button>
        );
    }
}

interface OfficerInfoSectionProps {
    event: GlubEvent;
    deleteState: SubmissionState | null;
    editEvent: () => void;
    tryToDelete: () => void;
    confirmDelete: () => void;
    cancelDelete: () => void;
}

const OfficerInfoSection: React.FC<OfficerInfoSectionProps> = props => (
    <RequiresPermission permission={viewEventPrivateDetails}>
        <Divider/>
        {isGig(props.event) && (
            <>
                <ContactInfo gig={props.event}/>
                {props.event.price !== null ? `${props.event.price}` : ''}
            </>
        )}
        <br/>
        <button className="button" onClick={props.editEvent} style={{marginBottom: '5px'}}>
            Edit this bitch
        </button>
        <br/>
        <button className="button is-danger is-outlined" onClick={props.tryToDelete} style={{marginBottom: '5px'}}>
            Edit this bitch
        </button>
        {props.deleteState && (
            <DeleteModal title={`Delete ${props.event.name}?`} cancel={props.cancelDelete} confirm={props.confirmDelete} state={props.deleteState}>
                <p>
                Are you sure you want to delete this event? Once you delete it, it's gone like Donkey Kong.
                </p>
            </DeleteModal>
        )}
    </RequiresPermission>
);

const ContactInfo: React.FC<{gig: Gig;}> = ({gig}) => {
    if (!gig.contactName && !gig.contactEmail && !gig.contactPhone) {
        return <p><i>No contact info</i></p>;
    }

    return (
        <p>
            <u>Contact</u>
            <br/>
            {gig.contactName || <i>idk who</i>}
            <br/>
            {gig.contactPhone ? <PhoneLink phone={gig.contactPhone}/> : <i>no number, bro</i>}
            <br/>
            {gig.contactEmail ? <EmailLink email={gig.contactEmail}/> : <i>no email, dude</i>}
        </p>
    );
};
