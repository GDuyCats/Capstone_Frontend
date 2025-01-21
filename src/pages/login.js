import React from "react";
import LoginForm from "../components/Loginpage/Loginform";
import background from "../assets/maxresdefault.jpg";
function Login() {
  return (
    <section class="flex justify-center min-h-screen bg-steam">
      <div class='flex flex-col bg-steam overflow-x-hidden h-screen overflow-y-auto'>
        <div class='relative'>
          <img src={background} class='w-auto h-auto object-scale-down object-top' />
          <div class="absolute inset-0 bg-gradient-to-r from-steam via-transparent to-steam">
            <div class="h-full bg-gradient-to-b from-steam via-transparent to-steam brightness-95" />
          </div>
          <div class='absolute top-[70%] lg:top-[50%] left-0 w-full flex justify-center pt-[20px]'>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  )
}
export default Login;
