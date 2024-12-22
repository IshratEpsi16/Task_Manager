import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const TaskDetails = () => {
    const { id } = useParams(); // Get the task ID from the URL params
    const [task, setTask] = useState(null);
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [isEditMode, setIsEditMode] = useState(false); // State to toggle edit mode
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // State for delete confirmation
    const navigate = useNavigate();

    // Find the task by id
    useEffect(() => {
        const foundTask = tasks.find((t) => t.id === parseInt(id)); // Ensure id is parsed correctly
        if (foundTask) {
            setTask(foundTask);
        }
    }, [id, tasks]);

    const handleDelete = () => {
        const updatedTasks = tasks.filter((t) => t.id !== parseInt(id));
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        navigate('/'); // Redirect to the task list after deletion
    };

    const handleConfirmDelete = () => {
        handleDelete(); // Proceed with deletion
        setIsDeleteModalVisible(false); // Close the confirmation modal
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false); // Close the confirmation modal without deleting
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTask((prevTask) => ({
                    ...prevTask,
                    images: [...prevTask.images, reader.result], // Add the new image URL
                }));
            };
            reader.readAsDataURL(file); // Convert image to base64
        }
    };

    const handleSave = () => {
        const updatedTasks = tasks.map((t) => (t.id === parseInt(id) ? task : t));
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Save updated tasks to localStorage
        setIsEditMode(false); // Switch back to view mode after saving
    };

    if (!task) {
        return <p>Task not found!</p>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Task Details</h2>
            <Link to='/'><button className="bg-yellow-500 text-white px-4 py-2 mr-2"
            >
                Home
            </button></Link>
            <div className="border p-4 mb-4">
                {isEditMode ? (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={task.title}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Description</label>
                            <textarea
                                name="description"
                                value={task.description}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={task.dueDate}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Priority</label>
                            <select
                                name="priority"
                                value={task.priority}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Completed</label>
                            <input
                                type="checkbox"
                                name="completed"
                                checked={task.completed}
                                onChange={(e) =>
                                    setTask((prevTask) => ({
                                        ...prevTask,
                                        completed: e.target.checked,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 w-full"
                            />
                        </div>
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2"
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <>
                        <h4 className="font-bold">Task #{task.id}: {task.title}</h4>
                        <p><strong>Description:</strong> {task.description}</p>
                        <p><strong>Due Date:</strong> {task.dueDate}</p>
                        <p><strong>Priority:</strong> {task.priority}</p>
                        <p><strong>Completed:</strong> {task.completed ? 'Yes' : 'No'}</p>
                        {task.images.length > 0 && (
                            <div className="mt-2">
                                <p>Images:</p>
                                {task.images.map((image, i) => (
                                    <img
                                        key={i}
                                        src={image}
                                        alt={`Task ${task.id} Image ${i}`}
                                        className="w-16 h-16 object-cover inline-block mr-2"
                                    />
                                ))}
                            </div>
                        )}
                        <div className="mt-4">
                            <button
                                onClick={() => setIsEditMode(true)} // Enable edit mode
                                className="bg-yellow-500 text-white px-4 py-2 mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => setIsDeleteModalVisible(true)} // Show confirmation modal
                                className="bg-red-500 text-white px-4 py-2"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Delete confirmation modal */}
            {isDeleteModalVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this task?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={handleConfirmDelete}
                                className="bg-red-500 text-white px-4 py-2"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="bg-gray-500 text-white px-4 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetails;
