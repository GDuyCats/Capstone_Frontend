import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

function Footer() {
  return (
    <div className="flex items-center justify-center bg-steam brightness-110 h-[200px] w-full">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-200 text-center">
          Bạn đã có tài khoản ?
        </h1>
        <button className="bg-gradient-to-r from-blue_steam to-blue_steam_login w-[200px] h-[50px] rounded-md cursor-pointer hover:scale-105 transition-transform duration-300">
          <Link to="/login">
            <span className="text-slate-200 font-bold text-2xl">Đăng nhập</span>
          </Link>
        </button>
      </div>
      {/* <div>
        <a href="https://www.facebook.com/anemoneno1" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-blue-600 text-[10px]" />
        </a>
      </div> */}
    </div>
  );
}

export default Footer;
