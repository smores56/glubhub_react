import React, { useState, useEffect, useCallback } from "react";
import {
  RemoteData,
  loading,
  notSentYet,
  SubmissionState,
  notAsked,
  loaded,
  resultToRemote,
  sending,
  errorSending,
  mapLoaded,
  isLoaded
} from "state/types";
import {
  Container,
  Section,
  Columns,
  Sidebar,
  RequiresPermission
} from "components/Basics";
import { Song } from "state/models";
import { SongSidebar } from "./Sidebar";
import ErrorBox from "components/ErrorBox";
import { useGlubRoute } from "utils/context";
import { SelectableList } from "components/List";
import DeleteModal from "components/DeleteModal";
import { editRepertoire } from "state/permissions";
import { BackButton, ButtonGroup, Button } from "components/Buttons";
import { get, postReturning, NewId, deleteRequest } from "utils/request";
import { routeRepertoire, RepertoireTab, repertoireDetails } from "state/route";
import { Edit } from "./Edit";

interface RepertoireProps {
  songId: number | null;
  tab: RepertoireTab | null;
}

export const Repertoire: React.FC<RepertoireProps> = ({ songId, tab }) => {
  const { replaceRoute } = useGlubRoute();

  const [songs, setSongs] = useState<RemoteData<Song[]>>(loading);
  const [selected, setSelected] = useState<RemoteData<Song>>(notAsked);
  const [createState, setCreateState] = useState(notSentYet);
  const [deleteState, setDeleteState] = useState<SubmissionState | null>(null);

  const loadSong = useCallback(
    async (songId: number) => {
      setSelected(loading);
      const resp = await get<Song>(`repertoire/${songId}?details=true`);
      setSelected(resultToRemote(resp));

      if (
        resp.successful &&
        songs.status === "loaded" &&
        !songs.data.some(song => song.id === songId)
      ) {
        setSongs(loaded([...songs.data, resp.data]));
      }
    },
    [setSelected, replaceRoute, songs, setSongs]
  );

  const unselectSong = useCallback(() => {
    setSelected(notAsked);
    replaceRoute(routeRepertoire(null, null));
  }, [setSelected, replaceRoute]);

  const createSong = useCallback(async () => {
    setCreateState(sending);
    const body = { title: "New Song" };
    const resp = await postReturning<typeof body, NewId>("repertoire", body);

    if (resp.successful) {
      setCreateState(notSentYet);
      loadSong(resp.data.id);
    } else {
      setCreateState(errorSending(resp.error));
    }
  }, [setCreateState, loadSong]);

  const deleteSong = useCallback(
    async (songId: number) => {
      setDeleteState(sending);
      const resp = await deleteRequest(`repertoire/${songId}`);

      if (resp.successful) {
        setDeleteState(null);
        setSelected(notAsked);
        setSongs(songs =>
          mapLoaded(songs, x => x.filter(song => song.id !== songId))
        );
      } else {
        setDeleteState(errorSending(resp.error));
      }
    },
    [setDeleteState, setSelected, setSongs]
  );

  const propagateUpdate = useCallback(
    (song: Song) => {
      setSelected(loaded(song));
      setSongs(
        mapLoaded(songs, all => all.map(s => (s.id === song.id ? song : s)))
      );
    },
    [songs, setSelected]
  );

  // Load Songs on Initialize

  useEffect(() => {
    const loadSongs = async () => {
      const resp = await get<Song[]>(`repertoire`);
      setSongs(resultToRemote(resp));
    };

    loadSongs();
    if (songId !== null) {
      loadSong(songId);
    } else {
      setSelected(notAsked);
    }
  }, [songId, setSelected]);

  const selectedId = isLoaded(selected) ? selected.data.id : null;
  const columns: [
    string,
    (songs: Song) => boolean,
    JSX.Element | undefined
  ][] = [
    [
      "Current",
      currentSongsFilter,
      <CreateSongButton state={createState} createSong={createSong} />
    ],
    ["A-G", otherAToGFilter, undefined],
    ["H-P", otherHToPFilter, undefined],
    ["Q-Z", otherQToZFilter, undefined]
  ];

  return (
    <div>
      <Section>
        <Container>
          <Columns>
            {columns.map(([title, filter, maybeCreateButton]) => (
              <div key={title} className="column is-one-quarter is-centered">
                <SelectableList
                  title={title}
                  listItems={mapLoaded(songs, x => [x.filter(filter)])}
                  isSelected={song => song.id === selectedId}
                  onSelect={song =>
                    replaceRoute(routeRepertoire(song.id, null))
                  }
                  messageIfEmpty="Nothin' to see here, buddy."
                  render={song => <td>{song.title}</td>}
                  contentAtBottom={maybeCreateButton}
                />
              </div>
            ))}
          </Columns>
        </Container>
      </Section>
      {isLoaded(selected) && tab?.route === "edit" ? (
        <Sidebar
          data={loaded(null)}
          close={unselectSong}
          render={() => (
            <div>
              <BackButton
                content="finish editing"
                click={() =>
                  replaceRoute(
                    routeRepertoire(selected.data.id, repertoireDetails)
                  )
                }
              />
              <Edit song={selected.data} propagateUpdate={propagateUpdate} />
            </div>
          )}
        />
      ) : (
        <SongSidebar
          song={selected}
          tryToDelete={() => setDeleteState(notSentYet)}
        />
      )}
      {selected.status === "loaded" && deleteState ? (
        <DeleteModal
          title={`Are you sure you want to delete ${selected.data.title}?`}
          cancel={() => setDeleteState(null)}
          confirm={() => deleteSong(selected.data.id)}
          state={deleteState}
        >
          <div>
            <p>Are you sure you want to delete {selected.data.title}?</p>
            <p>
              <i>It'll be gong like Varys' dong.</i>
            </p>
          </div>
        </DeleteModal>
      ) : null}
    </div>
  );
};

// Song Filters

const currentSongsFilter = (song: Song): boolean => song.current;

const otherAToGFilter = (song: Song) =>
  !song.current && song.title.toLowerCase()[0] < "h";

const otherHToPFilter = (song: Song) =>
  !song.current &&
  song.title.toLowerCase()[0] >= "h" &&
  song.title.toLowerCase()[0] < "q";

const otherQToZFilter = (song: Song) =>
  !song.current && song.title.toLowerCase()[0] >= "q";

// Create Song Button

interface CreateSongButtonProps {
  state: SubmissionState;
  createSong: () => void;
}

const CreateSongButton: React.FC<CreateSongButtonProps> = ({
  state,
  createSong
}) => (
  <RequiresPermission permission={editRepertoire}>
    <div style={{ paddingTop: "5px" }}>
      <ButtonGroup alignment="is-centered">
        <Button
          color="is-primary"
          loading={state.status === "sending"}
          onClick={createSong}
        >
          + Add New Song
        </Button>
      </ButtonGroup>
      {state.status === "errorSending" && <ErrorBox error={state.error} />}
    </div>
  </RequiresPermission>
);
