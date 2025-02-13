import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false); // Đóng menu nếu màn hình lớn hơn md
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="relative">
      <div className="bg-steam brightness-125 w-screen z-50 flex flex-row justify-center items-center space-x-10 h-[100px] relative">
        {/* Nút hamburger cho màn hình nhỏ */}
        <button
          className="md:hidden text-slate-200 absolute left-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={"M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Menu cho màn hình lớn */}
        <div className="hidden md:flex md:space-x-10 ">
          {["CỬA HÀNG", "CỘNG ĐỒNG", "THÔNG TIN", "HỖ TRỢ"].map((item) => (
            <h1
              key={item}
              className="text-slate-200 font-bold hover:brightness-150 cursor-pointer active:underline"
            >
              {item}
            </h1>
          ))}
        </div>
      </div>

      {/* Menu dropdown cho màn hình nhỏ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 w-screen h-screen flex items-center justify-start bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%", opacity: 0 }} // Bắt đầu từ ngoài màn hình bên trái
              animate={{ x: "0%", opacity: 1 }} // Chạy vào giữa
              exit={{ x: "-100%", opacity: 0 }} // Thoát ra bên trái
              transition={{ duration: 0.5, ease: "easeInOut" }} // Tạo hiệu ứng mượt
              className="bg-steam shadow-lg w-[250px] h-screen 
              max-h-screen flex flex-col items-start overflow-y-auto  
              scrollbar scrollbar-track-black scrollbar-thumb-slate-700"
              onClick={(e) => e.stopPropagation()} // Ngăn đóng khi nhấn vào modal
            >
              {["CỬA HÀNG", "CỘNG ĐỒNG", "THÔNG TIN",
                "HỖ TRỢ"].map((item) => (
                  <div
                    key={item}
                    className="border-t-[1px] border-t-header-2 border-b-[1px] border-b-black w-full 
                     text-slate-200 text-3xl font-semibold hover:brightness-150 cursor-pointer p-3"
                  >
                    {item}
                  </div>
                ))}
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
