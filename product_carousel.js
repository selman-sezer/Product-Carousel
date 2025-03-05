(() => {
    const localstoragekey = 'localstoragekey';
    let products = null;

    const init = () => {

        // if page is not a product page the function return without doing anything. So it works only with product pages.
        if (!document.querySelector(".product-detail")) {
            return;
        }

        // first we check if data is stored locally or not
        products = JSON.parse(localStorage.getItem(localstoragekey));
        // it stored locally, so no need to fetch the data
        if (products) {
            buildHTML();
            buildCSS();
            setEvents();
        }
        else
        {
            fetchProducts();
        }
        
    };

    function fetchProducts(){
        fetch("https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json")
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json();
        })
        .then(res => {
            products = res;
            localStorage.setItem(localstoragekey, JSON.stringify(res));
            buildHTML();
            buildCSS();
            setEvents();
        })
        .catch((err)=> console.log(err));
    };

    const buildHTML = () => {
        const carousel = document.createElement('div');
        carousel.className = 'product-carousel';

        const title = document.createElement('h2');
        title.className = 'carousel-title';
        title.textContent = 'You Might Also Like';
        carousel.appendChild(title);

        const container = document.createElement('div');
        container.className = 'carousel-container';

        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'carousel-items';

        self.products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            const link = document.createElement('a');
            link.href = product.url || '#';
            link.target = '_blank';

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;

            const name = document.createElement('h3');
            name.textContent = product.name;

            const price = document.createElement('p');
            price.textContent = `${product.price} TL`;

            const heart = document.createElement('button');
            heart.className = 'heart-btn';
            heart.dataset.id = product.id;
            heart.textContent = localStorage.getItem(`liked_${product.id}`) ? '♥' : '♡';
            heart.style.color = localStorage.getItem(`liked_${product.id}`) ? '#007bff' : '#666';

            link.append(img, name, price);
            item.append(link, heart);
            itemsWrapper.appendChild(item);
        });

        const leftBtn = document.createElement('button');
        leftBtn.className = 'carousel-arrow carousel-left';
        leftBtn.textContent = "<";

        const rightBtn = document.createElement('button');
        rightBtn.className = 'carousel-arrow carousel-right';
        rightBtn.textContent= '>';

        container.append(leftBtn, itemsWrapper, rightBtn);
        carousel.appendChild(container);
        document.querySelector('.product-detail').insertAdjacentElement('afterend', carousel);
    };

    const buildCSS = () => {
        const css = `
            .container {
                background-color: red;
                height: 100px;
                width: 100px;
            }
        `;

        $('<style>').addClass('carousel-style').html(css).appendTo('head');
    };

    const setEvents = () => {
        $('').on('click', () => {
            console.log('clicked');
        });
    };

    init();
})();


