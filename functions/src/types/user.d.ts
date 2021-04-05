import {IImageMap} from './common';
import {ObjectId} from 'mongoose';
export interface IUserObject extends IUser {
  createdAt: Date,
  updatedAt: Date
}

export interface IUser {
  _id: ObjectId,
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
  },
  auth: {
    provider: 'spotify',
    accessToken: string,
    refreshToken: string,
    expiresAt: Date,
  }
}
