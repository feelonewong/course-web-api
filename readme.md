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