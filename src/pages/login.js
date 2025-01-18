import React from 'react'
import LoginForm from '../components/loginpage/loginform'
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
      <LoginForm/>
    </div>

  )
}
export default login;
