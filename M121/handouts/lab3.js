/*
Using the Aggregation Framework, find a count of the number of movies that have a title composed of one word. To clarify, "Cinderella" and "3-25" should count, where as "Cast Away" would not.

Make sure you look into the $split String expression and the $size Array expression

To get the count, you can append itcount() to the end of your pipeline
*/

var pipeline = [{
	$project: {
		numberOfTitlesWithOneWord: { $split: ["$title", " "]}
	}
}, {
	$match: {
		numberOfTitlesWithOneWord: { $size: 1 }
	}
}]