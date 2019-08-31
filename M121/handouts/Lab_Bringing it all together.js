/*

Problem:

Calculate an average rating for each movie in our collection where English is an available language, the minimum imdb.rating is at least 1, the minimum imdb.votes is at least 1, and it was released in 1990 or after. You'll be required to rescale (or normalize) imdb.votes. The formula to rescale imdb.votes and calculate normalized_rating is included as a handout.

What film has the lowest normalized_rating?

*/

// One possible solution is below.

db.movies.aggregate([
  {
    $match: {
      year: { $gte: 1990 },
      languages: { $in: ["English"] },
      "imdb.votes": { $gte: 1 },
      "imdb.rating": { $gte: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      title: 1,
      "imdb.rating": 1,
      "imdb.votes": 1,
      normalized_rating: {
        $avg: [
          "$imdb.rating",
          {
            $add: [
              1,
              {
                $multiply: [
                  9,
                  {
                    $divide: [
                      { $subtract: ["$imdb.votes", 5] },
                      { $subtract: [1521105, 5] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  },
  { $sort: { normalized_rating: 1 } },
  { $limit: 1 }
])

// We start by applying the $match filtering:

{
  $match: {
    year: { $gte: 1990 },
    languages: { $in: ["English"] },
    "imdb.votes": { $gte: 1 },
    "imdb.rating": { $gte: 1 }
  }
}

// And within the $project stage we apply the scaling and normalizating calculations:

{
  $project: {
    _id: 0,
    title: 1,
    "imdb.rating": 1,
    "imdb.votes": 1,
    normalized_rating: {
      $avg: [
        "$imdb.rating",
        {
          $add: [
            1,
            {
              $multiply: [
                9,
                {
                  $divide: [
                    { $subtract: ["$imdb.votes", 5] },
                    { $subtract: [1521105, 5] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }
},

/*
in a new computed field normalized_rating.

The first element of the result, after sorting by normalized_rating is The Christmas Tree, the expected correct answer.
*/