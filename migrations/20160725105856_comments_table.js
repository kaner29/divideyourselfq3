
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments();
    table.integer('user_id').notNullable().references('id').inTable('users');
    table.integer('post_id').notNullable().references('id').inTable('posts');
    table.text('comment').notNullable();
    table.bigInteger('timestamp').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};