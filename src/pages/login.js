import React from "react";
import LoginForm from "../components/loginpage/loginform";
import background from "../assets/maxresdefault.jpg";
function login() {
  return (
    <div class="flex justify-center min-h-screen bg-black">
      <div class='flex flex-col bg-black overflow-x-hidden h-screen overflow-y-auto'>
        <div class='relative'>
          <img src={background} class='w-auto h-auto object-scale-down object-top' />
          <div class="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black">
            <div class="h-full bg-gradient-to-b from-black via-transparent to-black" />
          </div>
          <div class='absolute top-[70%] lg:top-[50%] left-0 w-full flex justify-center pt-[20px]'>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
export default login;
