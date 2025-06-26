const exp = require("express");
const bcrypt = require("bcryptjs");
const UserAuthor = require("../models/UserAuthor");
const Article = require("../models/Article");
const author = exp.Router();

author.post("/register", async (req, res) => {
  const { role, name, email, password, image } = req.body;
  if (!role || !name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingAuthor = await UserAuthor.find({ email: email });
  if (existingAuthor) {
    return res
      .status(200)
      .send({ message: "Author already exists", payload: existingAuthor });
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
});

author.post("/article", async (req, res) => {
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
});

module.exports = author;
