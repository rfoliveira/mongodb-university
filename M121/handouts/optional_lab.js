/*
This lab will have you work with data within arrays, a common operation.

Specifically, one of the arrays you'll work with is writers, from the movies collection.

There are times when we want to make sure that the field is an array, and that it is not empty. We can do this within $match
*/

{ $match: { writers: { $elemMatch: { $exists: true } } }

// However, the entries within writers presents another problem. A good amount of entries in writers look something like the following, where the writer is attributed with their specific contribution

"writers" : [ "Vincenzo Cerami (story)", "Roberto Benigni (story)" ]

/*
But the writer also appears in the cast array as "Roberto Benigni"!

Give it a look with the following query
*/

db.movies.findOne({title: "Life Is Beautiful"}, { _id: 0, cast: 1, writers: 1})

/*
This presents a problem, since comparing "Roberto Benigni" to "Roberto Benigni (story)" will definitely result in a difference.

Thankfully there is a powerful expression to help us, $map. $map lets us iterate over an array, element by element, performing some transformation on each element. 
The result of that transformation will be returned in the same place as the original element.

Within $map, the argument to input can be any expression as long as it resolves to an array. 
The argument to as is the name of the variable we want to use to refer to each element of the array when performing whatever logic we want. 
The field as is optional, and if omitted each element must be referred to as $$this:: The argument to in is the expression that is applied to each element of the input array, 
referenced with the variable name specified in as, and prepending two dollar signs:
*/

writers: {
  $map: {
    input: "$writers",
    as: "writer",
    in: "$$writer"

/*
in is where the work is performed. 
Here, we use the $arrayElemAt expression, which takes two arguments, the array and the index of the element we want. 
We use the $split expression, splitting the values on " (".

If the string did not contain the pattern specified, the only modification is it is wrapped in an array, so $arrayElemAt will always work
*/    

writers: {
  $map: {
    input: "$writers",
    as: "writer",
    in: {
      $arrayElemAt: [
        {
          $split: [ "$$writer", " (" ]
        },
        0
      ]
    }
  }
}

/*
Problem:
--------

Let's find how many movies in our movies collection are a "labor of love", where the same person appears in cast, directors, and writers

Note that you may have a dataset that has duplicate entries for some films. Don't worry if you count them few times, meaning you should not try to find those duplicates.

To get a count after you have defined your pipeline, there are two simple methods.
*/

// add the $count stage to the end of your pipeline
// you will learn about this stage shortly!
db.movies.aggregate([
  {$stage1},
  {$stage2},
  ...$stageN,
  { $count: "labors of love" }
])

// or use itcount()
db.movies.aggregate([
  {$stage1},
  {$stage2},
  {...$stageN},
]).itcount()

// Solution

db.movies.aggregate([
  {
    $match: {
      cast: { $elemMatch: { $exists: true } },
      directors: { $elemMatch: { $exists: true } },
      writers: { $elemMatch: { $exists: true } }
    }
  },
  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
        $map: {
          input: "$writers",
          as: "writer",
          in: {
            $arrayElemAt: [
              {
                $split: ["$$writer", " ("]
              },
              0
            ]
          }
        }
      }
    }
  },
  {
    $project: {
      labor_of_love: {
        $gt: [
          { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
          0
        ]
      }
    }
  },
  {
    $match: { labor_of_love: true }
  },
  {
    $count: "labors of love"
  }
])

// Explanation:
// With our first $match stage, we filter out documents that are not an array or have an empty array for the fields we are interested in.

{
  $match: {
    cast: { $elemMatch: { $exists: true } },
    directors: { $elemMatch: { $exists: true } },
    writers: { $elemMatch: { $exists: true } }
  }
},

// Next is a $project stage, removing the _id field and retaining both the directors and cast fields. We replace the existing writers field with a new computed value, cleaning up the strings within writers

  {
    $project: {
      _id: 0,
      cast: 1,
      directors: 1,
      writers: {
          $map: {
            input: "$writers",
            as: "writer",
            in: {
              $arrayElemAt: [
                {
                  $split: ["$$writer", " ("]
                },
                0
              ]
            }
          }
        }
      }
    }
  }
},

// We use another $project stage to computer a new field called labor_of_love that ensures the intersection of cast, writers, and our newly cleaned directors is greater than 0. 
// This definitely means that at least one element in each array is identical! $gt will return true or false.

{
  $project: {
    labor_of_love: {
      $gt: [
        { $size: { $setIntersection: ["$cast", "$directors", "$writers"] } },
        0
      ]
    }
  }
},

/*
Lastly, we follow with a $match stage, only allowing documents through where labor_of_love is true. 
In our example we use a $match stage, but itcount() works too.
*/

{
  $match: { labor_of_love: true }
},
{
  $count: "labors of love"
}

// or

  {
    $match: { labor_of_love: true }
  }
]).itcount()

// This produces 1597, as expected.