const express = require("express");
const router = express.Router();
const { Article } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");
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

    // 模糊查询的条件 ?title=xxx
    if (query.title) {
      condition.where = {
        title: {
          [Op.like]: `%${query.title}%`,
        },
      };
    }

    const { rows, count } = await Article.findAndCountAll(condition);
    success(res, "查询文章列表成功。", {
      articles: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error)
  }
});

// 查询文章列表详情 /admin/articles/:id
router.get("/:id", async function (req, res) {
  try {
    // 筛选条件
    const article = await getArticle(req);
    success(res, "查询文章成功。", { article });
  } catch (error) {

    failure(res, error)

  }
});

// 新建文章 /admin/articles
router.post("/", async function (req, res) {
  try {
    // 筛选条件

    const body = filterBody(req);

    const article = await Article.create(body);
 
    success(res, '创建文章成功。', { article }, 201);

  } catch (error) {
    failure(res, error)
  }
});

// 删除 /admin/articles/:id
router.delete("/:id", async function (req, res) {
  try {
    const articles = await getArticle(req);
   
    await articles.destroy();
    success(res, '删除文章成功。');

  } catch (error) {
    failure(res, error)
  }
});

// 更新文章 /admin/articles/:id
router.put("/:id", async function (req, res) {
  try {
    // 先查询数据 如果查不到数据就不更新
    // const { id } = req.params;
    // const articles = await Article.findByPk(id);

    const article = await getArticle(req);
    const body = filterBody(req);
    await articles.update(body);

    

    success(res, '更新文章成功。', { article });

  } catch (error) {
    failure(res, error)
  }
});

// 公共方法白名单过滤
function filterBody(req) {
  return {
    title: req.body.title,
    content: req.body.content,
  };
}

async function getArticle(req) {
  // 获取文章id
  const { id } = req.params;

  // 查询当前文章
  const article = await Article.findByPk(id);

  // 如果没找到就会抛出异常
  if (!article) {
    throw new NotFoundError(`ID: ${id}的文章未找到`);
  }
  return article;
}

module.exports = router;
