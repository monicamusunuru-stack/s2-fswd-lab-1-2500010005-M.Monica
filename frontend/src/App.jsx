import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api/students";

function App() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        rollNumber: "",
        name: "",
        department: "",
        year: "",
        email: ""
    });

    const [message, setMessage] = useState("");

    // Get all students
    const fetchStudents = async () => {
        try {
            const response = await fetch(`${API}/all`);
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            setMessage("Unable to connect to backend.");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Add or update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = editId
            ? `${API}/update/${editId}`
            : `${API}/add`;

        const method = editId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...form,
                    year: Number(form.year)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Operation failed");
            }

            setMessage(data.message);

            setForm({
                rollNumber: "",
                name: "",
                department: "",
                year: "",
                email: ""
            });

            setEditId(null);
            fetchStudents();
        } catch (error) {
            setMessage(error.message);
        }
    };

    // Search students
    const handleSearch = async (value) => {
        setSearch(value);

        if (value.trim() === "") {
            fetchStudents();
            return;
        }

        try {
            const response = await fetch(
                `${API}/search?search=${encodeURIComponent(value)}`
            );

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            setMessage("Search failed.");
        }
    };

    // Select student for editing
    const handleEdit = (student) => {
        setEditId(student._id);

        setForm({
            rollNumber: student.rollNumber,
            name: student.name,
            department: student.department,
            year: student.year.toString(),
            email: student.email
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete student
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API}/delete/${id}`, {
                method: "DELETE"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setMessage(data.message);
            fetchStudents();
        } catch (error) {
            setMessage(error.message);
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditId(null);

        setForm({
            rollNumber: "",
            name: "",
            department: "",
            year: "",
            email: ""
        });
    };

    return (
        <div className="app">
            <header>
                <h1>Student Portal</h1>
                <p>Student Record Management System</p>
            </header>

            <main>
                <section className="form-section">
                    <h2>{editId ? "Update Student" : "Add New Student"}</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="rollNumber"
                            placeholder="Roll Number"
                            value={form.rollNumber}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="name"
                            placeholder="Student Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="department"
                            placeholder="Department"
                            value={form.department}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="year"
                            placeholder="Year of Study"
                            min="1"
                            max="6"
                            value={form.year}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">
                            {editId ? "Update Student" : "Add Student"}
                        </button>

                        {editId && (
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}
                    </form>

                    {message && <p className="message">{message}</p>}
                </section>

                <section className="list-section">
                    <h2>Student Records</h2>

                    <input
                        className="search"
                        type="text"
                        placeholder="Search by roll number or name..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Year</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.length > 0 ? (
                                    students.map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.rollNumber}</td>
                                            <td>{student.name}</td>
                                            <td>{student.department}</td>
                                            <td>{student.year}</td>
                                            <td>{student.email}</td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => handleEdit(student)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(student._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">
                                            No student records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;