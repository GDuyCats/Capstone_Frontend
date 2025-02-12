import React from 'react'
import { Link } from 'react-router-dom'
function Footer() {
    return (
   
        <div className='bg-steam w-screen z-50 flex flex-row justify-center items-center space-x-10 h-[200px] text-white'>
            <div className='mx-auto pt-2'>
                <div className='flex justify-center items-center space-x-28'>
                    <div className='flex flex-col items-center gap-4'>
                        <p className='font-extrabold text-xl text-white'>Mới dùng ứng dụng ?</p>
                        <div class="transition-transform duration-300 hover:scale-105 rounded-sm mx-auto mb-4 text-center w-[200px] lg:w-[170px] h-[40px] bg-gradient-to-r from-blue-600 to-blue-900 hover:cursor-pointer hover:brightness-110">
                            <Link class="text-xl font-extrabold text-white pt-1" to="/register">Đăng Ký</Link>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <a href="#" className='hover:text-white'>Privacy Policy</a>
                        <a href="#" className='hover:text-white'>Legal</a>
                        <a href="#" className='hover:text-white'>Subscriber Agreement</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
