export interface IArtist {
  spotifyId: string,
  artistName: string,
  instagramUsername?: string,
  email?: string,
  youtubeChannelId?: string,
  addedBy: 'manual' | 'web',
  createdAt?: Date,
}
