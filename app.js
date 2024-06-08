let activeTabID = 'goods';
let goodsInCart = [];
let sumOfCart = 0;

const initialTAB = getActiveTAB();
initialTAB.classList.add('active');

renderTabContentByID(activeTabID);

const cartCounter = document.querySelector('[data-goods-count]')

const tabs = document.querySelectorAll('button.tab');
addClickListeners(tabs, clickHandler);



// Извлекаем ТАБУ у которой дата атрибут "active"
function getActiveTAB() {
    return document.querySelector(`button[data-tab-id='${activeTabID}']`)
};
// Рендерим контент 
function renderTabContentByID(tabId) {
    const tabsContainer = document.querySelector('.tabs');
    let html = null;

    if(tabId === 'goods') {
        html = renderGoods()
    }
    else {
        html = renderCart()
    };

    tabsContainer.after(html);
};


// -------------------------------
// Отрисовываем Товары
function renderGoods() {
    const div = document.createElement('div');
    div.dataset.activeTab = 'true';
    div.className = 'product-items';

    
    for (let i = 0; i < goods.length; i++) {
        const product = createProduct(goods[i]);
        
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.imgSrc}">
            <div class="product-list">
                <h3>${product.name}</h3>
                ${product.price === null 
                    ? '<p>Товар закочился</p>'
                    : `<p class="price">$ ${product.price}</p>`
                }
            </div>
        `;

        if (product.price !== null) {
            const button = document.createElement('button')
            button.className = 'button';
            button.textContent = 'В корзину';
            button.addEventListener('click', addInCartHandler(product));

            productItem.querySelector('.product-list').append(button)
        };
    
        div.append(productItem)
    };
    return div;
};
// Котролируем Данные 
function createProduct(product) {
    return {
        id: product.id,
        name: product.name ? product.name : 'Имя неизветсно',
        imgSrc: product.imgSrc ? product.imgSrc : 'img/js.png',
        price: product.price ? product.price : null,
    }
};

// Отрисовываем Корзину
function renderCart() {
    const container = document.createElement('div');
    container.dataset.activeTab = 'true';
    container.className = 'cart-items';

    for (let i = 0; i < goodsInCart.length; i++) {
        const product = goodsInCart[i];

        const cartItem = document.createElement('div');
        cartItem.dataset.elementId = product.id;
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
        <div class="cart-item-title">${product.name}</div>
        <div class="cart-item-count">${product.count} шт</div>
        <div data-cart-button class="cart-item-price">$ ${product.price}</div>
        `;

        const button = document.createElement('button');
        button.textContent = '---';
        button.className = 'cart-item-delete'; 
        button.addEventListener('click', removeInCartHandler(product.id));
        cartItem.append(button);

        container.append(cartItem);
        
    };
    const sumInfo = document.createElement('div');
    sumInfo.className = 'cart-sum';
    sumInfo.textContent = `Итого: $ ${sumOfCart}`;
    container.append(sumInfo);

    return container;
};
// -------------------------------


// Переключаеть ТАБЫ и удаляет
function clickHandler(event) {
    const activeTab = getActiveTAB();
    activeTab.classList.remove('active');
    event.target.classList.add('active');
    activeTabID = event.target.dataset.tabId;

    // Удаление ТАБА
    removeTabContent();
    function removeTabContent() {
        const activeContent = document.querySelector('[data-active-tab="true"]');
    
        activeContent.remove();
    }

    renderTabContentByID(activeTabID);
};
// добавляет Слушатель на ТАБЫ
function addClickListeners(event, func) {
    for (let i = 0; i < event.length; i++) {
        const data = event[i];
        
        data.addEventListener('click', func)
    };
};


// -------------------------------
//  Добавляем продукты в корзину 
function addInCartHandler(product) {
    return () => {
        let hasProduct = false;
        let index = null;
        let count = 1;

        for (let i = 0; i <  goodsInCart.length; i++) {
            const productInCart = goodsInCart[i];

            if (product.id === productInCart.id) {
                hasProduct = true;
                index = i;
                count = productInCart.count
            }
        };

        if (hasProduct) {
            goodsInCart[index].count = ++count;
        }
        else {
            const productWithCount = product;
            productWithCount.count = count; 

            goodsInCart.push(productWithCount)
        };

        // Сумируем цену
        sumOfCart += product.price;

        // ----------------

        // Обновляем счетчик
        let fullSize = 0;

        for (let i = 0; i < goodsInCart.length; i++) {
            productInCart = goodsInCart[i];
            fullSize += productInCart.count;
        }
        cartCounter.dataset.goodsCount = fullSize;
    };
};

//  Удаляем продукты из корзину 
function removeInCartHandler(productId) {
    return () => {
        const newGoodsInCart = [];

        for (let i = 0; i <  goodsInCart.length; i++) {
            const product = goodsInCart[i];

            if (productId === product.id) {
                if (product.count > 1) {
                    newGoodsInCart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imgSrc: product.imgSrc,
                        count: product.count - 1,});
                }
                updateCartItem(product.id, product.count, product.price);
            }
            else {
                newGoodsInCart.push(product);
            }
        };

        goodsInCart = newGoodsInCart;

        // -------------------------------

        let fullSize = 0;

        for (let i = 0; i < goodsInCart.length; i++) {
            productInCart = goodsInCart[i];
            fullSize += productInCart.count;
        }
        cartCounter.dataset.goodsCount = fullSize;
    };
};
function updateCartItem(id, count, price) {
    const cartItem = document.querySelector(`[data-element-id ='${id}']`)

    if (count > 1) {
        const countElement = cartItem.querySelector('.cart-item-count');
        countElement.textContent = `${count - 1} шт`;
    }
    else {
        cartItem.remove();
    };
    if (count > 0) {
        sumOfCart -= price;
        const sumInfo = document.querySelector('.cart-sum');
        sumInfo.textContent = `Итого: ${sumOfCart}`;
    }
};
// -------------------------------