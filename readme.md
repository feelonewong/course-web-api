`docker-compose up -d 拉取命令`



`127.0.0.1   root  3306`

安装sequelize-cli、 sequelize  mysql2

初始化数据库`sequelize init`，会生成config、seeders种子文件

`生成新建模型 sequelize model:generate --name Article --attributes title:string,content:text`

数据库迁移：`sequelize db:migrate`

生成种子文件: `sequelize seed:generate --name article`

根据种子文件填充数据:
`sequelize db:seed --seed  20260116102521-article.js`


npx sequelize-cli db:migrate:undo

# 2. 修改迁移文件后重新运行迁移
npx sequelize-cli db:migrate



Categories：分类表
id（编号）: integer，主键，不为null，无符号，自增 
name（名称）：varchar，不为null
rank（排序）：integer，无符号，不为null，默认值：1

Courses：课程表
id（编号）: integer，主键，不为null，无符号，自增 
categoryId（分类 ID）：integer，无符号，不为null，index索引
userId（用户Id）：integer，无符号，不为null，index索引
name（名称）：varchar，不为null
image（课程图片）：varchar
recommended（是否推荐课程）: boolean，不为null，默认false，index索引
introductory（是否入门课程）：boolean，不为null，默认false，index索引
content（课程内容）：text
likesCount（课程的点赞数量）：integer，无符号，不为null，默认0
chaptersCount（课程的章节数量）: integer，无符号，不为null，默认0

Chapters：章节表
id（编号）: integer，主键，不为null，无符号，自增
courseId（课程 ID）：integer，无符号，不为null，index索引
title（章节标题）：varchar，不为null
content（章节内容）：text
video（视频地址）：varchar
rank（排序）：integer，无符号，默认值1，不为null

Users：用户表
id（编号）: integer，主键，不为null，无符号，自增
email（电子邮箱）：varchar，不为null，unique索引
username（用户名）：varchar，不为null，unique索引
nickname（昵称）：varchar，不为null
password（密码）：varchar，不为null
avatar（头像）: varchar
sex（性别）：tinyint，不为null，无符号。0为男性，1为女性，2为不选择。默认为：2
company（公司・学校名）: varchar
introduce（自我介绍）：text
role（用户组）：tinyint，不为null，无符号，index索引。0为普通用户，100为管理员。默认为：0

Likes：点赞表
id（编号）: integer，主键，不为null，无符号，自增
courseId（课程ID）：integer，无符号，不为null，index索引
userId（用户ID）：integer，无符号，不为null，index索引


Settings：设置表
id（编号）: integer，主键，不为null，无符号，自增
name（项目名称）：varchar
icp（备案号）：varchar
copyright（版权信息）：varchar

1. 生成种子文件
```
sequelize seed:generate --name setting
```
2. 修改seeder/setting.js 文件内容(用于填充数据)
```
async up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Settings', [{
    name: 'Couse web api',
    icp: '鄂ICP备13016268号-11',
    copyright: '© 2013 Changle Weiyang Inc. All Rights Reserved.',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
},

async down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Settings', null, {});
}
```

3. 运行种子文件
```
sequelize db:seed --seed 20260118140533-setting
```
