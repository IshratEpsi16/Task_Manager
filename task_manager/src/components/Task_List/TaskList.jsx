import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        completed: false,
        images: [],
    });
    const [isFormVisible, setIsFormVisible] = useState(false); // Toggle for the Add Task form
    const [titleFilter, setTitleFilter] = useState('');
    const [dueDateFilter, setDueDateFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [searchTitle, setSearchTitle] = useState(''); // Search bar state
    const navigate = useNavigate();

    // Save tasks to localStorage whenever the tasks state changes
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Track the last ID
    useEffect(() => {
        const lastId = localStorage.getItem('lastTaskId');
        if (!lastId) {
            localStorage.setItem('lastTaskId', 0); // Initialize if not set
        }
    }, []);

    const handleDetailsClick = (taskId) => {
        navigate(`/taskdetails/${taskId}`); // Navigate to the task details page with the task ID
    };

    const handleEditClick = (taskId) => {
        navigate(`/taskedit/${taskId}`); // Navigate to the task edit page with the task ID
    };

    const handleDelete = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    };

    const handleAddTaskClick = () => {
        setIsFormVisible(true); // Show the form to add a new task
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewTask((prevTask) => ({
                    ...prevTask,
                    images: [...prevTask.images, reader.result], // Add image URL to images array
                }));
            };
            reader.readAsDataURL(file); // Convert image to a base64 URL
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get the last task ID from localStorage and increment it
        const lastId = parseInt(localStorage.getItem('lastTaskId')) || 0;
        const newId = lastId + 1;

        // Create a new task with the incremented ID
        const newTaskWithId = {
            ...newTask,
            id: newId,
        };

        // Save the new task and update the last task ID in localStorage
        setTasks([...tasks, newTaskWithId]);
        localStorage.setItem('lastTaskId', newId); // Update the last task ID
        setNewTask({
            title: '',
            description: '',
            dueDate: '',
            priority: '',
            completed: false,
            images: [],
        }); // Reset the form
        setIsFormVisible(false); // Hide the form after submission
    };

    // Filter tasks based on the title, due date, priority, and search term
    const filteredTasks = tasks.filter((task) => {
        const matchesTitle =
            task.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
            task.title.toLowerCase().includes(searchTitle.toLowerCase()); // Apply both filters
        const matchesDueDate = dueDateFilter ? task.dueDate === dueDateFilter : true;
        const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;

        return matchesTitle && matchesDueDate && matchesPriority;
    });

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Task Manager</h2>

            <button
                onClick={handleAddTaskClick}
                className="bg-green-500 text-white px-4 py-2 mb-4"
            >
                Add Task
            </button>

            <div className="mb-6">
                <label className="mr-2">Search by Title:</label>
                <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="border p-2"
                    placeholder="Search tasks by title"
                />
            </div>

            <div className="mb-6">
                <label className="mr-2">Filter by Title:</label>
                <input
                    type="text"
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.target.value)}
                    className="border p-2"
                />
            </div>
            <div className="mb-6">
                <label className="mr-2">Filter by Due Date:</label>
                <input
                    type="date"
                    value={dueDateFilter}
                    onChange={(e) => setDueDateFilter(e.target.value)}
                    className="border p-2"
                />
            </div>
            <div className="mb-6">
                <label className="mr-2">Filter by Priority:</label>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border p-2"
                >
                    <option value="">Select Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="mb-6 border p-4">
                    <h3 className="text-lg font-bold mb-4">Add New Task</h3>
                    <div className="mb-4">
                        <label className="block mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newTask.title}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Description</label>
                        <textarea
                            name="description"
                            value={newTask.description}
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={newTask.dueDate}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Priority</label>
                        <select
                            name="priority"
                            value={newTask.priority}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        >
                            <option value="">Select Priority</option>
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
                            checked={newTask.completed}
                            onChange={(e) =>
                                setNewTask((prevTask) => ({
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
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2"
                    >
                        Add Task
                    </button>
                </form>
            )}

            <div>
                <h3 className="text-lg font-bold mb-4">All Tasks</h3>
                {filteredTasks.map((task) => (
                    <div key={task.id} className="border p-4 mb-4">
                        <h4 className="font-bold">
                            Task #{task.id}: {task.title}
                        </h4>
                        <div className="mt-4">
                            <button
                                onClick={() => handleDetailsClick(task.id)}
                                className="bg-blue-500 text-white px-4 py-2 mr-2"
                            >
                                Details
                            </button>
                            <button
                                onClick={() => handleEditClick(task.id)}
                                className="bg-yellow-500 text-white px-4 py-2 mr-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(task.id)}
                                className="bg-red-500 text-white px-4 py-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
