export interface IArtist {
  name: string,
  addedBy: 'manual' | 'web',
  email?: string,
  genres?: string[],
  images: IImageMap[],
  instagramUsername?: string,
  spotifyArtistId: string,
  youtubeChannelId?: string,
  createdAt: number, // timestamp
  modifiedAt: number, // timestamp
}

export interface IImageMap {
  height: number,
  width: number,
  url: string
}

export interface IArtistMap {
  spotifyArtistId: string,
  name: string
}
