const db = require("../../data/db-config");

async function fetchIngredients(step_id) {
  return await db("step_ingredients as i")
    .select(
      "step_id",
      "ingredient_name",
      "step_ingredient_id as ingredient_id",
      "quantity"
    )
    .leftJoin("ingredients as ig", "i.ingredient_id", "=", "ig.ingredient_id")
    .where("i.step_id", step_id);
}

async function getRecipeById(recipe_id) {
  // THIS IS MY QUERY

  // select recipe_name, created_at, st.*, i.*
  // from recipes as r
  // left join steps as st
  // 	on r.recipe_id = st.recipe_id
  // left join step_ingredients as i
  // 	on st.step_id = i.step_id
  // where r.recipe_id = 1
  // group by st.step_number

  const rows = await db("recipes as r")
    .select(
      "r.*",
      "st.step_id",
      "st.step_name",
      "st.step_instructions",
      "ig.ingredient_name",
      "ig.ingredient_id",
      "i.quantity",
      "i.step_id as ingredient_step_id"
    )
    .leftJoin("steps as st", "r.recipe_id", "=", "st.recipe_id")
    .leftJoin("step_ingredients as i", "st.step_id", "=", "i.step_id")
    .leftJoin("ingredients as ig", "i.ingredient_id", "=", "ig.ingredient_id")
    .where("r.recipe_id", recipe_id)
    .orderBy("st.step_number");

  const results = {
    recipe_id: rows[0].recipe_id,
    recipe_name: rows[0].recipe_name,
    created_at: rows[0].created_at,
    steps: rows[0].step_id
      ? rows.map((row) => {
          return {
            step_id: row.step_id,
            step_number: row.step_number,
            step_instructions: row.step_instructions,
            ingredients: [],
          };
        })
      : [],
  };

  rows.map((row,idx) => {
    if (row.step_id == row.ingredient_step_id) {
        results.steps[row.step_id - 1].ingredients.push({
            ingredient_id: row.ingredient_id,
            ingredient_name: row.ingredient_name,
            quantity: row.quantity
        })
    }
  });

  return results;
}

module.exports = {
  getRecipeById,
  fetchIngredients,
};
