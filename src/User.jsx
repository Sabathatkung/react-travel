import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    user_id: uuidv4(),
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Add or Update user
  const handleSave = () => {
    if (editId) {
      // Update user
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === editId ? { ...formData } : user
        )
      );
    } else {
      // Add new user
      setUsers((prevUsers) => [...prevUsers, { ...formData }]);
    }

    resetForm();
    setPopupOpen(false);
  };

  // Delete user
  const handleDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.user_id !== deleteId)
    );
    setDeletePopupOpen(false);
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      user_id: uuidv4(),
      status: "active",
    });
    setEditId(null);
  };

  // Toggle user status
  const handleToggleStatus = (id, currentStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.user_id === id
          ? { ...user, status: currentStatus === "active" ? "inactive" : "active" }
          : user
      )
    );
  };

  // Edit user (populate form)
  const handleEdit = (user) => {
    setFormData({ ...user });
    setEditId(user.user_id);
    setPopupOpen(true);
  };

  // Open Add User form
  const handleOpenAddUser = () => {
    resetForm();
    setPopupOpen(true);
  };

  return (
    <div className="bg-gradient-to-r bg-blue-100 p-6 min-h-screen">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">
          User Management
        </h1>

        {/* Add User Button */}
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
              <th className="px-6 py-4">ชื่อผู้ใช้</th>
              <th className="px-6 py-4">อีเมล</th>
              <th className="px-6 py-4">เบอร์โทรติดต่อ</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="text-center border-t">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <button
                    className={`${
                      user.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105`}
                    onClick={() => handleToggleStatus(user.user_id, user.status)}
                  >
                    {user.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
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
                      setDeleteId(user.user_id);
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

        {/* Add/Edit User Popup */}
        {popupOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {editId ? "แก้ไขบัญชีผู้ใช้" : "เพิ่มผู้ใช้"}
              </h2>
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="ชื่อผู้ใช้"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="อีเมล"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="เบอร์โทรติดต่อ"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-md"
                    onClick={handleSave}
                  >
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-8 py-3 rounded-full shadow-md"
                    onClick={() => setPopupOpen(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {deletePopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl font-bold mb-6 text-center">
                ต้องการจะลบผู้ใช้รายนี้?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-red-500 text-white px-8 py-3 rounded-full shadow-md"
                  onClick={handleDelete}
                >
                  ยืนยัน
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-8 py-3 rounded-full shadow-md"
                  onClick={() => setDeletePopupOpen(false)}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
