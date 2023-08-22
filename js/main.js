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

const cart = [];

// Ресторан
const restaurantTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const minPrice = document.querySelector(".price");
const category = document.querySelector(".category");

// Поиск
const inputSearch = document.querySelector(".input-search");


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
        cartButton.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();
        returnMain();
    };

    buttonAuth.style.display = 'none'
    userName.textContent = login;
    userName.style.display = 'inline';
    buttonOut.style.display = 'flex';
    cartButton.style.display = 'flex';

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
        <a  class="card card-restaurant" 
            data-products="${products}" 
            data-info="${[name, price, stars, kitchen]}">
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

        <img src="${image}" alt="${name}" class="card-image" />
        
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

// Открывает меню ресторана
const openGoods = (event) => {
    const target = event.target;

    if (login){

        const restaurant = target.closest('.card-restaurant');
        if (restaurant){

            const info =restaurant.dataset.info.split(',');
            const [name, price, stars, kitchen] = info;
            


            cardsMenu.textContent = '';
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `От ${price} ₽`;
            category.textContent = kitchen;

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
// TODO Доделать поиск
    inputSearch.addEventListener('keydown', (event) =>{
        if (event.keyCode === 13){
            const target = event.target;
            const value = target.value.toLowerCase().trim();

            if (!value){
                target.style.borderColor = 'tomato';
                setTimeout(function(){
                    target.style.borderColor = '';
                }, 2000);
                return;
            }

            target.value = '';
            
            const goods = [];

            getData('./db/partners.json')
                .then(function(data){
                    const products = data.map(function(item){
                        return item.products;
                    });

                    products.forEach(function(product) {
                        getData(`./db/${product}`)
                            .then(function(data){
                                goods.push(...data);
                                const searchGoods = goods.filter(function(item){
                                    return item.name.toLowerCase().includes(value);
                                });
                                
                                cardsMenu.textContent = '';
                                containerPromo.classList.add('hide');
                                restaurants.classList.add('hide');
                                menu.classList.remove('hide');

                                restaurantTitle.textContent = 'Результат поиска';
                                rating.textContent = '';
                                minPrice.textContent = '';
                                category.textContent = '';

                                return searchGoods;
                            })
                            .then(function(data){
                                data.forEach(createCardFood);
                            });
                    }); 

                });
        }
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