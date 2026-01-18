const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");
const { Course, Category, User } = require("../../models");

// 查询文章列表 /admin/courses
// ?title=xx query参数传递
router.get("/", async function (req, res) {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    const condition = {
      ...getCondition(),
      where: {},
      order: [["id", "DESC"]],
      limit: pageSize,
      offset: offset,
    };

    if (query.categoryId) {
      condition.where.categoryId = query.categoryId;
    }

    if (query.userId) {
      condition.where.userId = query.userId;
    }

    if (query.name) {
      condition.where.name = {
        [Op.like]: `%${query.name}%`,
      };
    }

    if (query.recommended) {
      condition.where.recommended = query.recommended === "true";
    }

    if (query.introductory) {
      condition.where.introductory = query.introductory === "true";
    }

    const { count, rows } = await Course.findAndCountAll(condition);
    success(res, "查询课程列表成功。", {
      courses: rows,
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

// 查询文章列表详情 /admin/courses/:id
router.get("/:id", async function (req, res) {
  try {
    // 筛选条件
    const courses = await getCourse(req);
    success(res, "查询文章成功。", { courses });
  } catch (error) {
    failure(res, error);
  }
});

// 新建文章 /admin/courses
router.post("/", async function (req, res) {
  try {
    // 筛选条件

    const body = filterBody(req);

    const courses = await Course.create(body);

    success(res, "创建文章成功。", { courses }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 删除 /admin/courses/:id
router.delete("/:id", async function (req, res) {
  try {
    const courses = await getCourse(req);

    await courses.destroy();
    success(res, "删除文章成功。");
  } catch (error) {
    failure(res, error);
  }
});

// 更新文章 /admin/courses/:id
router.put("/:id", async function (req, res) {
  try {
    // 先查询数据 如果查不到数据就不更新
    // const { id } = req.params;
    // const courses = await Course.findByPk(id);

    const courses = await getCourse(req);
    const body = filterBody(req);
    await courses.update(body);

    success(res, "更新文章成功。", { courses });
  } catch (error) {
    failure(res, error);
  }
});

// 公共方法白名单过滤
/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: *, name, introductory: (boolean|*), userId: (number|*), categoryId: (number|*), content, recommended: (boolean|*)}}
 */
function filterBody(req) {
  return {
    categoryId: req.body.categoryId,
    userId: req.body.userId,
    name: req.body.name,
    image: req.body.image,
    recommended: req.body.recommended,
    introductory: req.body.introductory,
    content: req.body.content,
  };
}

/**
 * 公共方法：关联分类、用户数据
 * @returns {{include: [{as: string, model, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
  return {
    attributes: { exclude: ["CategoryId", "UserId"] },
    include: [
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "avatar"],
      },
    ],
  };
}

/**
 * 公共方法：查询当前课程
 */
async function getCourse(req) {
  const { id } = req.params;
  const condition = getCondition();

  const course = await Course.findByPk(id, condition);
  if (!course) {
    throw new NotFoundError(`ID: ${id}的课程未找到。`);
  }

  return course;
}

module.exports = router;
