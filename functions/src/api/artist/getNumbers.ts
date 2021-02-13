import {logger} from 'firebase-functions';
import db from '../../utils/db';
import {Request, Response} from 'express';
import {IArtist} from '../../types/artist';

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function getNumbers(req:Request, res:Response): Promise<any> {
  try {
    const artists = await db.collection('artists').get();
    const artistList:any = [];

    artists.forEach((artist) => {
      artistList.push(artist.data());
    });

    const now = new Date();
    const firstDay = now.getDate() - now.getDay();
    const thisWeekBeginning = new Date(
        `${now.getFullYear()}-${now.getMonth() + 1}-${firstDay + 1}`
    );

    const artistsAddedThisWeek = artistList.filter((artist:IArtist) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return artist.createdAt.toDate() >= thisWeekBeginning;
    });

    const thisWeekManualAdded = artistsAddedThisWeek
        .filter((artist:IArtist) => {
          return artist.addedBy === 'manual';
        });

    const allManualAdded = artistList.filter((artist:IArtist) => {
      return artist.addedBy === 'manual';
    });

    const numbers = {
      total: artistList.length,
      manual: allManualAdded.length,
      web: artistList.length - allManualAdded.length,
      thisWeek: artistsAddedThisWeek.length,
      thisWeekManual: thisWeekManualAdded.length,
      thisWeekWeb: artistsAddedThisWeek.length - thisWeekManualAdded.length,
    };

    return res.status(200).json(numbers);
  } catch (err) {
    logger.error(err);
    return res.status(500).send('Something went wrong!');
  }
}
