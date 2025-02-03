import React from 'react'

function Footer() {
    return (
        <div className='bg-steam h-auto w-full absolute top-[700px] lg:top-[850px] text-white/50 text-sm overflow-y-hidden py-8'>
            <div className='container mx-auto px-4'>
                <div className='flex justify-center items-center space-x-28'>
                    <div className='flex flex-col items-center gap-4'>
                        <p className='font-extrabold text-xl text-white'>Mới dùng ứng dụng ?</p>
                        <div class="transition-transform duration-300 hover:scale-105 rounded-sm mx-auto mb-4 text-center w-[200px] lg:w-[170px] h-[40px] bg-gradient-to-r from-blue-600 to-blue-900 hover:cursor-pointer hover:brightness-110">
                            <h2 class=" text-xl font-extrabold text-white pt-1">Đăng Ký</h2>
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
