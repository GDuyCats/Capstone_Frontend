import React from 'react'
import { useState } from 'react'
import Otherlogin from './Otherlogin'
import ReCAPTCHA from 'react-google-recaptcha'

function Loginform() {
    const [captchaisDone, setCapchaisDone] = useState(false)
    function onChange() {
        setCapchaisDone(true)
      }
    return (
        <div class='bg-white absolute inset-0 flex w-[700px] h-[400px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2'>
            <div>
                {/*Username*/}
                <div class="bg-white p-4 rounded-lg mt-5 ml-10">
                    <div class="relative bg-inherit">
                        <input type="text" id="username" name="username" class="peer bg-transparent w-[300px] h-[40px] rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="Type inside me" /><label for="username" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Đăng nhập bằng tên tài khoản</label>
                    </div>
                </div>
                {/*Password*/}
                <div class="bg-white p-4 rounded-lg mt-2 ml-10">
                    <div class="relative bg-inherit">
                        <input type="password" id="password" name="password" class="peer bg-transparent w-[300px] h-[40px] rounded-lg text-gray-200 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" placeholder="Type inside me" /><label for="password" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Mật khẩu</label>
                    </div>
                </div>
                {/*Flex cho div của remember me và forget password*/}
                <div class='flex ml-14 mt-5 space-x-20'>
                    {/*Checkbox Remember me*/}
                    <section>
                        <label class='inline-flex items-center' for="grayCheckBox">
                            <input id="grayCheckBox" type="checkbox" class="w-4 h-4 accent-gray-700" />
                            <span class='ml-2 text-gray-500 hover:cursor-pointer hover:brightness-110'>Ghi nhớ tôi</span>
                        </label>
                    </section>
                    {/*Forget password*/}
                    <section >
                        <span class='text-gray-500  ml-2 hover:cursor-pointer hover:brightness-110 hover:underline'>Quên mật khẩu</span>
                    </section>
                </div>
                {/*Đăng nhập*/}
                <div class="rounded-lg text-center ml-14 mt-5 w-[300px] h-[40px] bg-gradient-to-r from-blue-600 to-blue-900 hover:cursor-pointer hover:brightness-110">
                    <h2 class="text-xl font-extrabold text-white pt-1">Đăng nhập</h2>
                </div>
                {/*Captcha*/}
                <div className="ml-14 mt-3">
                    <ReCAPTCHA
                        sitekey="6Lehj7wqAAAAAAm7OW3Y001Gl9SLxz3YAMOyvA79"
                        onChange={onChange}
                    />
                </div>
            </div>
            <div class="relative ml-2 mr-auto my-9 max-w-md rounded-lg bg-gradient-to-tr from-pink-600 to-blue-600 p-0.5 shadow-lg"></div>
            {/*Facebook*/}
            <div class='pr-6 mt-8'>
                <label class='text-blue-400 text-xs font-bold block mb-2'>HOẶC ĐĂNG NHẬP BẰNG NỀN TẢNG KHÁC</label>
                <Otherlogin />
            </div>

        </div>
    )
}

export default Loginform
