import {logger} from 'firebase-functions';
import {Response} from 'express';
import {IRequestExtended} from '../../types';
import {IUserObject} from '../../types/user';

/**
 * Get private/public all user playlists
 * @param {Request} req
 * @param {Response} res
 */
export async function getUserPlaylists(
    req:IRequestExtended, res:Response
): Promise<any> {
  try {
    const spotifyUser = req.spotifyUser;
    const user = req.user as IUserObject;

    const {body: userPlaylists} =
      await spotifyUser.getUserPlaylists(user.spotifyUserId, {
        limit: 50,
      });

    const playlists = userPlaylists.items
        .filter((item:any) => item.owner.id === user.spotifyUserId)
        .map((item:any) => {
          return {
            id: item.id,
            public: item.public,
            name: item.name,
          };
        });

    return res.status(200).json(playlists);
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
