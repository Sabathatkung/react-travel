// src/Dashboard.jsx
import { useState, useEffect } from "react";
import { db } from "./firebase"; // import จากไฟล์ firebase.js
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true); // การจัดการสถานะการโหลด
  const [error, setError] = useState(null); // การจัดการข้อผิดพลาด

  const categoriesCollectionRef = collection(db, "categories"); // ใช้ db จาก firebase.js

  // ดึงข้อมูลจาก Firestore เมื่อโหลดหน้า
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        if (categoriesData.length === 0) {
          // ถ้าไม่มีข้อมูลใน collection
          setCategories([]);
        } else {
          setCategories(categoriesData);
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error("Error fetching categories: ", err);
      } finally {
        setLoading(false); // ตั้งสถานะการโหลดเป็น false หลังจากดึงข้อมูลเสร็จ
      }
    };

    fetchCategories();
  }, []);

  // ฟังก์ชันสำหรับการเพิ่มข้อมูลประเภทสถานที่
  const handleAddCategory = async () => {
    if (newCategory.trim() && newDescription.trim()) {
      await addDoc(categoriesCollectionRef, {
        name: newCategory,
        description: newDescription,
      });

      setNewCategory("");
      setNewDescription("");
      setCategories([...categories, { name: newCategory, description: newDescription }]);
    }
  };

  // ฟังก์ชันสำหรับการอัพเดตข้อมูลประเภทสถานที่
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !selectedCategory.id) {
      console.error("Selected category is not valid");
      return;
    }
  
    const updatedCategoryRef = doc(db, "categories", selectedCategory.id);
  
    await updateDoc(updatedCategoryRef, {
      name: newCategory,
      description: newDescription,
    });
  
    const updatedCategories = categories.map((category) =>
      category.id === selectedCategory.id
        ? { ...category, name: newCategory, description: newDescription }
        : category
    );
    setCategories(updatedCategories);
    setSelectedCategory(null);
  };

  // ฟังก์ชันสำหรับการลบข้อมูลประเภทสถานที่
  const handleDeleteCategory = async (id) => {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);
    setCategories(categories.filter((category) => category.id !== id));
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          Place Category Management
        </h1>

        {/* Add Category Form */}
        <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            เพิ่มประเภทสถานที่
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border rounded-lg p-2"
              placeholder="ชื่อประเภทสถานที่"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <textarea
              className="border rounded-lg p-2"
              placeholder="คำอธิบาย"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
              onClick={handleAddCategory}
            >
              เพิ่ม
            </button>
          </div>
        </div>

        {/* Category List */}
        <ul className="space-y-4">
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีประเภทสถานที่ในระบบ</p>
          ) : (
            categories.map((category) => (
              <li
                key={category.id || category.name} // ใช้ category.id หรือ category.name ถ้า id ยังไม่ชัดเจน
                className="flex items-center justify-between border p-4 rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setSelectedCategory(category)}
                >
                  แก้ไข
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* View Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedCategory(null)}
            >
              ✖
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedCategory.name}
            </h2>
            <p className="text-gray-700 mb-4">{selectedCategory.description}</p>

            {/* Edit Form */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                แก้ไขข้อมูล
              </h3>
              <input
                type="text"
                className="border rounded-lg p-2 w-full mb-4"
                placeholder="ชื่อประเภทสถานที่"
                defaultValue={selectedCategory.name}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <textarea
                className="border rounded-lg p-2 w-full mb-4"
                placeholder="คำอธิบาย"
                defaultValue={selectedCategory.description}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>

            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition w-full mb-2"
              onClick={handleUpdateCategory}
            >
              บันทึกการแก้ไข
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition w-full"
              onClick={() => handleDeleteCategory(selectedCategory.id)}
            >
              ลบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
