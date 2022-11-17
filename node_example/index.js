const rect = {
  perimeter: (l, b) => 2 * (l + b),
  area: (l, b) => l * b,
};

function solveRectangle(l, b) {
  console.log(`THe length is ${l} and breadth is ${b} `);
  if (l <= 0 || b <= 0) {
    console.log(
      `The dimension is not valid, the length is ${l} and breadth is ${b}`
    );
    console.log("\n");
  } else {
    console.log(`The perimeter of a rectangle is ${rect.perimeter(l, b)}`);
    console.log(`The area of a rectangle is ${rect.area(l, b)}`);
    console.log("\n");
  }
}

//! Output
solveRectangle(10, 5);
solveRectangle(-1, 5);
solveRectangle(0, 5);
solveRectangle(1, 5);
solveRectangle(12, 53);
