import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TimePicker from 'react-bootstrap-time-picker';

const Group = () => {
    // const [name, setName] = useState('');
    // const [phone, setPhone] = useState('');
    // const [students, setStudents] = useState([]);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    // const [deleteStudentModalIsOpen, setDeleteStudentModalIsOpen] = useState(false);
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [groupId, setGroupId] = useState('');
    const handleEditShow = (id) => { setShowEditGroupModal(true); setGroupId(id) }
    const handleEditClose = () => setShowEditGroupModal(false);
    // const handleDeleteClose = () => setDeleteStudentModalIsOpen(false);
    // const handleDeleteShow = () => setDeleteStudentModalIsOpen(true);
    const handleAddClose = () => setShowAddGroupModal(false);
    const handleAddShow = () => setShowAddGroupModal(true);
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [branch, setBranch] = useState('');
    const [level, setLevel] = useState('');
    const [limit, setLimit] = useState(0);
    const [price, setPrice] = useState(0);
    const [teacherId, setTeacherId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [groups, setGroups] = useState([]);

    const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
    const [selectedStartTime, setSelectedStartTime] = useState(0);
    const [selectedEndTime, setSelectedEndTime] = useState(0);
    const [groupData, setGroupData] = useState({
        name: '',
        room: ''
    });

    // const [selectedStudentId, setSelectedStudentId] = useState('');
    // const [editedName, setEditedName] = useState('');
    // const [editedPhone, setEditedPhone] = useState('');

    const baseURL = 'http://localhost:4000'

    useEffect(() => {
        // fetchGroups();
        fetchTeachers();
        fetchGroups();
    }, []);

    const handleStartTimeChange = (time) => {
        setSelectedStartTime(time);
    };
    const handleEndTimeChange = (time) => {
        setSelectedEndTime(time);
    };


    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };
    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/groups');
            setGroups(response.data);
        } catch (error) {
            console.error('Error fetching groups:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name, room, teacherId };

        try {
            await axios.post('http://localhost:4000/api/groups', data);
            // alert('Group created successfully');
            // Reset form fields after successful submission
            setName('');
            setRoom('');
            setTeacherId('');
            fetchGroups();
            handleAddClose();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setGroupData({ ...groupData, [name]: value });
    };
    const handleEdit = async (id) => {
        setGroupData(groups.find(group => group._id === id))
        handleEditShow()
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault();
console.log('edited');
        // try {
        //     await axios.put(`http://localhost:4000/api/groups/${groupId}`, groupData);
        //     console.log('Group updated successfully');
            handleEditClose();
        //     // Optionally, you can redirect the user or display a success message
        // } catch (error) {
        //     console.error('Error updating group:', error);
        //     // Handle error (e.g., display error message to user)
        // }
    };



    return (
        <div className='container'>
            <h2 className=''>Group List</h2>
            <button className='btn btn-primary w-100 mb-2' onClick={() => handleAddShow()}>+ Add New Group</button>

            <Modal className=''
                isOpen={showAddGroupModal}
                onRequestClose={() => handleAddClose()}
            >
                <h2>Add New Group</h2>
                <form onSubmit={handleSubmit} className='w-50'>
                    <div className='row'>
                        <div className='col'>
                            <label className='mb-1'>Name:</label>
                            <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label className='mb-1'>Room:</label>
                            <input className='form-control' type="text" value={room} onChange={(e) => setRoom(e.target.value)} />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <label>Level:</label>
                            <input className='form-control' type="text" value={level} onChange={(e) => setLevel(e.target.value)} />
                        </div><div className='col'>
                            <label>Limit:</label>
                            <input className='form-control' type="number" value={limit} onChange={(e) => setLimit(e.target.value)} />
                        </div>
                    </div>

                    <div className='row mt-2'>
                        <div className='col'>
                            <label className='mb-1'>Price:</label>
                            <input className='form-control' type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label>Teacher:</label>
                            <select className='form-control mt-1' value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                                <option value="">Select teacher</option>
                                {teachers.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <label className='mb-1'>Branch:</label>
                        <input className='form-control' type="text" value={branch} onChange={(e) => setBranch(e.target.value)} />
                    </div>

                    <div className='row mb-4 mt-3'>
                        <div className='col'>
                            <p className='mb-1'>Start time:</p>
                            <TimePicker
                                start="06:00"
                                end="24:00"
                                step={30}
                                value={selectedStartTime}
                                onChange={handleStartTimeChange}
                            />
                            <small>Selected Time: {selectedStartTime}</small>
                        </div>
                        <div className='col'>
                            <p className='mb-1'>End time:</p>
                            <TimePicker
                                start="06:00"
                                end="24:00"
                                step={30}
                                value={selectedEndTime}
                                onChange={handleEndTimeChange}
                            />
                            <small>Selected Time: {selectedEndTime}</small>
                        </div>
                        <div>
                            <p className='mb-1 mt-3'>Weekdays: </p>
                            {
                                days.map((day, index) =>
                                    <>
                                        <input type="checkbox" class="btn-check" id={day} autocomplete="off" />
                                        <label class="btn btn-sm btn-outline-success ms-1" for={day}>{day}</label>
                                    </>
                                )}


                        </div>
                    </div>

                    <button className='btn btn-success' type="submit">Submit</button>
                    <button className='btn btn-light ms-2' onClick={() => handleAddClose()}>Close</button>
                </form>
            </Modal>
            <Modal className=''
                isOpen={showEditGroupModal}
                onRequestClose={() => handleEditClose()}
            >
                <form className = 'form' onSubmit={handleEditSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                        className='form-control mb-3'
                            type="text"
                            id="name"
                            name="name"
                            value={groupData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="room">Room:</label>
                        <input
                        className='form-control mb-3'
                            type="text"
                            id="room"
                            name="room"
                            value={groupData.room}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button className='btn btn-success' type="submit" onClick={(event) => handleEditSubmit(event)}>Update</button>
                    <button className='btn btn-light ms-1' type="submit" onClick={() => handleEditClose()}>Cancel</button>
                </form>
            </Modal>

            <div>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Room</th>
                            <th>Teacher</th>
                            <th>Changing</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.room}</td>
                                <td>{group.teacher[0].name}</td> {/* Display teacher's name */}
                                <td>
                                    <button className='btn btn-sm btn-warning' onClick={() => handleEdit(group._id)}>Edit</button>
                                    <button className='btn btn-sm btn-danger ms-1' onClick={() => handleEdit(group._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default Group