(() => {
    const localstoragekey = 'localstoragekey';
    let products = null;

    const init = () => {

        // if page is not a product page the function return without doing anything. So it works only with product pages.
        if (!document.querySelector(".product-detail")) {
            return;
        }
        
        buildHTML();
        buildCSS();
        setEvents();
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
        const html = `
            <div class="container">
                <h1></h1>
            </div>
        `;

        $('.product-detail').append(html);
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


