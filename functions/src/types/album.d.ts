import {firestore} from 'firebase-admin';
import {IArtistMap, IImageMap} from './artist';
import {ITrackMap} from './track';

export interface IAlbum {
  artists: IArtistMap[],
  images: IImageMap[],
  name: string,
  releaseDate: number, // timestamp
  releaseDatePrecision: 'year' | 'month' | 'day',
  spotifyAlbumId: string,
  totalTracks: number,
  copyrights: ICopyrightMap[],
  tracks: ITrackMap[],
  createdAt: number | firestore.FieldValue, // timestamp
  modifiedAt: number | firestore.FieldValue, // timestamp
}

export interface IAlbumMap {
  name: string,
  images: IImageMap[],
  spotifyAlbumId: string
}

export interface ICopyrightMap {
  type: 'C' | 'P',
  text: string
}
