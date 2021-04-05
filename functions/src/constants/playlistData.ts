import {Mood} from './moodFilters';

const playlists = {
  peaceful: {
    title: 'Peaceful Hideaway',
    description: '🦋 Enjoy the moment. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fpeaceful.jpg?alt=media',
  },
  happy: {
    title: 'Happy Moments',
    description: '🎈 Celebrate the moment. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fhappy.jpg?alt=media',
  },
  optimistic: {
    title: 'Good Vibes',
    description: '🍀 Get lucky. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Foptimistic.jpg?alt=media',
  },
  romantic: {
    title: 'Romantic Mood',
    description: '💗 Get closer. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fromantic.jpg?alt=media',
  },
  melancholy: {
    title: 'Melancholy Mood',
    description: '🌫️ Feel better. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fmelancholy.jpg?alt=media',
  },
  lonely: {
    title: 'Lonely Moments',
    description: '⛺ Resume solo mode. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Flonely.jpg?alt=media',
  },
  spiritual: {
    title: 'Spiritual Mood',
    description: '🍂 Listen to the silence. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fspiritual.jpg?alt=media',
  },
  powerful: {
    title: 'Powerful Vibes',
    description: '⛰️ Feel strong. Curated by %s',
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/ooki-dev.appspot.com/o/playlist_cover%2Fpowerful.jpg?alt=media',
  },
};

export interface IPlaylistData {
  title: string,
  description: string,
  imageUrl: string
}

/**
 * Get playlist data
 * @param {Mood} mood
 * @return {IPlaylistData}
 */
export function getPlaylistData(mood: Mood): IPlaylistData {
  return playlists[mood];
}
