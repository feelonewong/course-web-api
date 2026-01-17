const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
// 查询文章列表 /admin/articles
// ?title=xx query参数传递
router.get("/", async function (req, res) {
  try {
    // 筛选条件
    const query = req.query;
    // currentPage & pageSize
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      order: [["id", "DESC"]],
      offset: offset,
      limit: pageSize,
    };
    console.log("currentPage", currentPage, "limit", pageSize);

    // 模糊查询的条件 ?title=xxx
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }

    const articles = await Article.findAndCountAll(condition);
    res.json({
      status: 200,
      message: "数据查询成功",
      data: {
        articles: articles.rows,
        pagination: {
          total: articles.count,
          currentPage,
          pageSize,
        },
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

    const body = filterBody(req);

    // 条件判断增加在模型中
    // if (!body.title) {
    //   return res.status(400).json({
    //     status: false,
    //     data: "标题不能为空",
    //   });
    // }
    const articles = await Article.create(body);
    res.json({
      status: 200,
      message: "文章创建成功",
      data: {
        articles,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.json({
        status: 500,
        message: "数据查询失败",
        errors: error.errors.map((item) => {
          return item.message;
        }),
      });
    } else {
      res.json({
        status: 500,
        message: "数据查询失败",
        errors: { error },
      });
    }
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

// 更新文章 /admin/articles/:id
router.put("/:id", async function (req, res) {
  try {
    // 先查询数据 如果查不到数据就不更新
    const { id } = req.params;
    const articles = await Article.findByPk(id);
    if (articles) {
      const body = filterBody(req);
      await articles.update(body);

      res.json({
        status: true,
        message: "文章更新成功",
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

// 公共方法白名单过滤
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}

module.exports = router;
