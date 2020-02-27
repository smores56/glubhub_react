import React from "react";
import { RemoteData } from "../../utils/state";
import { Song, SongLinkSection, Pitch, SongMode } from "../../utils/models";
import SongLinkButton from "./Links";
import { BackButton } from "../../components/Buttons";
import {
  CenteredTitle,
  Sidebar,
  RequiresPermission
} from "../../components/Basics";
import { editRepertoire } from "../../utils/permissions";
import { playPitch, pitchToUnicode } from "../../utils/utils";

interface SongSidebarProps {
  song: RemoteData<Song>;
  close: () => void;
  edit: () => void;
  tryToDelete: () => void;
}

const SongSidebar: React.FC<SongSidebarProps> = props => {
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
      data={props.song}
      close={props.close}
      render={song => (
        <div>
          <BackButton content="all songs" click={props.close} />
          <CenteredTitle>{song.title}</CenteredTitle>
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
            {song.links.filter(links => links.links.length).map(linkSection)}
          </table>
          <RequiresPermission permission={editRepertoire}>
            <div>
              <button onClick={props.edit}>Edit Song</button>
              <br />
              <br />
              <button className="is-danger" onClick={props.tryToDelete}>
                Delete Song
              </button>
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
      <b onClick={() => playPitch(pitch)} tooltip="hey kid, wanna pitch?">
        {pitchToUnicode(pitch)}
        {mode ? ` ${mode}` : ""}
      </b>
    ) : (
      <b>?</b>
    )}
  </p>
);

export default SongSidebar;
