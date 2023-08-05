"use strict";

const cartButton = document.getElementById("cart-button");
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

// Авторизация
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const loginForm = document.getElementById("logInForm");
const loginInput = document.getElementById('login');
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const logo = document.querySelector(".logo");

// Карточки
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const cardsMenu = document.querySelector(".cards-menu");

let login = localStorage.getItem('jsDelivery');

const valide = (str) =>{
    const nameReg = /^[a-zA-Z0-9\-.]+$/;
    return nameReg.test(str);
}


const toogleModal = ()=>{
    modal.classList.toggle("is-open");
}

const toogleModalAuth = () => {
    loginInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open")
};

const returnMain = () =>{
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
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
        returnMain();
    };

    console.log("Авторизован!");
    buttonAuth.style.display = 'none'
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);
};

const notAutorized = () =>{

    const logIn = (event) =>{
        event.preventDefault();

        if (valide(loginInput.value.trim())){
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
        }else{
            loginInput.style.outline = 'none';
            loginInput.style.borderColor = "tomato";
            loginInput.value = '';
        }

        
    }
    
    buttonAuth.addEventListener('click', toogleModalAuth);
    closeAuth.addEventListener('click', toogleModalAuth);
    loginForm.addEventListener('submit', logIn);
};

const checkAuth = () => {
    if(login){
        autorized();
    }else{
        notAutorized();
    }
};



// Карточки
const createCardRestaurant = () =>{

    const card = `
        <a  class="card card-restaurant">
            <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">Пицца плюс</h3>
                    <span class="card-tag tag">50 мин</span>
                </div>

                <div class="card-info">
                    <div class="rating">
                        4.5
                    </div>
                    <div class="price">От 900 ₽</div>
                    <div class="category">Пицца</div>
                </div>
            </div>
        </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

const createCardFood = () =>{
    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend',  `

        <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image" />
        
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">Пицца Везувий</h3>
            </div>

            <div class="card-info">
                <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
                    «Халапенье», соус «Тобаско», томаты.
                </div>
            </div>

            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold">545 ₽</strong>
            </div>
        </div>

    `);

    cardsMenu.insertAdjacentElement("beforeend", card)
    
}

const openGoods = (event) => {
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
    
    if (restaurant){
        if (login){

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
            cardsMenu.textContent = '';
            createCardFood();
            createCardFood();
            createCardFood();

        }else{
            toogleModalAuth();
        }
    }


}

cartButton.addEventListener("click", toogleModal);
close.addEventListener("click", toogleModal);


cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener("click", ()=>{
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
})


createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

checkAuth();

const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    autoplay: {
        delay: 4000
    },
    speed: 1500,
    paralax: true,

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    pagination: {
        el: '.swiper-pagination',
    },
}

);