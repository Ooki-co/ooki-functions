import {DBQueryObject} from '../types';

export type Mood =
  'peaceful' |
  'happy' |
  'optimistic' |
  'romantic' |
  'melancholy' |
  'lonely' |
  'spiritual' |
  'powerful';

export type MoodVariant = 'upbeat' | 'chill';

export const moodFilters = {
  peaceful: {
    common: {
      'audioFeatures.tempo': {$lte: 85},
      'audioFeatures.instrumentalness': {$gte: 0.1},
      'audioFeatures.valence': {$gte: 0.2, $lte: 0.8},
    },
    upbeat: {
      'audioFeatures.danceability': {$lte: 0.6},
      'audioFeatures.loudness': {$lte: -20},
    },
    chill: {
      'audioFeatures.danceability': {$lte: 0.5},
      'audioFeatures.loudness': {$lte: -24},
    },
  },
  happy: {
    common: {
      'audioFeatures.valence': {$gte: 0.65},
    },
    upbeat: {
      'audioFeatures.energy': {$gte: 0.5},
      'audioFeatures.tempo': {$gte: 105},
      'audioFeatures.danceability': {$gte: 0.65},
    },
    chill: {
      'audioFeatures.energy': {$lte: 0.5},
      'audioFeatures.tempo': {$lte: 105},
      'audioFeatures.danceability': {$lte: 0.65},
    },
  },
  optimistic: {
    common: {
      'audioFeatures.valence': {$gte: 0.5},
      'audioFeatures.instrumentalness': {$gte: 0.1},
    },
    upbeat: {
      'audioFeatures.energy': {$gte: 0.5},
      'audioFeatures.tempo': {$gte: 105},
      'audioFeatures.danceability': {$gte: 0.5},
    },
    chill: {
      'audioFeatures.energy': {$lte: 0.5},
      'audioFeatures.tempo': {$lte: 105},
      'audioFeatures.danceability': {$lte: 0.5},
    },
  },
  romantic: {
    common: {
      'audioFeatures.acousticness': {$gte: 0.65},
    },
    upbeat: {
      'audioFeatures.valence': {$gte: 0.5},
      'audioFeatures.energy': {$gte: 0.5},
      'audioFeatures.tempo': {$gte: 110},
    },
    chill: {
      'audioFeatures.valence': {$lte: 0.5},
      'audioFeatures.energy': {$lte: 0.5},
      'audioFeatures.tempo': {$lte: 110},
    },
  },
  melancholy: {
    common: {},
    upbeat: {
      'audioFeatures.danceability': {$gte: 0.5},
      'audioFeatures.energy': {$gte: 0.3, $lte: 0.6},
      'audioFeatures.valence': {$gte: 0.3, $lte: 0.6},
      'audioFeatures.tempo': {$gte: 110},
    },
    chill: {
      'audioFeatures.danceability': {$lte: 0.5},
      'audioFeatures.energy': {$lte: 0.3},
      'audioFeatures.valence': {$lte: 0.3},
      'audioFeatures.tempo': {$lte: 110},
    },
  },
  lonely: {
    common: {
      'audioFeatures.valence': {$lte: 0.5},
      'audioFeatures.instrumentalness': {$lte: 0.2},
    },
    upbeat: {
      'audioFeatures.danceability': {$gte: 0.5},
      'audioFeatures.energy': {$gte: 0.5},
      'audioFeatures.acousticness': {$lte: 0.5},
    },
    chill: {
      'audioFeatures.danceability': {$lte: 0.5},
      'audioFeatures.energy': {$lte: 0.5},
      'audioFeatures.acousticness': {$gte: 0.5},
    },
  },
  spiritual: {
    common: {},
    upbeat: {
      'audioFeatures.danceability': {$gte: 0.35, $lte: 0.7},
      'audioFeatures.energy': {$gte: 0.35, $lte: 0.7},
      'audioFeatures.acousticness': {$gte: 0.35, $lte: 0.7},
      'audioFeatures.valence': {$gte: 0.25, $lte: 0.5},
    },
    chill: {
      'audioFeatures.danceability': {$lte: 0.35},
      'audioFeatures.energy': {$lte: 0.35},
      'audioFeatures.acousticness': {$gte: 0.7},
      'audioFeatures.valence': {$lte: 0.25},
    },
  },
  powerful: {
    common: {
      'audioFeatures.acousticness': {$lte: 0.5},
      'audioFeatures.instrumentalness': {$lte: 0.2},
    },
    upbeat: {
      'audioFeatures.danceability': {$gte: 0.7},
      'audioFeatures.energy': {$gte: 0.7},
      'audioFeatures.valence': {$gte: 0.65},
    },
    chill: {
      'audioFeatures.danceability': {$gte: 0.35, $lte: 0.7},
      'audioFeatures.energy': {$gte: 0.35, $lte: 0.7},
      'audioFeatures.valence': {$gte: 0.25, $lte: 0.65},
    },
  },
};

/**
 *
 * @param {string} sub
 * @return {Any} mongo db query object
 */
export function getFilter(sub: Mood) {
  return (main: MoodVariant): DBQueryObject => {
    const mood = moodFilters[sub];
    return {
      ...mood.common,
      ...mood[main],
    };
  };
}
