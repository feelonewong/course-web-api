const express = require("express");
const router = express.Router();
const { Category } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");
// 查询分类列表 /admin/categories
// ?name=xx query参数传递
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

    // 模糊查询的条件 ?name=xxx
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`,
        },
      };
    }

    const { rows, count } = await Category.findAndCountAll(condition);
    success(res, "查询分类列表成功。", {
      categories: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    failure(res, error);
  }
});

// 查询分类列表详情 /admin/categories/:id
router.get("/:id", async function (req, res) {
  try {
    // 筛选条件
    const article = await getCategory(req);
    success(res, "查询分类成功。", { article });
  } catch (error) {
    failure(res, error);
  }
});

// 新建分类 /admin/categories
router.post("/", async function (req, res) {
  try {
    // 筛选条件

    const body = filterBody(req);

    const article = await Category.create(body);

    success(res, "创建分类成功。", { article }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除 /admin/categories/:id
router.delete("/:id", async function (req, res) {
  try {
    const categories = await getCategory(req);

    await categories.destroy();
    success(res, "删除分类成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新分类 /admin/categories/:id
router.put("/:id", async function (req, res) {
  try {
    // 先查询数据 如果查不到数据就不更新
    // const { id } = req.params;
    // const categories = await Category.findByPk(id);

    const article = await getCategory(req);
    const body = filterBody(req);
    await categories.update(body);

    success(res, "更新分类成功。", { article });
  } catch (error) {
    failure(res, error);
  }
});

// 公共方法白名单过滤
function filterBody(req) {
  return {
    name: req.body.name,
    rank: req.body.rank,
  };
}

async function getCategory(req) {
  // 获取分类id
  const { id } = req.params;

  // 查询当前分类
  const article = await Category.findByPk(id);

  // 如果没找到就会抛出异常
  if (!article) {
    throw new NotFoundError(`ID: ${id}的分类未找到`);
  }
  return article;
}

module.exports = router;
