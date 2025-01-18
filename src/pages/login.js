import React from 'react'
import background from '../assets/dez1s4d-02f83af8-09a1-40ba-a4c6-54b6dd93965a.jpg'
function login() {
  return (
    //loginPage
    <div class='relative'>
      <img src={background} class='w-full h-full'/>
      {/*Đăng nhập*/}
      <section class="absolute top-0">
          <h1 class="font-extrabold text-2xl text-white">Đăng nhập</h1>
      </section>
      <div class='bg-slate-900 absolute inset-0 flex w-[700px] h-[400px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
        {/*Form đăng nhập*/}
        <div>
          {/*Username*/}
          <section>
            <label class='text-blue-400 text-xs font-bold block'>ĐĂNG NHẬP BẰNG TÊN TÀI KHOẢN</label>
            <input type='text' class='bg-gray-500 outline-none text-white hover:brightness-110' />
          </section>
          {/*Password*/}
          <section>
            <label class='text-gray-300 text-xs font-bold block'>MẬT KHẨU</label>
            <input type='text' class='bg-gray-500 outline-none text-white hover:brightness-110' />
          </section>
          {/*Flex cho div của remember me và forget password*/}
          <div class='flex'>
            {/*Checkbox Remember me*/}
            <section>
              <label class='inline-flex items-center' for="grayCheckBox">
                <input id="grayCheckBox" type="checkbox" class="w-4 h-4 accent-gray-700" />
                <span class='ml-2 text-gray-300 hover:cursor-pointer hover:brightness-110'>Ghi nhớ tôi</span>
              </label>
            </section>
            {/*Forget password*/}
            <section >
              <span class='text-gray-300 ml-2 hover:cursor-pointer hover:brightness-110'>Quên mật khẩu</span>
            </section>
          </div>
          {/*Đăng nhập*/}
          <div class="text-center bg-gradient-to-r from-blue-300 to-blue-500 hover:cursor-pointer hover:brightness-110">
            <h2 class="text-xl font-extrabold text-white">Đăng nhập</h2>
          </div>
        </div>
      </div>
    </div>

  )
}
export default login;
