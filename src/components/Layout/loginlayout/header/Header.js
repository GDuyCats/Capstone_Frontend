import React, { useState } from 'react'

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='bg-steam brightness-125 w-full z-50 flex flex-row justify-center items-center space-x-10 h-[100px]'>
      {/* Nút hamburger cho màn hình nhỏ */}
      <button 
        className='md:hidden text-slate-200 absolute left-4'
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
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Menu cho màn hình lớn */}
      <div className='hidden md:flex md:space-x-10'>
        <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer active:underline'>CỬA HÀNG</h1>
        <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>CỘNG ĐỒNG</h1>
        <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>THÔNG TIN</h1>
        <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>HỖ TRỢ</h1>
      </div>

      {/* Menu dropdown cho màn hình nhỏ */}
      {isOpen && (
        <div className='absolute top-[100px] left-0 w-full bg-steam brightness-125 md:hidden'>
          <div className='flex flex-col items-center space-y-4 py-4'>
            <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>CỬA HÀNG</h1>
            <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>CỘNG ĐỒNG</h1>
            <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>THÔNG TIN</h1>
            <h1 className='text-slate-200 font-bold hover:brightness-150 cursor-pointer'>HỖ TRỢ</h1>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
