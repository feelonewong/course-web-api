const express = require("express");
const router = express.Router();
const { Article } = require("../../models");

// 查询文章列表 /admin/articles
router.get("/", async function (req, res) {
  try {
    // 筛选条件
    const condition = {
      order: [["id", "DESC"]],
    };

    const articles = await Article.findAll(condition);

    res.json({
      status: 200,
      message: "数据查询成功",
      data: {
        articles,
      },
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "数据查询失败",
      errors: [error.message],
    });
  }
});

module.exports = router;
