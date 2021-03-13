import {IImageMap} from './common';

export interface IUserObject extends IUser {
  createdAt: Date,
  updatedAt: Date
}

export interface IUser {
  spotifyUserId: string,
  displayName: string,
  email: string,
  country: string,
  explicitContent: boolean,
  externalUrls: {
    [key: string]: string
  },
  images: IImageMap[],
  settings: {
    [key: string]: any
  }
}
