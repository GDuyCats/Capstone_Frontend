import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import useAuth from "../Hooks/useAuth";
import Otherlogin from './Otherlogin';
import checked from '../../assets/checked.png';
import unchecked from '../../assets/unchecked.png';

const Loginform = () => {
  const { setAuth } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://marvelous-gentleness-production.up.railway.app/api/Authentication/login',
        {
          username,
          password,
        }
      );

      const token = response.data?.token;
      const user = response.data?.user || { username };

      if (token) {
        setAuth({ token, user }); // ✅ Lưu vào context
        setSuccessMsg(response.data?.message || 'Đăng nhập thành công!');
        setErrorMsg('');

        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setErrorMsg('Không nhận được token từ máy chủ!');
        setSuccessMsg('');
      }
    } catch (err) {
      setSuccessMsg('');
      setErrorMsg(err.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="flex flex-col justify-center items-center min-h-sceen overflow-hidden">
        <div className="relative flex flex-col w-full max-w-2xl md:bg-white mt-52 mb-52">
          <Link to={"/login"}>
            <span className="absolute inline-block hover:scale-105 transition-transform duration-300 cursor-pointer left-[65px] -top-[215px] md:left-0 md:-top-20 text-3xl font-extrabold text-center mb-4 text-white">
              Đăng Nhập
            </span>
          </Link>

          <div className="flex flex-col md:flex-row space-x-[50px] mr-4 -mt-44 md:mt-0">
            {/* Left Side */}
            <div className="flex flex-col space-y-2 pt-2 pl-2">
              {/* Username */}
              <div className="flex flex-col space-y-1 relative hover:scale-105 transition-transform duration-300">
                <div className="bg-transparent md:bg-white pl-6 md:pl-8 pt-8 rounded-lg">
                  <div className="relative bg-inherit">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      type="text"
                      id="username"
                      name="username"
                      className="peer bg-transparent h-10 w-60 md:w-72 rounded-lg text-slate-400 md:text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                      placeholder=""
                    />
                    <label
                      htmlFor="username"
                      className="absolute cursor-text left-0 -top-6 md:-top-3 text-sm text-blue_steam bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-200 md:peer-placeholder-shown:text-blue_steam peer-placeholder-shown:top-2 peer-focus:-top-8 md:peer-focus:-top-3 peer-focus:text-blue_steam peer-focus:text-sm transition-all font-medium"
                    >
                      Đăng nhập bằng tên khoản
                    </label>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1 relative hover:scale-105 transition-transform duration-300">
                <div className="bg-transparent md:bg-white pl-6 md:pl-8 pt-8 rounded-lg">
                  <div className="relative bg-inherit">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      id="password"
                      name="password"
                      className="peer bg-transparent h-10 w-60 md:w-72 rounded-lg text-slate-400 md:text-black placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
                      placeholder=""
                    />
                    <label
                      htmlFor="password"
                      className="absolute cursor-text left-0 -top-6 md:-top-3 text-sm text-blue_steam bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-8 md:peer-focus:-top-3 peer-placeholder-shown:text-slate-200 md:peer-placeholder-shown:text-blue_steam peer-focus:text-blue_steam peer-focus:text-sm transition-all font-medium"
                    >
                      Mật khẩu
                    </label>
                  </div>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex flex-grow space-x-2 pl-7 pt-2 hover:scale-105 transition-transform duration-300">
                <input type="checkbox" className="accent-blue_steam" />
                <label className="text-blue_steam md:text-slate-700 font-bold">
                  Ghi nhớ tôi
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="flex cursor-pointer hover:scale-105 transition-transform duration-300 rounded-sm justify-center items-center w-auto h-auto py-2 ml-[45px] mr-9 md:ml-14 md:mr-8 bg-gradient-to-r from-blue_steam to-blue_steam_login"
              >
                <label className="text-white text-xl font-bold">Đăng nhập</label>
              </button>

              {/* Success message */}
              {successMsg && (
                <div className="flex flex-row space-x-2 pt-2">
                  <span className="text-xs ml-[10%] text-green-500 font-extrabold">
                    {successMsg}
                  </span>
                  <img className="w-[15px] h-[15px]" src={checked} alt="success" />
                </div>
              )}

              {/* Error message */}
              {errorMsg && (
                <div className="flex flex-row space-x-2 pt-2">
                  <span className="text-xs ml-[10%] text-red-500 font-extrabold">
                    {errorMsg}
                  </span>
                  <img className="w-[15px] h-[15px]" src={unchecked} alt="error" />
                </div>
              )}

              <div className="pl-2 md:pl-8 mx-auto py-4">
                <span className="text-xs inline-block cursor-pointer hover:underline hover:scale-105 transition-transform duration-300 text-blue_steam md:text-black">
                  Quên mật khẩu
                </span>
              </div>
            </div>

            {/* Divider line */}
            <div className="relative mx-4 my-1 w-1 h-auto bg-gradient-to-b from-transparent via-blue_steam to-transparent shadow-lg"></div>

            {/* Right Side */}
            <div className="flex flex-col pt-0 pb-5 md:pt-7 md:pr-8 pr-10">
              <label className="text-blue_steam font-semibold">
                Đăng nhập bằng nền tảng khác
              </label>
              <Otherlogin />
            </div>
          </div>

          {/* Mobile footer */}
          <div className="absolute md:hidden flex flex-col w-full top-[250px] overflow-visible">
            <div className="flex flex-col items-center pl-auto pr-3">
              <h1 className="text-slate-200 font-extrabold text-2xl ml-4">
                Mới dùng GameMkt ?
              </h1>
              <div className="bg-gradient-to-r hover:scale-105 transition-transform duration-300 from-blue_steam to-blue_steam_login rounded-sm py-2 mt-5 px-5 ml-3 cursor-pointer">
                <Link to="/register">
                  <p className="text-slate-200 text-2xl font-bold">Tạo tài khoản</p>
                </Link>
              </div>
            </div>

            <div className="flex mt-5">
              <h1 className="text-slate-200 text-center">
                GameMkt phát triển một cộng đồng dành cho trò chơi điện tử, cung cấp một các công cụ và cơ hội phát triển.
                Xem thêm về&nbsp;
                <Link to="/aboutus">
                  <span className="font-extrabold underline hover:underline hover:scale-105 transition-transform duration-300 inline-block">
                    Chúng tôi
                  </span>
                </Link>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Loginform;
