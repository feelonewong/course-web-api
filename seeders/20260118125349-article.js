"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const articles = [];
    const count = 100;
    for (let i = 0; i < count; i++) {
      articles.push({
        title: `文章的标题 ${i}`,
        content: `文章的内容 ${i}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("Articles", articles, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Articles", null, {});
  },
};
