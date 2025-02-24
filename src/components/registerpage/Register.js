import React, { useState } from 'react';
import Footer from '../Layout/registerlayout/footer/Footer';
import ReCAPTCHA from 'react-google-recaptcha';

function Register() {
  const [captchaValue, setCaptchaValue] = useState(null);
  const sitekey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || "your_default_site_key_here";

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    console.log("CAPTCHA Value:", value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-steam items-center ">
      {/* Nội dung chính */}
      <div className="h-[600px] max-w-7xl flex flex-col items-start mr-0 lg:mr-[500px] pl-3 lg:pl-0">
        <div className='my-10'>
          <h1 className='text-5xl text-slate-200'>Tạo tài khoản của bạn</h1>
        </div>
        <div className='my-10 space-y-5'>
          <div class="flex flex-col relative hover:scale-105 
            transition-transform duration-300">
            <div class="bg-transparent md:bg-steam mb-5">
              <div class="relative bg-inherit">
                <input type="text" id="email" name="email" class="peer bg-transparent
                   h-10 w-[250px] lg:w-[300px] rounded-lg text-slate-400  placeholder-transparent ring-2 
                   px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none
                    focus:border-rose-600" placeholder="" />
                <label for="email" class="absolute cursor-text left-0 -top-6 md:-top-3 text-sm 
                    text-blue_steam bg-inherit mx-1 px-1 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-slate-200 
                    md:peer-placeholder-shown:text-blue_steam 
                    peer-placeholder-shown:top-2 peer-focus:-top-8 md:peer-focus:-top-3
                  peer-focus:text-blue_steam peer-focus:text-sm transition-all 
                  font-medium">Địa chỉ email
                </label>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-1 relative hover:scale-105 
            transition-transform duration-300">
            <div class="bg-transparent md:bg-steam">
              <div class="relative bg-inherit">
                <input type="text" id="auth_email" name="auth_email" class="peer bg-transparent
                   h-10 w-[250px] lg:w-[300px] rounded-lg text-slate-400 placeholder-transparent ring-2 
                   px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none
                    focus:border-rose-600" placeholder="" />
                <label for="auth_email" class="absolute cursor-text left-0 -top-6 md:-top-3 text-sm 
                    text-blue_steam bg-inherit mx-1 px-1 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-slate-200 
                    md:peer-placeholder-shown:text-blue_steam 
                    peer-placeholder-shown:top-2 peer-focus:-top-8 md:peer-focus:-top-3
                  peer-focus:text-blue_steam peer-focus:text-sm transition-all 
                  font-medium">Xác nhận địa chỉ email
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* reCAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={sitekey}
            onChange={handleCaptchaChange}
          />
        </div>

        {/* Nút Tiếp tục */}
        <button
          className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded w-[200px] ${!captchaValue ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={!captchaValue}
        >
          Tiếp tục
        </button>

      </div>
      <Footer />
    </div>
  );
}

export default Register;
