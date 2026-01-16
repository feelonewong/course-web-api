const express = require("express");
const router = express.Router();
const { Article } = require("../../models");

router.get("/", async function (req, res) {
  // 筛选条件
  const condition = {
    order: [["id", "DESC"]],
  };

  const articles = await Article.findAll(condition);

  res.json({
    stats: true,
    message: "数据查询成功",
    data: {
      articles,
    },
  });
});

module.exports = router;
