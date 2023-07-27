import User from "../models/UserModel.js";

export const saveNews = async (req, res) => {
  const { id: _id } = req.params;
  const { newsUrl, newsImage, newsTitle, newsDescription } = req.body;
  try {
    const user = await User.findById(_id);
    user?.savedNews?.map(async (save) => {
      if (save.newsUrl === newsUrl) {
        await User.updateOne(
          { _id },
          { $pull: { savedNews: { _id: save._id } } }
        );
      }
    });
    await user.updateOne({
      $push: {
        savedNews: { newsUrl, newsImage, newsTitle, newsDescription },
      },
    });
    const saved = await User.findById(_id);
    res.status(200).json(saved.savedNews);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const visitNews = async (req, res) => {
  const { id: _id } = req.params;
  const { newsUrl, newsImage, newsTitle, newsDescription } = req.body;
  try {
    const user = await User.findById(_id);
    user?.recentlyVis?.map(async (save) => {
      if (save.newsUrl === newsUrl) {
        await User.updateOne(
          { _id },
          { $pull: { recentlyVis: { _id: save._id } } }
        );
      }
    });
    await user.updateOne({
      $push: {
        recentlyVis: { newsUrl, newsImage, newsTitle, newsDescription },
      },
    });
    const saved = await User.findById(_id);
    res.status(200).json(saved.recentlyVis);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchNews = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findById(_id);
    res.status(200).json(user.savedNews);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchRecentVisits = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findById(_id);
    res.status(200).json(user.recentlyVis);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteNews = async (req, res) => {
  const { id: _id } = req.params;
  const { newsId } = req.body;
  try {
    await User.updateOne({ _id }, { $pull: { savedNews: { _id: newsId } } });
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(405).json(error);
  }
};

export const removeNews = async (req, res) => {
  const { id: _id } = req.params;
  const { newsId } = req.body;
  try {
    await User.updateOne({ _id }, { $pull: { recentlyVis: { _id: newsId } } });
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    res.status(405).json(error);
  }
};

export const saveKeyword = async (req, res) => {
  const { id: _id } = req.params;
  const { keyword } = req.body;
  try {
    const user = await User.findById(_id);
    user?.recentSearches?.map(async (search) => {
      if (search.keyword === keyword) {
        await User.updateOne(
          { _id },
          { $pull: { recentSearches: { _id: search._id } } }
        );
      }
    });
    await user.updateOne({
      $push: {
        recentSearches: { keyword },
      },
    });
    const saved = await User.findById(_id);
    res.status(200).json(saved.recentSearches);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchKeywords = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const user = await User.findById(_id);
    res.status(200).json(user.recentSearches);
  } catch (error) {
    res.status(400).json(error);
  }
};
