import {logger} from 'firebase-functions';
import {Request, Response} from 'express';
import mongodb from '../../models';
const Track = mongodb.model('Track');
import {
  getFilter,
  moodFilters,
  Mood,
  MoodVariant,
} from '../../constants/moodFilters';

/**
 * Get tracks based on query
 * @param {Request} req
 * @param {Response} res
 */
export async function getTracks(req:Request, res:Response): Promise<any> {
  try {
    const main = (
      (req.query.main as string) || 'chill'
    ).toLowerCase() as MoodVariant;
    const sub = (
      (req.query.sub as string) || 'happy'
    ).toLowerCase() as Mood;

    if (
      !['upbeat', 'chill'].includes(main) ||
      !Object.keys(moodFilters).includes(sub)
    ) {
      return res.status(400).send('Bad request.');
    }

    const tracks = await Track
        .aggregate([
          {
            $match: {
              'album.images': {$size: 3},
              'previewUrl': {$ne: null},
              ...getFilter(sub)(main),
            },
          },
          {
            $sample: {size: 24},
          },
        ])
        .lookup({
          from: 'artists',
          localField: 'artists.spotifyArtistId',
          foreignField: 'spotifyArtistId',
          as: 'artists',
        })
        .project({
          artists: 1,
          album: 1,
          previewUrl: 1,
          spotifyTrackId: 1,
          name: 1,
          audioFeatures: 1,
          _id: 0,
        });

    const tracksToReturn = tracks
        .filter((track) =>
          Array.isArray(track.artists) && track.artists.length > 0
        )
        .map((track) => {
          return {
            ...track,
            artists: track.artists
                .filter((artist:any) => artist.name)
                .map((artist:any) => {
                  return {
                    name: artist.name,
                    images: artist.images,
                    spotifyArtistId: artist.spotifyArtistId,
                  };
                }),
          };
        });

    return res.status(200).json(tracksToReturn);
  } catch (err) {
    logger.error(err);
    const message = err.message || 'Something went wrong!';
    return res.status(500).send(message);
  }
}
