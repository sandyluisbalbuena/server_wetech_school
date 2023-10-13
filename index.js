const express = require('express')
const app = express()
const firebase = require('./firebase'); 
const port = 8000

app.use(express.json())


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



// Endpoint to add a new user
app.post('/api/enroll', async (req, res) => {

	const { firstname, middlename, lastname, birthday, gender, username, email, password } = req.body;

	// Check if any of the required fields is missing
	if (!firstname || !middlename || !lastname || !birthday || !gender || !username || !email || !password ||
		firstname=="" || middlename=="" || lastname=="" || birthday=="" || gender=="" || username=="" || email=="" || password=="") {
		return res.status(400).json({ error: 'All fields are required' });
	}

	try {
		
		await firebase.auth().createUserWithEmailAndPassword(email, password);
		const userId = firebase.auth().currentUser.uid;
		const role = 'student';
		const image = 'pikachu';
		const userRef = firebase.database().ref(`users/${userId}`);

		userRef.set({
			firstname,
			middlename,
			lastname,
			birthday,
			gender,
			username,
			email,
			role,
			image
		});

		res.status(200).json({ message: "User added successfully" });
	} catch (error) {
		console.error('Error adding a new user:', error);
		res.status(500).json({ error: 'Unable to add a new user' });
	}
});


app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});