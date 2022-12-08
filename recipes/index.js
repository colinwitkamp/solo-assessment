import fetch from "node-fetch";
import fs from "fs";

const types = ["vodka", "whiskey", "rum", "tequila", "brandy", "gin"];

const fetchDrinks = async (type) => {
  try {
    const res = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${type}`
    );
    const data = await res.json();
    return data.drinks;
  } catch (e) {
    console.error("failed to fetch recipes for type:", type, e);
  }
  return [];
};

const getKey = (drink) => {
  // extract ingredients
  const ingredients = Array.from({ length: 15 }, (v, i) => {
    return drink[`strIngredient${i + 1}`];
  }).filter((i) => i); // exclude empty ingredients

  const key = ingredients
    .map((i) => i.toLowerCase())
    .sort()
    .join(",");

  return key;
};

const main = async () => {
  const aryDrinks = await Promise.all(
    types.map((type) => {
      return fetchDrinks(type);
    })
  );
  const drinks = aryDrinks.flat();

  // index
  const dic = {}; // { key: [drink] }

  drinks.forEach((drink) => {
    const key = getKey(drink);
    const indexed = dic[key] || [];
    const exists =
      indexed.findIndex(({ idDrink }) => {
        return idDrink == drink.idDrink;
      }) > -1;

    if (!exists) {
      indexed.push({
        idDrink: drink.idDrink,
        strDrink: drink.strDrink,
        strInstructions: drink.strInstructions,
      });
    }
    dic[key] = indexed;
  });

  // write
  fs.writeFileSync("./drinks.json", JSON.stringify(dic, null, 2));

  console.info("Drinks indexed!");
};

main();
