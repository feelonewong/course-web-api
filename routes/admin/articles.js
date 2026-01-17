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

// 查询文章列表详情 /admin/articles/:id
router.get("/:id", async function (req, res) {
  try {
    // 筛选条件
    const { id } = req.params;
    const articles = await Article.findByPk(id);

    if (articles) {
      res.json({
        status: 200,
        message: "数据查询成功",
        data: {
          articles,
        },
      });
    } else {
      res.json({
        status: 404,
        message: "数据查询失败",
        data: {
          articles,
        },
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: "数据查询失败",
      errors: [error.message],
    });
  }
});

// 新建文章 /admin/articles
router.post("/", async function (req, res) {
  try {
    // 筛选条件
    if (!req.body.title) {
      res.json({
        status: 200,
        data: "标题不能为空",
      });
    }
    const articles = await Article.create(req.body);
    res.json({
      status: 200,
      message: "文章创建成功",
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

// 删除 /admin/articles/:id
router.delete("/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const articles = await Article.findByPk(id);
    if (articles) {
      await articles.destroy();

      res.json({
        status: true,
        message: "文章删除成功",
      });
    } else {
      res.status(404).json({
        status: false,
        message: "文章未找到",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "数据查询失败",
      errors: [error.message],
    });
  }
});
module.exports = router;
