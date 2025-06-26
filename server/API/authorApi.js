const exp = require("express");
const bcrypt = require("bcryptjs");
const UserAuthor = require("../models/UserAuthor");
const Article = require("../models/Article");
const expressAsyncHandler = require("express-async-handler");
const author = exp.Router();

author.get(
  "/articles",
  expressAsyncHandler(async (req, res) => {
    const artciles = await Article.find({isPublished: true});
    if (!artciles || artciles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }
    res
      .status(200)
      .json({ message: "Articles retrieved successfully", payload: artciles });
  })
);

author.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { role, name, email, password, image } = req.body;
    if (!role || !name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingAuthor = await UserAuthor.findOne({ email: email });
    if (existingAuthor) {
      return res
        .status(400)
        .json({ message: "Author already exists", payload: existingAuthor });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuthor = new UserAuthor({
      role,
      name,
      email,
      password: hashedPassword,
      image:
        image ||
        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    });
    await newAuthor.save();
    res
      .status(201)
      .json({ message: "Author registered successfully", payload: newAuthor });
  })
);

author.post(
  "/article",
  expressAsyncHandler(async (req, res) => {
    const { title, content, authorId } = req.body;
    if (!title || !content || !authorId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newArticle = new Article({
      title,
      content,
      authorId,
      dateOfPublication: new Date(),
      dateOfModification: new Date(),
      isPublished: false,
    });
    await newArticle.save();
    res
      .status(201)
      .json({ message: "Article created successfully", payload: newArticle });
  })
);

author.put("/article/:id",expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body
    const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id, modifiedArticle, { new: true });
    if (!dbRes) {
      return res.status(404).json({ message: "Article not found" });
    }   
    res.status(200).json({ message: "Article updated successfully", payload: dbRes });
}));

author.put("/articles/:id",expressAsyncHandler(async (req, res) => {
    const modifiedArticle = req.body
    const dbRes = await Article.findByIdAndUpdate(modifiedArticle._id, modifiedArticle, { new: true });
    if (!dbRes) {
      return res.status(404).json({ message: "Article not found" });
    }   
    res.status(200).json({ message: "Article updated successfully", payload: dbRes });
}));

module.exports = author;
