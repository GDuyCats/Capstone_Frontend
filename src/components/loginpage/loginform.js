import React from 'react'
import Otherlogin from './Otherlogin'
function Loginform() {
    return (
        <div class='flex flex-col '>
            <div class='relative'>
                <h1 class="absolute text-white font-extrabold w-[300px] text-3xl -top-[100px] -left-[85px] lg:-left-[400px] lg:-top-[200px] z-50">Đăng nhập</h1>
                <div class='absolute justify-center h-screen w-auto bg-none top-[30px] -left-[140px] lg:w-[700px] lg:h-auto lg:bg-white lg:p-5 lg:-top-[120px] lg:-left-[400px] rounded-sm transition-transform duration-300 hover:scale-105'>
                    {/* <div class='h-full w-screen lg:h-auto bg-none lg:bg-white pt-20 lg:p-5 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rounded-sm transition-transform duration-300 hover:scale-105'> */}
                    <div class="flex flex-col lg:flex-row">
                        <div class='flex flex-col'>
                            {/*Username*/}
                            <div class="bg-none lg:bg-white p-4 ">
                                <div class="relative bg-inherit">
                                    <input type="text" id="username" name="username" class="transition-transform duration-300 hover:scale-105 peer bg-transparent w-[250px] lg:w-[300px] h-[40px] rounded-lg lg:text-black text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="" /><label for="username" class="text-sm absolute cursor-text left-0 -top-[22px] lg:-top-3 text-white lg:text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white lg:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-6 lg:peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Tên tài khoản</label>
                                </div>
                            </div>
                            {/*Password*/}
                            <div class="bg-inherit lg:bg-white p-4 -mt-1">
                                <div class="relative bg-inherit">
                                    <input type="password" id="password" name="password" class="transition-transform duration-300 hover:scale-105 peer bg-transparent w-[250px] lg:w-[300px] h-[40px] rounded-lg lg:text-black text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="" /><label for="password" class="text-sm absolute cursor-text left-0 -top-[22px] lg:-top-3 text-white lg:text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-white lg:peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-6 lg:peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Mật khẩu</label>
                                </div>
                            </div>

                            {/*Checkbox Remember me*/}
                            <div class='p-[14px]'>
                                <label class='inline-flex items-center' for="grayCheckBox">
                                    <input id="grayCheckBox" type="checkbox" class="transition-transform duration-300 hover:scale-105 w-4 h-4 accent-gray-700" />
                                    <span class='transition-transform duration-300 hover:scale-105 ml-2 text-white lg:text-gray-500 hover:cursor-pointer hover:brightness-110'>Ghi nhớ tôi</span>
                                </label>
                            </div>
                            {/*Đăng nhập*/}
                            <div class="transition-transform duration-300 hover:scale-105 rounded-sm mx-auto mb-4 text-center w-[240px] lg:w-[280px] h-[40px] bg-gradient-to-r from-blue-600 to-blue-900 hover:cursor-pointer hover:brightness-110">
                                <h2 class=" text-xl font-extrabold text-white pt-1">Đăng nhập</h2>
                            </div>
                            <div class='p-1 transition-transform duration-300 hover:scale-105'>
                                <span class='text-white lg:text-gray-500 ml-2 hover:cursor-pointer hover:brightness-110 hover:underline'>Bạn quên mật khẩu</span>
                            </div>
                        </div>
                        {/*Div cho cái đường viền*/}
                        <div class="relative mr-0 lg:mr-4 my-1 rounded-lg bg-gradient-to-tr from-pink-600 to-blue-600 p-0.5 shadow-lg"></div>

                        {/*Facebook*/}
                        <div>
                            <label class='transition-transform duration-300 hover:scale-105 text-blue-400 text-xs font-bold block text-center mb-2'>HOẶC ĐĂNG NHẬP BẰNG NỀN TẢNG KHÁC</label>
                            <Otherlogin />
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}


export default Loginform