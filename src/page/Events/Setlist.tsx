import React, { useState, useEffect } from "react";
import { RemoteData, loading, resultToRemote } from "../../utils/state";
import { Song } from "../../utils/models";
import { get } from "../../utils/request";
import { RemoteContent } from "../../components/Basics";
import { renderRoute, routeRepertoire } from "../../utils/route";
import { pitchToUnicode } from "../../utils/utils";

export const Setlist: React.FC<{ eventId: number }> = ({ eventId }) => {
  const [songs, setSongs] = useState<RemoteData<Song[]>>(loading);

  useEffect(() => {
    const loadSongs = async () => {
      const result = await get(`events/${eventId}/setlist`);
      setSongs(resultToRemote(result));
    };

    loadSongs();
  }, [setSongs]);

  return (
    <RemoteContent
      data={songs}
      render={songs =>
        songs.length === 0 ? (
          <div>No set list for this event.</div>
        ) : (
          <table className="table is-striped">
            <tbody>
              {songs.map((song, index) => (
                <SongRow song={song} index={index + 1} />
              ))}
            </tbody>
          </table>
        )
      }
    />
  );
};

interface SongRowProps {
  song: Song;
  index: number;
}

const SongRow: React.FC<SongRowProps> = ({ song, index }) => (
  <tr key={index}>
    <td>{index}</td>
    <td>
      <a href={renderRoute(routeRepertoire(song.id))}>{song.title}</a>
    </td>
    <td>{song.key ? pitchToUnicode(song.key) : "No key"}</td>
    <td>
      {song.startingPitch
        ? pitchToUnicode(song.startingPitch)
        : "No starting pitch"}
    </td>
  </tr>
);
