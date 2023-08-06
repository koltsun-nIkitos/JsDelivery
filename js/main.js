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

const  getData = async (url) =>{

    const response = await fetch(url);

    if (!response.ok){
        throw new Error(`Ошибка по адресу ${url}, статус ошибка ${response.status}`)
    }

    return await response.json();
};



const valide = (str) =>{
    const nameReg = /^[a-zA-Z0-9\-.]+$/;
    return nameReg.test(str);
};


const toogleModal = ()=>{
    modal.classList.toggle("is-open");
};

const toogleModalAuth = () => {
    loginInput.style.borderColor = "";
    modalAuth.classList.toggle("is-open")
};

const returnMain = () =>{
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
};

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
const createCardRestaurant = (restaurant) =>{

    const { name, time_of_delivery, stars, price, kitchen, products, image } = restaurant;

    const card = `
        <a  class="card card-restaurant" data-products="${products}">
            <img src="${image}" alt="image" class="card-image" />
            <div class="card-text">
                <div class="card-heading">
                    <h3 class="card-title">${name}</h3>
                    <span class="card-tag tag">${time_of_delivery} мин</span>
                </div>

                <div class="card-info">
                    <div class="rating">
                        ${stars}
                    </div>
                    <div class="price">От ${price} ₽</div>
                    <div class="category">${kitchen}</div>
                </div>
            </div>
        </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);

};

const createCardFood = (goods) =>{

    const { name, description, price, image } = goods;

    const card = document.createElement('div');
    card.className = 'card';

    card.insertAdjacentHTML('beforeend',  `

        <img src="${image}" alt="image" class="card-image" />
        
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>

            <div class="card-info">
                <div class="ingredients">
                    ${description}
                </div>
            </div>

            <div class="card-buttons">
                <button class="button button-primary button-add-cart">
                    <span class="button-card-text">В корзину</span>
                    <span class="button-cart-svg"></span>
                </button>
                <strong class="card-price-bold">${price} ₽</strong>
            </div>
        </div>

    `);

    cardsMenu.insertAdjacentElement("beforeend", card)
    
};

const openGoods = (event) => {
    const target = event.target;

    if (login){
        const restaurant = target.closest('.card-restaurant');
        if (restaurant){

            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');

            getData(`./db/${restaurant.dataset.products}`).then((data)=>{
                data.forEach(createCardFood);
            });

            menu.classList.remove('hide');
            

        }
        
    }else{
        toogleModalAuth();
    }


};

const init = () =>{
    getData('./db/partners.json').then((data) =>{

        data.forEach(createCardRestaurant);
    
    });
    
    
    cartButton.addEventListener("click", toogleModal);
    
    close.addEventListener("click", toogleModal);
    
    cardsRestaurants.addEventListener('click', openGoods);
    
    logo.addEventListener("click", ()=>{
        containerPromo.classList.remove('hide');
        restaurants.classList.remove('hide');
        menu.classList.add('hide');
    });
    
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
        
    });
}


init();