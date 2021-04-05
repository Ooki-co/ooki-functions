import {logger} from 'firebase-functions';
import {Response} from 'express';
import {IRequestExtended} from '../../types';
import axios from 'axios';
import mongodb from '../../models';
const Playlist = mongodb.model('Playlist');
import {getPlaylistData} from '../../constants/playlistData';
import {IUserObject} from '../../types/user';
/**
 * Add a new playlist on user's spotify
 * @param {Request} req
 * @param {Response} res
 */
export async function add(req:IRequestExtended, res:Response): Promise<any> {
  try {
    const spotifyUser = req.spotifyUser;
    const user = req.user as IUserObject;
    const {tracks: trackIds = [], selection} = req.body;
    if (
      (!Array.isArray(trackIds) || trackIds.length == 0) ||
      (!selection || !selection.main || !selection.sub)
    ) {
      return res.status(400).send('Bad request');
    }

    const playlistData = getPlaylistData(selection.sub);
    const tracks = trackIds.map((id: string) => `spotify:track:${id}`);

    const data = await spotifyUser.createPlaylist(playlistData.title, {
      description: playlistData.description.replace('%s', user.displayName),
      public: true,
    });

    const {data: imageData} = await axios.get(playlistData.imageUrl, {
      responseType: 'arraybuffer',
    });

    const imageDataBase64 = Buffer.from(imageData, 'binary').toString('base64');

    await Promise.all([
      spotifyUser.addTracksToPlaylist(data.body.id, tracks),
      spotifyUser.uploadCustomPlaylistCoverImage(data.body.id, imageDataBase64),
    ]);

    const spotifyPlaylistId = data.body.id;
    const {body: createdPlaylist} =
      await spotifyUser.getPlaylist(spotifyPlaylistId);

    console.log(createdPlaylist);

    const playlist = {
      spotifyPlaylistId: createdPlaylist.id,
      name: createdPlaylist.name,
      description: createdPlaylist.description,
      owner: {
        spotifyUserId: createdPlaylist.owner.id,
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

    await Playlist.create(playlist);

    return res.sendStatus(201);
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
