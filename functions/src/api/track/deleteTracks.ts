import {logger} from 'firebase-functions';
import {Request, Response} from 'express';
import mongodb from '../../models';
const Track = mongodb.model('Track');
const Artist = mongodb.model('Artist');

/**
 * Get tracks based on query
 * @param {Request} req
 * @param {Response} res
 */
export async function deleteTracks(req:Request, res:Response): Promise<any> {
  try {
    const killList = [];

    for (
      const track of await Track.aggregate([{$sample: {size: 1000}}]) as any[]
    ) {
      const artists = await Promise.all(track.artists.map((artist:any) => {
        return Artist.findOne({spotifyArtistId: artist.spotifyArtistId});
      }));

      if (artists.every((artist) => !artist)) {
        killList.push({
          spotifyTrackId: track.spotifyTrackId,
          name: track.name,
        });
      }
    }

    await Promise.all(killList.map((track:any) => {
      return Track.deleteOne({spotifyTrackId: track.spotifyTrackId});
    }));

    return res.status(200).json(killList);
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
