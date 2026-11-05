const express = require("express");
const router = express.Router();

const Student = require("../modules/Student");

// 1. Add a new student
router.post("/add", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student
        });
    } catch (error) {
        res.status(400).json({
            message: "Error adding student",
            error: error.message
        });
    }
});

// 2. View all students
router.get("/all", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Search student by roll number or name
router.get("/search", async (req, res) => {
    try {
        const search = req.query.search || "";

        const students = await Student.find({
            $or: [
                { rollNumber: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } }
            ]
        });

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Update student
router.put("/update/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. Delete student
router.delete("/delete/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;