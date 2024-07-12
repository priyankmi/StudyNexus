const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    currentLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
}, { timestamps: true });

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);

module.exports = CourseProgress;