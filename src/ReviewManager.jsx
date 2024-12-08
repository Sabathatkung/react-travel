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

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    place_name: "",
    score: 1,
    comment: "",
    user_id: uuidv4(),
    status: "active",
  });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const reviewsCollection = collection(db, "reviews");

  const fetchReviews = async () => {
    const data = await getDocs(reviewsCollection);
    setReviews(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleSave = async () => {
    if (editId) {
      const reviewDoc = doc(db, "reviews", editId);
      await updateDoc(reviewDoc, {
        ...formData,
        updated_at: serverTimestamp(),
      });
    } else {
      await addDoc(reviewsCollection, {
        ...formData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
    setPopupOpen(false);
    setFormData({
      place_name: "",
      score: 1,
      comment: "",
      user_id: uuidv4(),
      status: "active",
    });
    setEditId(null);
    fetchReviews();
  };

  const handleDelete = async () => {
    const reviewDoc = doc(db, "reviews", deleteId);
    await deleteDoc(reviewDoc);
    setDeletePopupOpen(false);
    fetchReviews();
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const reviewDoc = doc(db, "reviews", id);
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await updateDoc(reviewDoc, {
      status: newStatus,
      updated_at: serverTimestamp(),
    });

    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleEdit = (review) => {
    setFormData({
      place_name: review.place_name,
      score: review.score,
      comment: review.comment,
      user_id: review.user_id,
      status: review.status,
    });
    setEditId(review.id);
    setPopupOpen(true);
  };

  const handleOpenAddReview = () => {
    setFormData({
      place_name: "",
      score: 1,
      comment: "",
      user_id: uuidv4(),
      status: "active",
    });
    setEditId(null);
    setPopupOpen(true);
  };

  const handleScoreIncrease = () => {
    if (formData.score < 5) {
      setFormData({ ...formData, score: formData.score + 1 });
    }
  };

  const handleScoreDecrease = () => {
    if (formData.score > 1) {
      setFormData({ ...formData, score: formData.score - 1 });
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
        {/* หัวข้อหลัก */}
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
            Travel Review Management
        </h1>

        
        {/* ปุ่มเพิ่มรีวิว */}
        <div className="flex justify-center mb-6">
          <button
            className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-8 py-3 rounded-lg shadow-lg text-xl font-semibold hover:scale-105 transform transition-all hover:bg-gradient-to-l hover:from-teal-500 hover:to-green-400"
            onClick={handleOpenAddReview}
          >
            เพิ่มรีวิว
          </button>
        </div>

        <table className="table-auto w-full bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <tr>
              <th className="px-6 py-4">สถานที่</th>
              <th className="px-6 py-4">คะแนน</th>
              <th className="px-6 py-4">ความคิดเห็น</th>
              <th className="px-6 py-4">แก้ไขล่าสุด</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4">การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="text-center border-t">
                <td className="px-6 py-4">{review.place_name}</td>
                <td className="px-6 py-4">{review.score}</td>
                <td className="px-6 py-4">{review.comment}</td>
                <td className="px-6 py-4">
                  {review.updated_at?.toDate().toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    className={`${
                      review.status === "active"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 transform hover:scale-105`}
                    onClick={() => handleToggleStatus(review.id, review.status)}
                  >
                    {review.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-md"
                    onClick={() => handleEdit(review)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md"
                    onClick={() => {
                      setDeleteId(review.id);
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

        {/* Add/Edit Review Popup */}
        {popupOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {editId ? "แก้ไขรีวิว" : "เพิ่มรีวิว"}
              </h2>
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="ชื่อสถานที่"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.place_name}
                  onChange={(e) =>
                    setFormData({ ...formData, place_name: e.target.value })
                  }
                />
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">คะแนน:</span>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all"
                      onClick={handleScoreDecrease}
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold">{formData.score}</span>
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all"
                      onClick={handleScoreIncrease}
                    >
                      +
                    </button>
                  </div>
                </div>
                <textarea
                  placeholder="ความคิดเห็น"
                  className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows="4"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
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
                คุณแน่ใจหรือไม่ที่จะลบรีวิวนี้?
              </h2>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-red-500 text-white px-8 py-3 rounded-full shadow-md"
                  onClick={handleDelete}
                >
                  ลบ
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

export default ReviewManager;
