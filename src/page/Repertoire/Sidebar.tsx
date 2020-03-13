import React from "react";
import { RemoteData } from "state/types";
import { SongLinkButton } from "./Links";
import { BackButton, Button } from "components/Buttons";
import { editRepertoire } from "state/permissions";
import { playPitch, pitchToUnicode } from "utils/helpers";
import { Song, SongLinkSection, Pitch, SongMode } from "state/models";
import { Sidebar, RequiresPermission, Title, Tooltip } from "components/Basics";
import { useGlubRoute } from "utils/context";
import { routeRepertoire, repertoireEdit } from "state/route";

interface SongSidebarProps {
  song: RemoteData<Song>;
  tryToDelete: () => void;
}

export const SongSidebar: React.FC<SongSidebarProps> = ({
  song,
  tryToDelete
}) => {
  const { replaceRoute } = useGlubRoute();

  const linkSection = (section: SongLinkSection) => (
    <tr style={{ border: "none" }}>
      <td style={{ border: "none" }}>{section.name}</td>
      <td style={{ border: "none" }}>
        {section.links.map(link => (
          <>
            <SongLinkButton link={link} />{" "}
          </>
        ))}
      </td>
    </tr>
  );

  return (
    <Sidebar
      data={song}
      close={() => replaceRoute(routeRepertoire(null, null))}
      render={song => (
        <div>
          <BackButton
            content="all songs"
            click={() => replaceRoute(routeRepertoire(null, null))}
          />
          <Title centered>{song.title}</Title>
          {song.info && (
            <p>
              {song.info}
              <br />
            </p>
          )}
          <PitchSection title="Key" pitch={song.key} mode={song.mode} />
          <PitchSection
            title="Starting Pitch"
            pitch={song.startingPitch}
            mode={null}
          />
          <br />
          <table className="table is-fullwidth">
            {song.links?.filter(links => links.links.length).map(linkSection)}
          </table>
          <RequiresPermission permission={editRepertoire}>
            <div>
              <Button
                onClick={() =>
                  replaceRoute(routeRepertoire(song.id, repertoireEdit))
                }
              >
                Edit Song
              </Button>
              <br />
              <br />
              <Button color="is-danger" onClick={tryToDelete}>
                Delete Song
              </Button>
            </div>
          </RequiresPermission>
        </div>
      )}
    />
  );
};

interface PitchSectionProps {
  title: string;
  pitch: Pitch | null;
  mode: SongMode | null;
}

const PitchSection: React.FC<PitchSectionProps> = ({ title, pitch, mode }) => (
  <p>
    {title}:{" "}
    {pitch ? (
      <b onClick={() => playPitch(pitch)}>
        <Tooltip content="hey kid, wanna pitch?">
          {pitchToUnicode(pitch)}
          {mode && ` ${mode}`}
        </Tooltip>
      </b>
    ) : (
      <b>?</b>
    )}
  </p>
);
