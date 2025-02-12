import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import Otherlogin from './Otherlogin';
function Loginform() {
  const onFinish = (values) => {
    console.log('Thông tin đăng nhập:', values);
    message.success('Đăng ký thành công !');
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Lỗi:', errorInfo);
    message.error('Vui lòng kiểm tra lại thông tin');
  }
  return (
    <div class="flex justify-center items-center min-h-sceen">
      <div class="relative flex flex-col w-full max-w-2xl shadow-2xl bg-transparent md:bg-white mt-52 mb-52">
        <h1 className="absolute left-16 -top-44 md:left-0 md:-top-20 text-3xl font-extrabold text-center mb-4 text-white">Đăng Nhập</h1>
        <div class="flex flex-col md:flex-row space-x-[50px] -mt-24 md:mt-0">
          {/* 1 */}
          <div class="flex flex-col space-y-2 pt-2 pl-2">
            <div class="flex flex-col space-y-1 relative hover:scale-105 transition-transform duration-300">
              <div class="bg-transparent md:bg-white pl-6 md:pl-8 pt-8 rounded-lg">
                <div class="relative bg-inherit">
                  <input type="text" id="username" name="username" class="peer bg-transparent h-10 w-60 md:w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="" /><label for="username" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-200 md:peer-placeholder-shown:text-blue_steam peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-3 peer-focus:text-blue_steam peer-focus:text-sm transition-all font-medium">Đăng nhập bằng tên khoản</label>
                </div>
              </div>
            </div>
            <div class="flex flex-col space-y-1 relative hover:scale-105 transition-transform duration-300">
              <div class="bg-transparent md:bg-white pl-6 md:pl-8 pt-8 rounded-lg">
                <div class="relative bg-inherit">
                  <input type="password" id="password" name="password" class="peer bg-transparent h-10 w-60 md:w-72 rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="" /><label for="password" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-6 md:peer-focus:-top-3 peer-placeholder-shown:text-slate-200 md:peer-placeholder-shown:text-blue_steam peer-focus:text-blue_steam peer-focus:text-sm transition-all font-medium">Mật khẩu</label>
                </div>
              </div>
            </div>
            <div class="flex flex-grow space-x-2 pl-7 pt-2 hover:scale-105 transition-transform duration-300">
              <input type="checkbox" class="accent-blue_steam" />
              <label class="text-blue_steam md:text-black font-bold">Ghi nhớ tôi</label>
            </div>
            <div class="flex cursor-pointer hover:scale-105 transition-transform duration-300 rounded-sm justify-center items-center w-auto h-auto py-2 ml-11 mr-12 md:ml-14 md:mr-8 bg-gradient-to-r from-blue_steam to-blue_steam_login">
              <label class="text-white font-semibold text-xl ">Đăng nhập</label>
            </div>
            <div class="pl-0 md:pl-8 mx-auto py-4">
              <label class="text-xs cursor-pointer hover:underline hover:scale-105 transition-transform duration-300 text-blue_steam md:text-black">Quên mật khẩu</label>
            </div>
          </div>
          {/* 1 */}
          <div className="relative mx-4 my-1 w-1 h-auto bg-gradient-to-b from-transparent via-blue_steam to-transparent shadow-lg"></div>
          {/* 2 */}
          <div class="flex flex-col pt-0 pb-5 md:pt-7 pr-10">
            <label class="text-blue_steam font-semibold">Đăng nhập bằng nền tảng khác</label>
            <Otherlogin/>
          </div>
          {/* 3 */}
        </div>
      </div>
    </div>

  )
}

export default Loginform
