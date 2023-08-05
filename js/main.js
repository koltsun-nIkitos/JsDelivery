"use strict";

const cartButton = document.getElementById("cart-button");
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

const toogleModal = ()=>{
    modal.classList.toggle("is-open");
}

cartButton.addEventListener("click", toogleModal);
close.addEventListener("click", toogleModal);

// Авторизация
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.getElementById("logInForm");
const loginInput = document.getElementById('login');
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
let login = localStorage.getItem('jsDelivery');



const toogleModalAuth = () => {
    modalAuth.classList.toggle("is-open")
}

const autorized = () => {
    const logOut = () =>{
        login = null;
        localStorage.removeItem('jsDelivery');
        

        buttonAuth.style.display = ''
        userName.style.display = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
    };

    console.log("Авторизован!");
    buttonAuth.style.display = 'none'
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);
}


const notAutorized = () =>{
    console.log("Не авторизован!");

    const logIn = (event) =>{
        event.preventDefault();
        login = loginInput.value;
        localStorage.setItem(
            'jsDelivery', login
        );
        toogleModalAuth();
        closeAuth.removeEventListener('click', toogleModalAuth);
        buttonAuth.removeEventListener('click', toogleModalAuth);
        loginForm.removeEventListener('submit', logIn);
        loginForm.reset();
        checkAuth();
    }
    
    buttonAuth.addEventListener('click', toogleModalAuth);
    closeAuth.addEventListener('click', toogleModalAuth);
    loginForm.addEventListener('submit', logIn);
}

const checkAuth = () => {
    if(login){
        autorized();
    }else{
        notAutorized();
    }
}

checkAuth();