import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import logo from '../../../../assets/470178924_1237016580742747_363138670710016911_n.jpg'
function Header() {
  const [isOpen, setIsOpen] = useState(false)
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
    <div className='flex bg-steam flex-grow justify-center items-center space-x-[100px] brightness-110 h-[160px] w-screen'>
      <div className='flex space-x-2 justify-center items-center lg:-ml-[135px]'>
        <img className='rounded-full w-[50px] h-auto' src={logo} alt='logo' />
        <h1 className='text-slate-200 font-extrabold text-4xl'>GAMEMKT</h1>
      </div>
      <div className='hidden lg:flex space-x-5'>
        <Link to="/"><label className='text-xl text-slate-200 font-bold inline-block cursor-pointer transition-transform duration-300 hover:scale-105'>CỬA HÀNG</label></Link>
        <Link to="/forum"><label className='text-xl text-slate-200 font-bold cursor-pointer inline-block transition-transform duration-300 hover:scale-105'>CỘNG ĐỒNG</label></Link>
        <Link to="/information"><label className='text-xl text-slate-200 font-bold cursor-pointer inline-block transition-transform duration-300 hover:scale-105'>THÔNG TIN</label></Link>
        <Link to="/support"><label className='text-xl text-slate-200 font-bold cursor-pointer transition-transform inline-block duration-300 hover:scale-105'>HỖ TRỢ</label></Link>
      </div>
    </div>
  )
}

export default Header
