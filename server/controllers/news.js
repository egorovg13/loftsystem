const db = require('../db/index');

const getFormattedAllNews = async () => {
  const allNews = await db.getAllNews();
  const newsWithIds = allNews.map( (newsObj) => {
    const newObj = newsObj._doc;
    newObj.id = newsObj._id;
    delete newObj._id;

    return newObj;
  });

  return newsWithIds;
};

module.exports.get = async (req, res) => {
  const news = await getFormattedAllNews();
  res.json(news);
};

module.exports.post = async (req, res) => {
  const {id} = res.locals;
  const user = await db.getUserById(id);
  const userData = {
    firstName: user.firstName,
    id: id,
    image: user.image,
    middleName: user.middleName,
    surName: user.surName,
    username: user.username,
  };

  await db.createNews(req.body, userData);
  const allNews = await getFormattedAllNews();
  res.json(allNews);
};

module.exports.delete = async (req, res) => {
  const newsId = req.params.newsId;
  await db.deleteNews(newsId);

  const news = await getFormattedAllNews();

  res.json(news);
};

module.exports.patchNews = async (req, res) => {
  const newsId = req.params.newsId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  const updateResult = await db.updateNews(newsId, newTitle, newText);

  if (updateResult) {
    const news = await getFormattedAllNews();
    res.json(news);
  }
};
