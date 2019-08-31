/*
Chapter 2: Basic Aggregation - Utility Stages

Problem:

MongoDB has another movie night scheduled. This time, we polled employees for their favorite actress or actor, and got these results

favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"]

For movies released in the USA with a tomatoes.viewer.rating greater than or equal to 3, calculate a new field called num_favs that represets how many favorites appear in the cast field of the movie.

Sort your results by num_favs, tomatoes.viewer.rating, and title, all in descending order.

What is the title of the 25th film in the aggregation result?

*/

// Answer

var favorites = [
  "Sandra Bullock",
  "Tom Hanks",
  "Julia Roberts",
  "Kevin Spacey",
  "George Clooney"]

db.movies.aggregate([
  {
    $match: {
      "tomatoes.viewer.rating": { $gte: 3 },
      countries: "USA",
      cast: {
        $in: favorites
      }
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      "tomatoes.viewer.rating": 1,
      num_favs: {
        $size: {
          $setIntersection: [
            "$cast",
            favorites
          ]
        }
      }
    }
  },
  {
    $sort: { num_favs: -1, "tomatoes.viewer.rating": -1, title: -1 }
  },
  {
    $skip: 24
  },
  {
    $limit: 1
  }
])

// We store our favorites in a variable for easy reference within the pipeline

var favorites = [
 "Sandra Bullock",
 "Tom Hanks",
 "Julia Roberts",
 "Kevin Spacey",
 "George Clooney"]

// We start by matching films that include at least one of our favorites in their cast

{
  $match: {
    "tomatoes.viewer.rating": { $gte: 3 },
    countries: "USA",
    cast: {
      $in: favorites
    }
  }
}

// Then, we will be projecting the num_favs value by calculating the $size of the array intersection, between the given set of favorites and the film cast:

{
  $project: {
    _id: 0,
    title: 1,
    "tomatoes.viewer.rating": 1,
    starPower: {
      $size: {
        $setIntersection: favorites
      }
    }
  }
}

// After that, we call the $sort stage and $skip + $limit in the result to the element requested:

  {
    $sort: { num_favs: -1, "tomatoes.viewer.rating": -1, title: -1 }
  },
  {
    $skip: 24
  },
  {
    $limit: 1
  }
])


