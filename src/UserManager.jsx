import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    user_id: uuidv4(),
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const usersCollection = collection(db, "users");

  const fetchUsers = async () => {
    try {
      const data = await getDocs(usersCollection);
      setUsers(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        const userDoc = doc(db, "users", editId);
        await updateDoc(userDoc, {
          ...formData,
          updated_at: serverTimestamp(),
        });
      } else {
        await addDoc(usersCollection, {
          ...formData,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp(),
        });
      }
      setPopupOpen(false);
      setFormData({
        email: "",
        phone: "",
        username: "",
        user_id: uuidv4(),
        status: "active",
      });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const userDoc = doc(db, "users", deleteId);
      await deleteDoc(userDoc);
      setDeletePopupOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const userDoc = doc(db, "users", id);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateDoc(userDoc, {
        status: newStatus,
        updated_at: serverTimestamp(),
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      phone: user.phone,
      username: user.username,
      user_id: user.user_id,
      status: user.status,
    });
    setEditId(user.id);
    setPopupOpen(true);
  };

  const handleOpenAddUser = () => {
    setFormData({
      email: "",
      phone: "",
      username: "",
      user_id: uuidv4(),
      status: "active",
    });
    setEditId(null);
    setPopupOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          User Manage
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-3 rounded-lg shadow-lg text-xl font-semibold hover:scale-105 transform transition-all hover:bg-gradient-to-l hover:from-teal-500 hover:to-green-400"
            onClick={handleOpenAddUser}
          >
            เพิ่มผู้ใช้
          </button>
        </div>

        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4">อีเมล</th>
              <th className="px-6 py-4">เบอร์โทร</th>
              <th className="px-6 py-4">ชื่อผู้ใช้</th>
              <th className="px-6 py-4">อัปเดตล่าสุด</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center border-t">
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">
                  {user.updated_at?.toDate().toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`${
                      user.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105`}
                    onClick={() => handleToggleStatus(user.id, user.status)}
                  >
                    {user.status === "active" ? "ใช้งานอยู่" : "ไม่ใช้งาน"}
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md"
                    onClick={() => handleEdit(user)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md"
                    onClick={() => {
                      setDeleteId(user.id);
                      setDeletePopupOpen(true);
                    }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Popup */}
      {popupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 w-96 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              {editId ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้"}
            </h2>
            <input
              type="text"
              placeholder="อีเมล"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="block w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="เบอร์โทร"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="block w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="block w-full p-3 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
                onClick={handleSave}
              >
                บันทึก
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg"
                onClick={() => setPopupOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deletePopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-12 w-96 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">ลบผู้ใช้</h2>
            <p>คุณต้องการลบผู้ใช้นี้หรือไม่?</p>
            <div className="flex space-x-4 mt-6">
              <button
                className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
                onClick={handleDelete}
              >
                ลบ
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-lg"
                onClick={() => setDeletePopupOpen(false)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
