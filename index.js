const express = require('express')
const app = express()
const firebase = require('./firebase'); 
const port = 8000


// Endpoint to get all users
app.get('/api/users', async (req, res) => {
	try {
		const usersSnapshot = await firebase.database().ref('users').once('value');
		const usersData = usersSnapshot.val();

		if (usersData) {
			const usersArray = Object.values(usersData);
			res.json(usersArray);
		} else {
			res.json([]);
		}
		
	} catch (error) {
		console.error('Error retrieving users:', error);
		res.status(500).json({ error: 'Unable to retrieve users' });
	}
});

app.get('/api/enroll', async (req, res) => {
	try {
		const usersSnapshot = await firebase.database().ref('users').once('value');
		const usersData = usersSnapshot.val();

		if (usersData) {
			const usersArray = Object.values(usersData);
			res.json(usersArray);
		} else {
			res.json([]);
		}
		
	} catch (error) {
		console.error('Error retrieving users:', error);
		res.status(500).json({ error: 'Unable to retrieve users' });
	}
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})