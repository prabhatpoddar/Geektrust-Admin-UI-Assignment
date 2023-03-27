import React, { useEffect, useState } from 'react'
import "./Home.css"
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { TbPlayerTrackPrev, TbPlayerTrackNext } from 'react-icons/tb';
import { GrPrevious, GrNext } from 'react-icons/gr';
import axios from 'axios';

const Home = () => {
    const [user, setUser] = useState([])
    const [accuser, setActUser] = useState([])
    const [page, setPage] = useState(0)
    const [editData, setEditData] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json?_page=1&&_limit=10").then((res) => {
            setUser(res.data.slice(page, page + 10))
            setActUser(res.data)
        })
    }, [page])
    const handelDelete = (i) => {
        const newUsers = [...user];
        newUsers.splice(i, 1);
        setUser(newUsers);

    }

    const handelUpdate = (i) => {
        setEditData(user[i]);
    }
    const handleSelectAll = () => {
        const newUsers = user.map((u) => ({ ...u, checked: !selectAll }));
        setUser(newUsers);
        setSelectAll(!selectAll);
    }
    const handleDeleteAll = () => {
        const newUsers = user.filter((u) => !u.checked);
        console.log('newUsers:', newUsers)
        setUser(newUsers);
    };
    const handleSelect = (i) => {
        const newUsers = [...user];
        newUsers[i].checked = !newUsers[i].checked;
        setUser(newUsers);
    };
    const handelChange=(searchText)=>{
        const filteredUsers = accuser.filter((user) => {
            const { name, email, role } = user;
            return (
              name.toLowerCase().includes(searchText.toLowerCase()) ||
              email.toLowerCase().includes(searchText.toLowerCase()) ||
              role.toLowerCase().includes(searchText.toLowerCase())
            );
          });
          setUser(filteredUsers.slice(page, page + 10));

    }

    const pageCount = Math.ceil(accuser.length / 10);

    const pages = [...Array(pageCount).keys()];
    return (
        <div className='MainContainer'>
            <h1>Geektrust Admin Ui</h1>
            <input type="text" className='Search' placeholder='Search by name,email or role' onChange={(e)=>handelChange(e.target.value)} />
            <table className='table'>
                <tr className='tableRow'>
                    <th> <input type="checkbox" className='allCheckBox' checked={selectAll} onChange={handleSelectAll} /></th>
                    <th>Name </th>
                    <th>Email </th>
                    <th>Role </th>
                    <th>Action </th>
                </tr>
                {
                    user.length && user.map((el, i) => {
                        return (
                            <tr key={el.id}>
                                <td><input type="checkbox" className='oneCheckBox' checked={el.checked} onChange={() => handleSelect(i)} /></td>

                                <td>
                                    {editData.id === el.id ? (
                                        <>
                                            <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                            <input type="text" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
                                            <input type="text" value={editData.role} onChange={(e) => setEditData({ ...editData, role: e.target.value })} />
                                            <button onClick={() => {
                                                const newUsers = [...user];
                                                newUsers[i] = editData;
                                                setUser(newUsers);
                                                setEditData({});
                                            }}>Save</button>
                                        </>
                                    ) : (
                                        <>
                                            {el.name}
                                        </>
                                    )}
                                </td>
                                <td>{el.email}</td>
                                <td>{el.role}</td>
                                <td><div className='actionDiv'>
                                    <button onClick={() => handelUpdate(i)}><FaEdit /></button>
                                    <button onClick={() => handelDelete(i)}><MdOutlineDelete /></button>
                                </div></td>
                            </tr>
                        )
                    })
                }
            </table>

            <div className="footer">
                <button onClick={handleDeleteAll} className="deleteAllBtn">Delete Selected</button>

                <div className="pagination">

                    <button onClick={() => setPage(0)} className="paginationBtn"><TbPlayerTrackPrev /></button>
                    <button onClick={() => setPage(prev => prev === 0 ? prev - 0 : prev - 10)} className="paginationBtn"  id='paginationBtn' ><GrPrevious /></button>
                    {
                        pages.map((el, i) => {
                            return (
                                <button key={i} className="paginationBtn" id='paginationBtn' onClick={() => setPage(el === 0 ? el + 0 : el * 10)}>{el + 1}</button>
                            )
                        })
                    }
                    <button onClick={() => setPage(prev => prev === (pageCount-1)*10 ? prev + 0 : prev + 10)} className="paginationBtn"  id='paginationBtn' ><GrNext /></button>
                    <button onClick={() => setPage((pageCount - 1) * 10)} className="paginationBtn"><TbPlayerTrackNext /></button>
                </div>
            </div>
        </div>
    )
}

export default Home