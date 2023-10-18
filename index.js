const express = require("express");
const app = express();
const firebase = require("./firebase");
const port = 8000;

app.use(express.json());

// Endpoint to get all users
app.get("/api/users", async (req, res) => {
	try {
		const usersSnapshot = await firebase.database().ref("users").once("value");
		const usersData = usersSnapshot.val();

		if (usersData) {
			const usersArray = Object.values(usersData);
			res.json(usersArray);
		} else {
			res.json([]);
		}
	} catch (error) {
		console.error("Error retrieving users:", error);
		res.status(500).json({ error: "Unable to retrieve users" });
	}
});

// Endpoint to add a new user
app.post("/api/enroll", async (req, res) => {
	const {
		firstname,
		middlename: mname,
		lastname,
		birthday,
		gender,
		discordId,
		email,
		password,
		username,
		courseId,
	} = req.body;

	// const items = Object.entries(req.body);

	// const errorMess = [];

	// try {
	// 	for (const [key, value] of items) {
	// 		if (!value) {
	// 			errorMess.push([key, "is required.."]);
	// 		}
	// 	}
	// } catch (error) {
	// 	console.log(error);
	// 	return res.status(200).json({ error: error });
	// }

	// if (errorMess.length) {
	// 	return res.status(505).json({ error: errorMess });
	// }

	try {
		await firebase.auth().createUserWithEmailAndPassword(username, password);
		const userId = firebase.auth().currentUser.uid;
		const role = "student";
		const image = "caterpie";
		const status = "pending";
		const batch = "pending";
		const lvl = 1;
		const batchesId =
			courseId == "c++" ? { "2021-10-u1": true } : { "2021-10-u2": true };
		const middlename = mname ? mname : "";
		const userRef = firebase.database().ref(`users/${userId}`);

		userRef.set({
			firstname,
			middlename,
			lastname,
			birthday,
			gender,
			discordId,
			email,
			role,
			image,
			status,
			batch,
			email,
			batchesId,
			lvl,
		});

		res.status(200).json({ message: "User added successfully" });
	} catch (error) {
		console.error("Error adding a new user:", error);
		res.status(500).json({ error: "Unable to add a new user" });
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
