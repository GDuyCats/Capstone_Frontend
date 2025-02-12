import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Ẩn scroll khi mở modal
    } else {
      document.body.classList.remove("overflow-hidden"); // Bật lại scroll khi đóng modal
    }
    return () => {
      document.body.classList.remove("overflow-hidden"); // Dọn dẹp khi component unmount
    };
  }, [isOpen]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Open Modal
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%", opacity: 0 }} // Bắt đầu từ ngoài màn hình bên trái
            animate={{ x: "0%", opacity: 1 }} // Trượt vào giữa
            exit={{ x: "-100%", opacity: 0 }} // Khi đóng, trượt từ phải ra trái
            transition={{ duration: 0.5, ease: "easeInOut" }} // Hiệu ứng mượt
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi nhấn vào modal
          >
            <h2 className="text-lg font-semibold mb-4">Modal Title</h2>
            <p className="text-gray-600">Click outside to close this modal.</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
