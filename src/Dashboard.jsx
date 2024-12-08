import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalCategory, setModalCategory] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoriesCollectionRef = collection(db, "categories");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(categoriesCollectionRef);
        const categoriesData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCategories(categoriesData);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error("Error fetching categories: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategory.trim() && newDescription.trim()) {
      try {
        const docRef = await addDoc(categoriesCollectionRef, {
          name: newCategory,
          description: newDescription,
        });
        setCategories([
          ...categories,
          { id: docRef.id, name: newCategory, description: newDescription },
        ]);
        setNewCategory("");
        setNewDescription("");
      } catch (err) {
        console.error("Error adding category: ", err);
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory || !selectedCategory.id) {
      console.error("Selected category is not valid");
      return;
    }

    const updatedCategoryRef = doc(db, "categories", selectedCategory.id);

    try {
      await updateDoc(updatedCategoryRef, {
        name: modalCategory,
        description: modalDescription,
      });

      const updatedCategories = categories.map((category) =>
        category.id === selectedCategory.id
          ? { ...category, name: modalCategory, description: modalDescription }
          : category
      );
      setCategories(updatedCategories);
      setSelectedCategory(null);
      setModalCategory("");
      setModalDescription("");
    } catch (err) {
      console.error("Error updating category: ", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const categoryRef = doc(db, "categories", id);
      await deleteDoc(categoryRef);
      setCategories(categories.filter((category) => category.id !== id));
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error deleting category: ", err);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setModalCategory(category.name);
    setModalDescription(category.description);
  };

  return (
    <div className="min-h-screen bg-blue-100 from-blue-50 to-blue-100 p-8">
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
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีประเภทสถานที่ในระบบ</p>
        ) : (
          <table className="w-full table-auto bg-white rounded-lg shadow-md">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ชื่อประเภทสถานที่</th>
                <th className="p-3 text-left">คำอธิบาย</th>
                <th className="p-3 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-100 cursor-pointer">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">{category.description}</td>
                  <td className="p-3 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCategory(category);
                      }}
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Category Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedCategory(null)}
            >
              ✖
            </button>
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                แก้ไขข้อมูล
              </h3>
              <input
                type="text"
                className="border rounded-lg p-2 w-full mb-4"
                placeholder="ชื่อประเภทสถานที่"
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
              />
              <textarea
                className="border rounded-lg p-2 w-full mb-4"
                placeholder="คำอธิบาย"
                value={modalDescription}
                onChange={(e) => setModalDescription(e.target.value)}
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
