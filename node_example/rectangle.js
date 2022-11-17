// module.exports.area = (l, b) => l * b;
// module.exports.perimeter = (l, b) => 2 * (l + b);

//! Error handling and call back

module.exports = (x, y, callback) => {
  if (x <= 0 || y <= 0) {
    setTimeout(() => {
      callback(
        new Error(
          `The dimension is not valid, the length is ${x} and breadth is ${y} \n`
        ),
        null
      );
    }, 2000);
  } else {
    setTimeout(() => {
      callback(null, {
        area: () => x * y,
        perimeter: () => 2 * (x + y),
      });
    }, 2000);
  }
};
