
import {logger} from 'firebase-functions';
import {Response, NextFunction} from 'express';
import {IUserObject} from '../types/user';
import spotifyUserApi from '../utils/spotifyUser';
import mongodb from '../models';
const User = mongodb.model('User');
import {IRequestExtended} from '../types';

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function auth(
    req: IRequestExtended,
    res: Response,
    next: NextFunction
): Promise<any> {
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      return res.status(401).send('Authentication required');
    }

    const user: IUserObject =
      await User.findOne({'auth.accessToken': accessToken}) as any;

    if (!user) {
      return res.status(401).send('Session expired, login again.');
    }

    const spotifyUser = spotifyUserApi();
    // Set the access token on the API object to use it in later calls
    spotifyUser.setAccessToken(user.auth.accessToken);
    spotifyUser.setRefreshToken(user.auth.refreshToken);

    // Refresh access token
    if (user.auth.expiresAt <= new Date()) {
      const data = await spotifyUser.refreshAccessToken();

      await User.findByIdAndUpdate(user._id, {
        'auth.accessToken': data.body['access_token'],
        // spotify returns 300 seconds
        'auth.expiresAt': new Date(Date.now() + data.body['expires_in'] * 1000),
      });

      user.auth.accessToken = data.body['access_token'];
      res.set('Authorization', data.body['access_token']);
    }

    req.spotifyUser = spotifyUser;
    req.user = user;
    next();
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
