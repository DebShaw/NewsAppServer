import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  savedNews: [
    {
      newsUrl: String,
      newsImage: String,
      newsTitle: String,
      newsDescription: String,
      savedOn: { type: Date, default: Date.now },
    },
  ],
  recentSearches: [
    { keyword: String, savedOn: { type: Date, default: Date.now } },
  ],
  recentlyVis: [
    {
      newsUrl: String,
      newsImage: String,
      newsTitle: String,
      newsDescription: String,
      visitedOn: { type: Date, default: Date.now },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
});
export default mongoose.model("User", UserSchema);
