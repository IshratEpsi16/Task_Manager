import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Task_List/TaskList.css'

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
        <div>
            <nav class="bg-cyan-100">
                <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div class="relative flex h-16 items-center justify-between">
                        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">

                            <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                                <span class="absolute -inset-0.5"></span>
                                <span class="sr-only">Open main menu</span>

                                <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <div class="flex shrink-0 items-center">
                                <img class="h-8 w-auto"
                                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                            </div>
                            <div class="hidden sm:ml-6 sm:block">

                                <p className='text-cyan-800 text-lg'><b>Task Manager</b></p>



                            </div>
                        </div>
                        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <button className="btn btn-primary" onClick={handleAddTaskClick}>Add task</button>



                        </div>
                    </div>

                    {/* <!-- Mobile menu, show/hide based on menu state. --> */}
                    <div class="sm:hidden" id="mobile-menu">
                        <div class="space-y-1 px-2 pb-3 pt-2">

                            <p className='text-cyan-800'>Task Manager</p>

                        </div>
                    </div>
                </div>
            </nav>

            <div className="p-4">




                <div className="mb-6">

                    <input
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="search border p-2"
                        placeholder="Search tasks by title"
                    />
                </div>

                <div className="filter mb-6 flex items-center space-x-4">
                    <div>
                        <input
                            type="text"
                            value={titleFilter}
                            onChange={(e) => setTitleFilter(e.target.value)}
                            className="ft border p-2"
                            placeholder="Filter by Title"
                        />
                    </div>
                    <div>
                        <label className="text-current mr-2">Due Date:</label>
                        <input
                            type="date"
                            value={dueDateFilter}
                            onChange={(e) => setDueDateFilter(e.target.value)}
                            className="border p-2"
                        />
                    </div>
                    <div>
                        <label className="text-current mr-2">Priority:</label>
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
                </div>


                {/* {isFormVisible && (
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
                )} */}
                {isFormVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg w-96">
                            <button
                                onClick={() => setIsFormVisible(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            >
                                ✖
                            </button>
                            <form onSubmit={handleSubmit}>
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
                                    <label className="block mb-2">Upload Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="border p-2 w-full"
                                    />
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
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div>
                    <h3 className=" textclass text-lg font-bold mb-4">All Task List</h3>
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="all border p-4 mb-4">
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

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskList;
