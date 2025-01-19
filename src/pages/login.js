import React from 'react'
import LoginForm from '../components/loginpage/Loginform'
import background from '../assets/maxresdefault.jpg'
function login() {
  return (
    //loginPage
    <div class='relative'>
      <img src={background} class='w-full h-full'/>
      {/*Đăng nhập*/}
      <section class="absolute top-0">
          <h1 class="font-extrabold text-2xl text-white">Đăng nhập</h1>
      </section>
      <LoginForm/>
    </div>

  )
}
export default login;
