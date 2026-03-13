function capitalizeEachFirstCharOfWord(str) {
  const splited = str.split(" ");
  console.log("splited -> ", splited);
  const capitalized = splited.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  console.log("capitalized -> ", capitalized);
  const joined = capitalized.join(" ");
  console.log("joined -> ", joined);
  return joined;
}

const initialCategory = "audio";
const categoryQuery = capitalizeEachFirstCharOfWord(initialCategory);

console.log(categoryQuery);