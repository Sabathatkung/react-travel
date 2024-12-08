import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function PlaceManage() {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    address: "",
    contact: "",
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // State for Toast Notification
  const [deleteConfirm, setDeleteConfirm] = useState({ id: null, show: false }); // State for Delete Confirmation

  const placesCollection = collection(db, "places");

  // Fetch places from Firestore
  const fetchPlaces = async () => {
    const snapshot = await getDocs(placesCollection);
    setPlaces(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      const placeDoc = doc(db, "places", form.id);
      await updateDoc(placeDoc, { ...form });
      setToastMessage("แก้ไขข้อมูลสถานที่สำเร็จ!"); // Show success message for editing
      setIsEditing(false);
    } else {
      await addDoc(placesCollection, { ...form });
      setToastMessage("เพิ่มสถานที่สำเร็จ!"); // Show success message for adding
    }
    setForm({ id: null, name: "", category: "", address: "", contact: "", isActive: true });
    setShowModal(false);
    fetchPlaces();
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleEdit = (place) => {
    setForm(place);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteConfirm({ id: null, show: false }); // Close confirmation modal
    const placeDoc = doc(db, "places", id);
    await deleteDoc(placeDoc);
    fetchPlaces();
    setToastMessage("ลบสถานที่สำเร็จ!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ id, show: true }); // Open confirmation modal
  };

  const openAddModal = () => {
    setForm({ id: null, name: "", category: "", address: "", contact: "", isActive: true });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-5">
        Tourist Attraction Management System
      </h2>
        <button
          onClick={openAddModal}
          className="mb-5 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          เพิ่มสถานที่
        </button>

        <h3 className="text-lg font-semibold mb-4">รายชื่อสถานที่</h3>
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">ชื่อ</th>
              <th className="p-3 text-left">ประเภท</th>
              <th className="p-3 text-left">ที่อยู่</th>
              <th className="p-3 text-left">ติดต่อ</th>
              <th className="p-3 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {places.map((place, index) => (
              <tr
                key={place.id}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="p-3">{place.name}</td>
                <td className="p-3">{place.category}</td>
                <td className="p-3">{place.address}</td>
                <td className="p-3">{place.contact}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(place)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(place.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "แก้ไขสถานที่" : "เพิ่มสถานที่"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="ชื่อสถานที่"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="ประเภท"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="address"
                  placeholder="ที่อยู่"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="contact"
                  placeholder="เบอร์โทรติดต่อ"
                  value={form.contact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  {isEditing ? "บันทึกการแก้ไข" : "เพิ่มสถานที่"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">ยืนยันการลบ</h3>
            <p className="text-gray-600 mb-4">
              คุณแน่ใจหรือไม่ว่าต้องการลบสถานที่นี้?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm({ id: null, show: false })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default PlaceManage;
