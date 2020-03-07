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
  mapLoaded
} from "state/types";
import {
  Container,
  Section,
  Columns,
  Sidebar,
  RequiresPermission
} from "components/Basics";
import { Song } from "state/models";
import SongSidebar from "./Sidebar";
import ErrorBox from "components/ErrorBox";
import { useGlubRoute } from "utils/context";
import { SelectableList } from "components/List";
import DeleteModal from "components/DeleteModal";
import { editRepertoire } from "state/permissions";
import { BackButton, ButtonGroup, Button } from "components/Buttons";
import { RouteRepertoire, routeRepertoire } from "state/route";
import { get, postReturning, NewId, deleteRequest } from "utils/request";

export const Repertoire: React.FC<{ route: RouteRepertoire }> = ({ route }) => {
  const { replaceRoute } = useGlubRoute();

  const [songs, setSongs] = useState<RemoteData<Song[]>>(loading);
  const [selected, setSelected] = useState<RemoteData<Song>>(notAsked);
  const [createState, setCreateState] = useState(notSentYet);
  const [deleteState, setDeleteState] = useState<SubmissionState | null>(null);

  const loadSongs = useCallback(async () => {
    const resp = await get<Song[]>(`repertoire`);
    setSongs(resultToRemote(resp));
  }, [setSongs]);

  const loadSong = useCallback(
    async (songId: number) => {
      const resp = await get<Song>(`repertoire/${songId}?details=true`);
      setSelected(resultToRemote(resp));
      replaceRoute(routeRepertoire(songId));

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
    replaceRoute(routeRepertoire(null));
  }, [setSelected, replaceRoute]);

  const createSong = useCallback(async () => {
    setCreateState(sending);
    const body = { title: "New Song" };
    const resp = await postReturning<typeof body, NewId>("repertoire", body);

    if (resp.successful) {
      setCreateState(notSentYet);
      await loadSong(resp.data.id);
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

  // Load Songs on Initialize

  useEffect(() => {
    loadSongs();
    if (route.songId !== null) {
      loadSong(route.songId);
    }
  }, [route, loadSong, loadSongs]);

  const selectedId = selected.status === "loaded" ? selected.data.id : null;
  const columns: [
    string,
    (songs: Song[]) => Song[],
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
              <div className="column is-one-quarter is-centered">
                <SelectableList
                  title={title}
                  listItems={mapLoaded(songs, x => [filter(x)])}
                  isSelected={song => song.id === selectedId}
                  onSelect={(song: Song) => loadSong(song.id)}
                  messageIfEmpty="Nothin' to see here, buddy."
                  render={song => <td>{song.title}</td>}
                  contentAtBottom={maybeCreateButton}
                />
              </div>
            ))}
          </Columns>
        </Container>
      </Section>
      {selected.status === "loaded" ? (
        <Sidebar
          data={loaded(null)}
          close={unselectSong}
          render={() => (
            <div>
              <BackButton
                content="finish editing"
                click={() => setSelected(loaded(selected.data))}
              />
              {/* {Html.map editSongTranslator (EditSong.view editSongModel)} */}
            </div>
          )}
        />
      ) : (
        <SongSidebar
          song={selected}
          close={unselectSong}
          edit={() => setSelected(loading)}
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

const currentSongsFilter = (songs: Song[]) =>
  songs.filter(song => song.current);

const otherAToGFilter = (songs: Song[]) =>
  songs.filter(song => !song.current && song.title.toLowerCase()[0] < "h");

const otherHToPFilter = (songs: Song[]) =>
  songs.filter(
    song =>
      !song.current &&
      song.title.toLowerCase()[0] >= "h" &&
      song.title.toLowerCase()[0] < "q"
  );

const otherQToZFilter = (songs: Song[]) =>
  songs.filter(song => !song.current && song.title.toLowerCase()[0] >= "q");

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
