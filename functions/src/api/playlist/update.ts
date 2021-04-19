import {logger} from 'firebase-functions';
import {Response} from 'express';
import {IRequestExtended} from '../../types';
import mongodb from '../../models';
const Playlist = mongodb.model('Playlist');
import {IUserObject} from '../../types/user';

const SPOTIFY_ID_REGEX = /[0-9a-z]{22}/i;
/**
 * Update existing playlist with new selected tracks
 * @param {Request} req
 * @param {Response} res
 */
export async function update(req:IRequestExtended, res:Response): Promise<any> {
  try {
    const spotifyUser = req.spotifyUser;
    const user = req.user as IUserObject;
    const {
      tracks: trackIds = [],
      selection,
      playlistId: spotifyPlaylistId,
    } = req.body;

    if (
      (!Array.isArray(trackIds) || trackIds.length == 0) ||
      (!selection || !selection.main || !selection.sub) ||
      !spotifyPlaylistId || typeof spotifyPlaylistId !== 'string' ||
      !SPOTIFY_ID_REGEX.test(spotifyPlaylistId)
    ) {
      return res.status(400).send('Bad request');
    }

    const tracks = trackIds.map((id: string) => `spotify:track:${id}`);

    await spotifyUser.addTracksToPlaylist(spotifyPlaylistId, tracks);

    const {body: createdPlaylist} =
      await spotifyUser.getPlaylist(spotifyPlaylistId);

    const playlist = {
      spotifyPlaylistId: createdPlaylist.id,
      name: createdPlaylist.name,
      description: createdPlaylist.description,
      owner: {
        spotifyUserId: user.spotifyUserId,
      },
      public: createdPlaylist.public,
      collaborative: createdPlaylist.collaborative,
      tracks: createdPlaylist.tracks.items.map((item: any) => {
        return {
          spotifyTrackId: item.track.id,
          addedBy: createdPlaylist.owner.id,
          addedAt: new Date(item.added_at),
        };
      }),
      images: createdPlaylist.images,
      followers: {
        total: createdPlaylist.followers.total,
      },
      synchronizedAt: new Date(),
    };

    await Playlist.updateOne({
      spotifyPlaylistId,
    }, playlist, {upsert: true});

    return res.status(200).json({
      link: createdPlaylist.external_urls.spotify,
    });
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
