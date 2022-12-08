import { Command } from "commander";
import fs from "fs";

const getKeys = (ingredients) => {
  if (ingredients.length == 0) {
    return ingredients;
  } else {
    const first = ingredients[0];
    const keys = getKeys(ingredients.splice(1));
    return [
      first,
      ...keys.map((key) => {
        return `${first},${key}`;
      }),
      ...keys,
    ];
  }
};

const command = new Command("recipes");
command
  .argument("ingredients", "A list of ingredients to search - separated by ,.")
  .action((ingredients) => {
    const strDrinks = fs.readFileSync("./drinks.json");
    const dicDrinks = JSON.parse(strDrinks);

    const aryIng = ingredients
      .replaceAll(", ", ",")
      .split(",")
      .map((i) => i.toLowerCase())
      .sort();

    const keys = getKeys(aryIng);
    keys.forEach((key) => {
      const drinks = dicDrinks[key];
      if (drinks) {
        drinks.forEach((drink) => {
          console.log(drink.strDrink, " - ", drink.strInstructions);
        });
      }
    });
  });

command.parse(process.argv);
