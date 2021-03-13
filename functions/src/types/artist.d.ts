import {IImageMap} from './common';
export interface IArtist {
  name: string,
  addedBy: 'manual' | 'web',
  email?: string,
  genres?: string[],
  images: IImageMap[],
  instagramUsername?: string,
  spotifyArtistId: string,
  youtubeChannelId?: string,
  approved?: boolean,
  createdAt: number, // timestamp
  modifiedAt: number, // timestamp
}
export interface IArtistMap {
  spotifyArtistId: string,
  name: string
}
