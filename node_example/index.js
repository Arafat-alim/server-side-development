// const rect = {
//   perimeter: (l, b) => 2 * (l + b),
//   area: (l, b) => l * b,
// };

const rect = require("./rectangle");

function solveRectangle(l, b) {
  console.log(`THe length is ${l} and breadth is ${b} `);
  // if (l <= 0 || b <= 0) {
  //   console.log(
  //     `The dimension is not valid, the length is ${l} and breadth is ${b}`
  //   );
  //   console.log("\n");
  // } else {
  //   console.log(`The perimeter of a rectangle is ${rect.perimeter(l, b)}`);
  //   console.log(`The area of a rectangle is ${rect.area(l, b)}`);
  //   console.log("\n");
  // }
  rect(l, b, (err, rectangle) => {
    if (err) {
      console.log("Error: ", err.message);
    } else {
      console.log(`The perimeter of a rectangle is ${rectangle.perimeter()}`);
      console.log(`The area of a rectangle is ${rectangle.area()}`);
    }
  });
}

//! Output
solveRectangle(10, 5);
solveRectangle(-1, 5);
solveRectangle(0, 5);
solveRectangle(1, 5);
solveRectangle(12, 53);
