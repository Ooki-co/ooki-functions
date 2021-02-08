import {IArtistMap} from '../types/artist';
import {ITrack, ITrackMap} from '../types/track';
import {IAlbum, IAlbumMap} from '../types/album';

/**
 *
 * @param {*} spotifyArtists
 * @return {IArtistMap[]}
 */
export function getArtistsMap(spotifyArtists:any):IArtistMap[] {
  return spotifyArtists.map((artist:any) => {
    return {
      spotifyArtistId: artist.id,
      name: artist.name,
    };
  });
}

/**
 *
 * @param {ITrack[]} tracks
 * @return {ITrackMap[]}
 */
export function getTracksMap(tracks:ITrack[]):ITrackMap[] {
  return tracks.map((track:ITrack) => {
    return {
      artists: track.artists,
      durationMs: track.durationMs,
      explicit: track.explicit,
      spotifyTrackId: track.spotifyTrackId,
      name: track.name,
      previewUrl: track.previewUrl,
      trackNumber: track.trackNumber,
    };
  });
}

/**
 *
 * @param {IAlbum} album
 * @return {IAlbumMap}
 */
export function getAlbumMap(album:IAlbum):IAlbumMap {
  return {
    name: album.name,
    images: album.images,
    spotifyAlbumId: album.spotifyAlbumId,
  };
}
