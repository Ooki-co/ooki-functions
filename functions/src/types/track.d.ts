import {firestore} from 'firebase-admin';
import {IArtistMap} from './artist';
import {IAlbumMap} from './album';

export interface ITrack {
  artists: IArtistMap[],
  album: IAlbumMap,
  name: string,
  durationMs: number,
  explicit: boolean,
  spotifyTrackId: string,
  previewUrl: string,
  trackNumber: number,
  audioFeatures: IAudioFeatures | null,
  createdAt: number | firestore.FieldValue, // timestamp
  modifiedAt: number | firestore.FieldValue, // timestamp
}

export interface ITrackMap {
  artists: IArtistMap[],
  durationMs: number,
  explicit: boolean,
  spotifyTrackId: string,
  name: string,
  previewUrl: string,
  trackNumber: number
}

export interface IAudioFeatures {
  danceability: number,
  energy: number,
  key: number,
  loudness: number,
  mode: number,
  speechiness: number,
  acousticness: number,
  instrumentalness: number,
  liveness: number,
  valence: number,
  tempo: number,
  timeSignature: number
}
