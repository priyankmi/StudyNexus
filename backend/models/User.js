// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
	{
		// Define the name field with type String, required, and trimmed
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		// Define the email field with type String, required, and trimmed
		email: {
			type: String,
			required: true,
		},

		// Define the password field with type String and required
		password: {
			type: String,
			required: true,
		},
		// Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
		role: {
			type: String,
			enum: ["Admin", "Student", "Instructor"],
			required: true,
		},
		profileDetails: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
		},
		courses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],
		courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],
		TestSeries: [
			{
				 type: mongoose.Schema.Types.ObjectId, ref: 'TestSeries' 
			}
		], // for instructors



		// Add timestamps for when the document is created and last modified
	},
	{ timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User", userSchema);