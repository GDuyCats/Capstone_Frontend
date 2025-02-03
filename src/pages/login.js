import React from "react";
import LoginForm from "../components/Loginpage/Loginform";
import background from "../assets/maxresdefault.jpg";
function Login() {
  return (
     <section class="flex justify-center bg-steam">
      <div class='flex flex-col bg-steam overflow-x-hidden xl:overflow-y-hidden h-screen'>
        <div class='relative'>
          <img src={background} class='w-auto h-auto object-none xl:object-scale-down object-top' />
          <div class="absolute inset-0 bg-gradient-to-r from-steam via-transparent to-steam">
            <div class="h-full bg-gradient-to-b from-steam via-transparent to-steam brightness-95" />
          </div>
          <div class='absolute top-[100px]  left-1/2 translate-x-1/2 lg:top-1/2 xl:top-[350px] pb-[550px] lg:pb-0'>
            <LoginForm />
          </div>
        </div>
      </div>
    </section> 
  )
}
export default Login;
