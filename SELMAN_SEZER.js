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
        const url = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

        fetch(url)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            return response.json();
        })
        .then(res => {
            localStorage.setItem(localstoragekey, JSON.stringify(res));
            products = res;
            buildHTML();
            buildCSS();
            setEvents();
        })
        .catch((err)=> console.log(err));
    };

    const buildHTML = () => {
        const carousel = document.createElement('div');
        carousel.className = 'product-carousel';

        const innerCarousel = document.createElement('div');
        innerCarousel.className = 'inner-product-carousel';

        const title = document.createElement('h2');
        title.className = 'carousel-title';
        title.textContent = 'You Might Also Like';
        innerCarousel.appendChild(title);

        const container = document.createElement('div');
        container.className = 'carousel-container';

        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'carousel-items';

        products.forEach(product => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            const link = document.createElement('a');
            link.href = product.url || '#';
            link.target = '_blank';

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;

            const name = document.createElement('h3');
            name.className = 'productName';
            name.textContent = product.name;

            const price = document.createElement('p');
            price.className = 'price';
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
        innerCarousel.appendChild(container);
        carousel.appendChild(innerCarousel);
        document.querySelector('.product-detail').insertAdjacentElement('afterend', carousel);
    };

    const buildCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            .product-carousel {
                // margin: 24px 0;
                padding: 0 20px;
                background-color : #f4f5f7;
                display : flex;
                justify-content : center;
            }
            
            .inner-product-carousel
            {
                width : 80%;
            }

            .productName
            {
                font-size : 14px;
            }
            
            .price
            {
                color : #193db0;
                font-size : 18px;
                font-weight : bold; 
            }

            .carousel-title {
                font-size: 24px;
                // margin-bottom: 20px;
                color : #29323b;
                font-weight : lighter;
            }

            .carousel-container {
                position: relative;
            }

            .carousel-items {
                display: flex;
                gap: 20px;
                overflow-x: hidden;
                scroll-behavior: smooth;
                padding: 10px 0;
            }
            .carousel-item {
                flex: 0 0 calc(33% - 10px);
                position: relative;
                min-width: calc(33% - 10px);
            }

            .carousel-item img {
                width: 100%;
                object-fit: cover;
                border-radius: 8px;
            }

            .heart-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: white;
                border: solid .5px #b6b7b9;
                font-size: 24px;
                cursor: pointer;
            }
            
            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                border: 1px solid #ddd;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                cursor: pointer;
                z-index: 2;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .carousel-left { left: -20px; }
            .carousel-right { right: -20px; }

            @media ((min-width: 992px)) {
                .carousel-item { flex: 0 0 calc(33.33% - 15px); }
            }

            @media (min-width: 992px) {
                .carousel-title {
                    font-size: 32px;
                    line-height: 43px;
            }
        `;
        document.head.appendChild(style);
    };


    
    const setEvents = () => {
        document.querySelectorAll('.heart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.dataset.id;
                const isLiked = this.textContent === '♥';
                this.textContent = isLiked ? '♡' : '♥';
                this.style.color = isLiked ? '#666' : '#007bff';
                localStorage.setItem(`liked_${productId}`, isLiked ? '' : 'true');
            });
        });

        let scrollPos = 0;
        const itemsWrapper = document.querySelector('.carousel-items');
        const itemWidth = document.querySelector('.carousel-item').offsetWidth + 20;

        document.querySelector('.carousel-left').addEventListener('click', () => {
            scrollPos = Math.max(scrollPos - itemWidth, 0);
            itemsWrapper.scrollTo({ left: scrollPos, behavior: 'smooth' });
        });

        document.querySelector('.carousel-right').addEventListener('click', () => {
            const maxScroll = itemsWrapper.scrollWidth - itemsWrapper.clientWidth;
            scrollPos = Math.min(scrollPos + itemWidth, maxScroll);
            itemsWrapper.scrollTo({ left: scrollPos, behavior: 'smooth' });
        });
    };

    init();
})();