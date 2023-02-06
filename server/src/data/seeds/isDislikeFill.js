export async function seed(knex) {
  await knex.schema.table('post_reactions', table => {
    table.boolean('isDislike').notNullable().defaultTo(false);
  });
}
