import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';


const Student = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [groupId, setGroupId] = useState('')
    const [groupIds, setGroupIds] = useState([]);
    const [groups, setGroups] = useState([]);
    const [type, setType] = useState('student');
    const [students, setStudents] = useState([]);
    const [editStudentModalIsOpen, setEditStudentModalIsOpen] = useState(false);
    const [deleteStudentModalIsOpen, setDeleteStudentModalIsOpen] = useState(false);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const handleEditClose = () => setEditStudentModalIsOpen(false);
    const handleEditShow = () => setEditStudentModalIsOpen(true);
    const handleDeleteClose = () => setDeleteStudentModalIsOpen(false);
    const handleDeleteShow = () => setDeleteStudentModalIsOpen(true);
    const handleAddClose = () => setShowAddStudentModal(false);
    const handleAddShow = () => setShowAddStudentModal(true);

    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [editedName, setEditedName] = useState('');
    const [editedPhone, setEditedPhone] = useState('');

    const baseURL = 'http://localhost:4000'

    useEffect(() => {
        // Fetch students data from the backend when the component mounts
        fetchStudents();
        fetchGroups();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/students');
            console.log(response.data);
            setStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
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

        const groupIds = [groupId] //groupId
        const data = { name, phone, groupIds };
        const url = baseURL + '/api/students';

        try {
            const response = await axios.post(url, data);
            console.log(response.data);
            // Clear input fields after successful submission
            setName('');
            setPhone('');
            fetchStudents();
            handleAddClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = async (id) => {
        setSelectedStudentId(id);
        const student = students.find(student => student._id === id);
        setEditedName(student.name);
        setEditedPhone(student.phone);
        setEditStudentModalIsOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            await axios.put(`http://localhost:4000/api/students/${selectedStudentId}`, { name: editedName, phone: editedPhone });
            setEditStudentModalIsOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error editing student:', error);
        }
    };

    const handleDelete = async (id) => {
        // try {
        //   await handleDeleteConfirm(id);
        // } catch (error) {
        //   console.error('Error deleting student:', error);
        // }
        setSelectedStudentId(id);
        setDeleteStudentModalIsOpen(true);
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/students/${selectedStudentId}`);
            setDeleteStudentModalIsOpen(false);
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };
    return (
        <div className='container'>
            <h2 className=''>Students List</h2>
            <button className='btn btn-primary w-100 mb-2' onClick={() => handleAddShow()}>+ Add New Student</button>

            {/* Modal for adding new student */}
            <div className='w-50'>
                <Modal className=''
                    isOpen={showAddStudentModal}
                    onRequestClose={() => handleAddClose()}
                >
                    <h2>Add New Student</h2>
                    <form onSubmit={handleSubmit} className='w-50'>
                        <div>
                            <label className='form-label'>Name:</label>
                            <input className='form-control' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label>Phone:</label>
                            <input className='form-control' type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label>Group:</label>
                            <select className='form-control mt-1' value={groupId} onChange={(e) => setGroupId(e.target.value)} required>
                                <option value="">Select group</option>
                                {groups.map(teacher => (
                                    <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className='btn btn-success' type="submit">Submit</button>
                        <button className='btn btn-light' onClick={() => handleAddClose()}>Close</button>
                    </form>
                </Modal>
            </div>
            {/* <Modal show={showAddStudentModal}
                onHide={() => setShowAddStudentModal(false)}>
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
                        <th>Groups</th>
                        <th>Changing</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.phone}</td>
                            <td>{student.groupIds[0].name}</td>
                            <td className=''>
                                <button className='btn btn-warning btn-sm m-0' onClick={() => handleEdit(student._id)}>Edit</button>
                                <button className='btn btn-danger btn-sm m-0 ms-1' onClick={() => handleDelete(student._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Student Modal */}
            <Modal
                isOpen={editStudentModalIsOpen}
                onRequestClose={() => setEditStudentModalIsOpen(false)}
            >
                <h2>Edit Student</h2>
                <form className='form' onSubmit={handleEditSubmit}>
                    <div>
                        <label>Name:</label>
                        <input className='form-control' type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    </div>
                    <div className='mb-2'>
                        <label>Phone:</label>
                        <input className='form-control' type="text" value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} />
                    </div>
                    <button className='btn btn-success' type="submit">Save</button>
                    <button className='btn btn-light' onClick={() => setEditStudentModalIsOpen(false)}>Close</button>
                </form>

            </Modal>

            {/* Delete Student Modal */}
            <Modal
                isOpen={deleteStudentModalIsOpen}
                onRequestClose={() => setDeleteStudentModalIsOpen(false)}
            >
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this student?</p>
                <button className='btn btn-danger' onClick={handleDeleteConfirm}>Delete</button>
                <button className='btn btn-light' onClick={() => setDeleteStudentModalIsOpen(false)}>Cancel</button>
            </Modal>
        </div>
    )

}

export default Student