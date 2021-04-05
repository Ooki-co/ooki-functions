import {Request} from 'express';
import {IUserObject} from './user';

export interface IRequestExtended extends Request {
  user?: IUserObject,
  spotifyUser?: any
}

export interface DBQueryObject {
  [key: string]: any
}
