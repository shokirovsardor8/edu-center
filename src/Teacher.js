import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';


const Teacher = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('teacher');
    const [teachers, setTeachers] = useState([]);
    const [editTeacherModalIsOpen, setEditTeacherModalIsOpen] = useState(false);
    const [deleteTeacherModalIsOpen, setDeleteTeacherModalIsOpen] = useState(false);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const handleEditClose = () => setEditTeacherModalIsOpen(false);
    const handleEditShow = () => setEditTeacherModalIsOpen(true);
    const handleDeleteClose = () => setDeleteTeacherModalIsOpen(false);
    const handleDeleteShow = () => setDeleteTeacherModalIsOpen(true);
    const handleAddClose = () => setShowAddTeacherModal(false);
    const handleAddShow = () => setShowAddTeacherModal(true);

    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');

    const baseURL = 'http://localhost:4000'

    useEffect(() => {
        // Fetch Teachers data from the backend when the component mounts
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { name, phone };
        const url = type === 'teacher' ? baseURL + '/api/teachers' : baseURL + '/api/teachers';

        try {
            const response = await axios.post(url, data);
            console.log(response.data);
            // Clear input fields after successful submission
            setName('');
            setPhone('');
            fetchTeachers();
            handleAddClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = async (id) => {
        setSelectedTeacherId(id);
        const teacher = teachers.find(teacher => teacher._id === id);
        setEditedName(teacher.name);
        setEditedPhone(teacher.phone);
        setEditTeacherModalIsOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:4000/api/teachers/${selectedTeacherId}`, { name: editedName, phone: editedPhone });
            setEditTeacherModalIsOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error('Error editing teacher:', error);
        }
    };

    const handleDelete = async (id) => {
        // try {
        //   await handleDeleteConfirm(id);
        // } catch (error) {
        //   console.error('Error deleting teacher:', error);
        // }
        setSelectedTeacherId(id);
        setDeleteTeacherModalIsOpen(true);
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/teachers/${selectedTeacherId}`);
            setDeleteTeacherModalIsOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    };
    return (
        <div className='container'>
            <h2 className=''>Teachers List</h2>
            <button className='btn btn-primary w-100 mb-2' onClick={() => handleAddShow()}>+ Add New Teacher</button>

            {/* Modal for adding new teacher */}
            <div className='w-50'>
            <Modal className='' style={{width: '400px'}}
                isOpen={showAddTeacherModal}
                onRequestClose={() => handleAddClose()}
            >
                <h2>Add New Teacher</h2>
                <form onSubmit={handleSubmit} className='w-50'>
                    <div>
                        <label className='form-label'>Name:</label>
                        <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input className='form-control' type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <button className='btn btn-success' type="submit">Submit</button>
                    <button className='btn btn-light' onClick={() => handleAddClose()}>Close</button>
                </form>
            </Modal>
            </div>
            {/* <Modal show={showAddTeacherModal}
                onHide={() => setShowAddTeacherModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}

            <table className='table table-bordered'>
                <thead className='thead-dark'>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Changing</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map(teacher => (
                        <tr key={teacher._id}>
                            <td>{teacher.name}</td>
                            <td>{teacher.phone}</td>
                            <td className=''>
                                <button className='btn btn-warning btn-sm m-0' onClick={() => handleEdit(teacher._id)}>Edit</button>
                                <button className='btn btn-danger btn-sm m-0 ms-1' onClick={() => handleDelete(teacher._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Teacher Modal */}
            <Modal
                isOpen={editTeacherModalIsOpen}
                onRequestClose={() => setEditTeacherModalIsOpen(false)}
            >
                <h2>Edit Teacher</h2>
                <form className = 'form' onSubmit={handleEditSubmit}>
                    <div>
                        <label>Name:</label>
                        <input className='form-control' type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    </div>
                    <div className='mb-2'>
                        <label>Phone:</label>
                        <input className='form-control' type="text" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} />
                    </div>
                <button className='btn btn-success' type="submit">Save</button>
                <button className='btn btn-light' onClick={() =>setEditTeacherModalIsOpen(false)}>Close</button>    
                </form>
                
            </Modal>

            {/* Delete Teacher Modal */}
            <Modal
                isOpen={deleteTeacherModalIsOpen}
                onRequestClose={() => setDeleteTeacherModalIsOpen(false)}
            >
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this teacher?</p>
                <button className='btn btn-danger' onClick={handleDeleteConfirm}>Delete</button>
                <button className='btn btn-light' onClick={() => setDeleteTeacherModalIsOpen(false)}>Cancel</button>
            </Modal>
        </div>
    )

}

export default Teacher