// simple first example
db.solarSystem.aggregate([{
	$project: {
		_id: 0,
		name: 1
	}
}])

// é o mesmo que 
db.solarSystem.find({}, { _id: 0, name: 1})

///////////////////////////////////////////

db.solarSystem.find({}, {
	_id: 0,
	name: 1,
	"gravity.value": 1
})

// é o mesmo que 

db.solarSystem.aggregate([{
	$project: {
		_id: 0,
		name: 1,
		"gravity.value": 1
	}
}])

// caso queira usar um alias para "gravity.value"
db.solarSystem.aggregate([{
	$project: {
		_id: 0,
		name: 1,
		"gravity": "$gravity.value"
	}
}])

// para criar um novo campo com o valor de um já existente

db.solarSystem.aggregate([{
	$project: {
		_id: 0,
		name: 1,
		"surfaceGravity": "$gravity.value"
	}
}])