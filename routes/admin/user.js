const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const { Op } = require("sequelize");
const { NotFoundError, success, failure } = require("../../utils/response");
// 查询用户列表 /admin/users
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
    if (query.email) {
      condition.where = {
        email: {
          [Op.eq]: query.email,
        },
      };
    }

    if (query.username) {
      condition.where = {
        username: {
          [Op.eq]: query.username,
        },
      };
    }

    if (query.nickname) {
      condition.where = {
        nickname: {
          [Op.like]: `%${query.nickname}%`,
        },
      };
    }

    if (query.role) {
      condition.where = {
        role: {
          [Op.eq]: query.role,
        },
      };
    }

    const { rows, count } = await User.findAndCountAll(condition);
    success(res, "查询用户列表成功。", {
      users: rows,
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

// 查询用户列表详情 /admin/users/:id
router.get("/:id", async function (req, res) {
  try {
    // 筛选条件
    const user = await getUser(req);
    success(res, "查询用户成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

// 新建用户 /admin/users
router.post("/", async function (req, res) {
  try {
    // 筛选条件

    const body = filterBody(req);

    const user = await User.create(body);

    success(res, "创建用户成功。", { user }, 201);
  } catch (error) {
    failure(res, error);
  }
});

// 更新用户 /admin/users/:id
router.put("/:id", async function (req, res) {
  try {
    // 先查询数据 如果查不到数据就不更新
    // const { id } = req.params;
    // const users = await User.findByPk(id);

    const user = await getUser(req);
    const body = filterBody(req);
    await users.update(body);

    success(res, "更新用户成功。", { user });
  } catch (error) {
    failure(res, error);
  }
});

// 公共方法白名单过滤
function filterBody(req) {
  return {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    nickname: req.body.nickname,
    sex: req.body.sex,
    company: req.body.company,
    introduce: req.body.introduce,
    role: req.body.role,
    avatar: req.body.avatar,
  };
}

async function getUser(req) {
  // 获取用户id
  const { id } = req.params;

  // 查询当前用户
  const user = await User.findByPk(id);

  // 如果没找到就会抛出异常
  if (!user) {
    throw new NotFoundError(`ID: ${id}的用户未找到`);
  }
  return user;
}

module.exports = router;
