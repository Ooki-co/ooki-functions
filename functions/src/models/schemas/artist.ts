import {Schema} from 'mongoose';

const artistSchema = new Schema({
  spotifyArtistId: {
    type: String,
    require: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    require: true,
    index: true,
  },
  addedBy: {
    type: String,
    require: true,
    enum: [
      'manual',
      'web',
    ],
  },
  email: String,
  genres: [String],
  images: [{
    _id: false,
    width: Number,
    height: Number,
    url: String,
  }],
  externalUrls: {
    type: Map,
    of: String,
  },
}, {
  timestamps: true,
});

export default artistSchema;
