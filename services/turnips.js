const mongoose = require("mongoose");
const { TurnipTrend } = require("../models");

exports.add = (author) => {
  return TurnipTrend.create({
    _id: new mongoose.Types.ObjectId(),
    author,
  });
};

exports.findLatestTrend = (author, thisSunday) => {
  return TurnipTrend.findOne({
    author,
    createdAt: { $gte: thisSunday },
  }).sort({ createdAt: -1 });
};

exports.findAll = (lastSunday) => {
  return TurnipTrend.find({ createdAt: { $gte: lastSunday } }).populate({
    path: "author",
    select: "pseudo avatar",
  });
};

exports.findByAuthor = (author, lastSunday) => {
  return TurnipTrend.findOne({
    author,
    createdAt: { $gte: lastSunday },
  }).populate({
    path: "author",
    select: "pseudo avatar",
  });
};

exports.findCurrentPrice = (dayName, dayTime, lastSunday) => {
  return TurnipTrend.find({ createdAt: { $gte: lastSunday } })
    .populate({
      path: "author",
      select: "pseudo avatar",
    })
    .select(`author prices.${dayName}.${dayTime}`);
};

exports.addCurrentPrice = (dayName, dayTime, lastSunday, author, price) => {
  return TurnipTrend.findOneAndUpdate(
    { author, createdAt: { $gte: lastSunday } },
    {
      $set: {
        [`prices.${dayName}.${dayTime}`]: price,
      },
    },
    {
      new: true,
    }
  )
    .populate({
      path: "author",
      select: "pseudo avatar",
    })
    .select(`author prices.${dayName}.${dayTime}`);
};

exports.setSundayPrice = (thisSunday, author, sundayPrice) => {
  return TurnipTrend.findOneAndUpdate(
    { author, createdAt: { $gte: thisSunday } },
    { sundayPrice },
    { new: true }
  ).populate({
    path: "author",
    select: "pseudo avatar",
  });
};

exports.setTurnipQuantity = (thisSunday, author, turnipsOwned) => {
  return TurnipTrend.findOneAndUpdate(
    { author, createdAt: { $gte: thisSunday } },
    { turnipsOwned },
    { new: true }
  ).populate({
    path: "author",
    select: "pseudo avatar",
  });
};

exports.setTurnipValue = (thisSunday, author, turnipsOwnedValue) => {
  return TurnipTrend.findOneAndUpdate(
    { author, createdAt: { $gte: thisSunday } },
    { turnipsOwnedValue },
    { new: true }
  ).populate({
    path: "author",
    select: "pseudo avatar",
  });
};
