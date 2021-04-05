import {logger} from 'firebase-functions';
import {Request, Response} from 'express';
import spotifyUserApi from '../../utils/spotifyUser';
import mongodb from '../../models';
const User = mongodb.model('User');

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function login(req:Request, res:Response): Promise<any> {
  try {
    const code = req.body.code as string;
    if (!code) {
      return res.sendStatus(400);
    }
    const spotifyUser = spotifyUserApi();

    const data = await spotifyUser.authorizationCodeGrant(code);

    const auth = {
      provider: 'spotify',
      accessToken: data.body['access_token'],
      refreshToken: data.body['refresh_token'],
      // spotify returns 300 seconds
      expiresAt: new Date(Date.now() + data.body['expires_in'] * 1000),
    };
    // Set the access token on the API object to use it in later calls
    spotifyUser.setAccessToken(auth.accessToken);
    spotifyUser.setRefreshToken(auth.refreshToken);

    const userData = await spotifyUser.getMe();

    const user = userData.body;

    await User.findOneAndUpdate({
      spotifyUserId: user.id,
    }, {
      spotifyUserId: user.id,
      displayName: user.display_name,
      email: user.email,
      images: user.images,
      externalUrls: user.external_urls,
      auth,
    }, {
      upsert: true,
    });

    res.set('Authorization', auth.accessToken);
    return res.status(200).json({
      accessToken: auth.accessToken,
      expires: auth.expiresAt,
    });
  } catch (err) {
    logger.error(err);
    const errMessageMatch = err.message.split('Details: invalid_grant');
    const message = errMessageMatch ?
    errMessageMatch[1] :
    'Something went wrong!';
    return res.status(500).send(message);
  }
}
