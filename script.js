const parentContainer = document.getElementById("full-container");
const musicContainer = document.querySelector('.music');
const cartItems = document.getElementById('cart-items');
const pageContainer = document.getElementById('page-buttons');
const limit = 2;

// parentContainer.addEventListener('click', (e)=>{
//     if(e.target.className=='add-cart-btn'){
//         const id= e.target.parentNode.parentNode.id;
//         const itemName = document.querySelector(`#${id} h2`).innerText;
//         const img_link = document.querySelector(`#${id} img`).src;
//         const price= parseFloat(document.querySelector(`#${id} .item-amount`).innerText);
//         let item_quantity = 1;
//         let total_price = parseFloat(document.querySelector('.total-amount').innerText);
//         if(document.querySelector(`#in-cart-${id}`)){
//             console.log("item in cart");
//             alert('This item is already added to the cart');
//             return
//         } else {
//             cartItemsList.push(id);
//             cartItem = document.createElement('div');
//             cartItem.classList.add("cart-item-row");
//             cartItem.setAttribute('id',`in-cart-${id}`);
//             document.querySelector('.total-amount').innerText = (total_price+price).toFixed(2);
//             cartItem.innerHTML= `
//             <div class="image-icon">
//                 <img src="${img_link}">
//                 <span class="item-name"><h3>${itemName}</h3></span>
                
//             </div>    
//             <span>$</span><span class="item-price">
//             ${price}</span>
//             <span class="item-quantity">${item_quantity}</span>
//             <button id="remove" class="remove-btn">REMOVE</button>
//             `;
//             cartItems.appendChild(cartItem);
//             document.querySelector(".no-of-items").innerText = parseInt(document.querySelector(".no-of-items").innerText) + 1;
//             const container = document.querySelector('.notification-container');
//             const notification = document.createElement('div');
//             notification.innerHTML=`
//             <h4>Your product ${itemName} successfully added to Cart </h4>
//             `;
//             container.appendChild(notification);
//             container.style = 'display: block;'
//             setTimeout(()=>{
//                 notification.remove();
//                 container.style = 'display: none;'
//             },2500)
//         }
        
//     }
//     if(e.target.classList=="remove-btn"){
//         const id = e.target.parentNode.id;
        
//         const price = document.querySelector(`#${id} .item-price`).innerText;
//         let total_price = document.querySelector('.total-amount').innerText;
        
//         total_price = parseFloat(total_price) - parseFloat(price);
//         total_price = total_price.toFixed(2);
//         document.querySelector('.total-amount').innerText = `${total_price}`;
       
//         document.querySelector(".no-of-items").innerText = parseInt(document.querySelector(".no-of-items").innerText)-1;
//         e.target.parentNode.remove();
//     }

//     if(e.target.id=='cart'){
//         document.querySelector('.cart-container').style = "display:flex; transform: translateX(-100%);" 
//     }

//     if (e.target.className=='close'){
//         document.querySelector('.cart-container').style = "display:flex; transform: translateX(0);"
//     }

//     if(e.target.id=='purchase'){
//         if(parseInt(document.querySelector(".no-of-items").innerText) === 0){
//             alert("You have no items in your cart");
//             return
//         }
//         alert("Thanks for the purchase");
//         cartItems.innerHTML="";
//         document.querySelector(".no-of-items").innerText = 0;
//         document.querySelector(".total-amount").innerText = 0;
//         document.querySelector('.cart-container').style = "display:flex; transform: translateX(0);"

//     }

// })

window.addEventListener('DOMContentLoaded',()=>{
    getproducts(1);
    postcart(); 
    
    })
    
function getproducts(pgNum){
    musicContainer.innerHTML="";
    pageContainer.innerHTML="";
    axios.get(`http://localhost:3000?page=${pgNum}`).then((response)=>{
        // console.log(response.data.products);
        
        let products = response.data.products;
        let currentPage = response.data.currentPage;
        let hasNextPage = response.data.hasNextPage;
        let hasPreviousPage = response.data.hasPreviousPage;
        let nextPage = response.data.nextPage;
        let previousPage = response.data.previousPage;
        // console.log(currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage); 
        
        products.forEach(product => {
            const id = product.id;
            const title = product.title;
            const price = product.price;
            const img_link = product.imageUrl;
            // console.log(id, title, price, img_link)

            productItem = document.createElement('div');
            productItem.classList.add('card');
            productItem.innerHTML = `
                <h2>${title}</h2>
                <div class="image-container">
                    <img class="prod-images"src=${img_link}/>
                </div>
                <div class = "details">
                    <h3><span>$</span><span class='item-amount'>${price}</span></h3>
                    <button onclick="addToCart(${id})" class="add-cart-btn" type="button">Add to cart</button>
                </div>
            </div>
            `
            musicContainer.appendChild(productItem);
        });
            pageBtn = document.createElement('div');
            pageBtn.classList.add('page-btn');
            if ((hasPreviousPage) && (hasNextPage)) {
                pageBtn.innerHTML = `
                <button class='pg-btn-small' onclick="getproducts(${previousPage})">${previousPage}</button>
                <button class='pg-btn-big'onclick="getproducts(${currentPage})">${currentPage}</button>
                <button class='pg-btn-small'onclick="getproducts(${nextPage})">${nextPage}</button> 
                `;
            } else if ((hasPreviousPage) && (!hasNextPage)){
                pageBtn.innerHTML = `
                <button class='pg-btn-small' onclick="getproducts(${previousPage})">${previousPage}</button>
                <button class='pg-btn-big'onclick="getproducts(${currentPage})">${currentPage}</button>
                `;

            } else if ((!hasPreviousPage) && (hasNextPage)) {
                pageBtn.innerHTML = `
                <button class='pg-btn-big' onclick="getproducts(${currentPage})">${currentPage}</button>
                <button class='pg-btn-small'onclick="getproducts(${nextPage})">${nextPage}</button> 
                `;
            }
            pageContainer.appendChild(pageBtn);       

    })
}

function addToCart(id) {

    axios.post('http://localhost:3000/cart', {productId: id})
    .then(response =>{
        if(response.status === 200){
        notifyUser(response.data.message);
        postcart();
        // console.log(response.data.item);    
        } else {throw new Error(response.data.message)};
        }).catch(errmsg=>{
        notifyUser(errmsg);
    })
}

function notifyUser(message) {
    const container = document.querySelector('.notification-container');
        const notification = document.createElement('div');
            notification.innerHTML=`
            <h4>${message} </h4>
            `;
            container.appendChild(notification);
            container.style = 'display: block;'
            setTimeout(()=>{
                notification.remove();
                container.style = 'display: none;'
            },2500)
}

function postcart(){
    axios.get('http://localhost:3000/cart').then(response=>{
        let products = response.data.products;
        cartItems.innerHTML="";
        document.querySelector('.total-amount').innerText = 0;                                                                                                                                                                                                              
        console.log(products)
        products.forEach(product=>{
        const id = product.id;
        const title = product.title;
        const price = product.price;
        const img_link = product.imageUrl;
        const quantity = product.cartItem.quantity;
        total_price = document.querySelector('.total-amount').innerText;
        cartItem = document.createElement('div');
        cartItem.classList.add("cart-item-row");
            cartItem.setAttribute('id',`in-cart-${id}`);
            document.querySelector('.total-amount').innerText = (parseFloat(total_price)+(price*quantity)).toFixed(2);
    
            cartItem.innerHTML= `
            <div class="image-icon">
                <img src="${img_link}">
                <span class="item-name"><h3>${title}</h3></span>
                
            </div>    
            <span>$</span><span class="item-price">
            ${price}</span>
            <span class="item-quantity">${quantity}</span>
            <button id="remove" onclick = "deleteItem(${id})"class="remove-btn">REMOVE</button>
            `;
            cartItems.appendChild(cartItem);
 
    })
      
    document.querySelector(".no-of-items").innerText = products.length;
})

}

function closecart(){
    document.querySelector('.cart-container').style = "display:flex; transform: translateX(0);"
}

function showcart(){
    document.querySelector('.cart-container').style = "display:flex; transform: translateX(-100%);" ;
}

function deleteItem(id){
    axios.post('http://localhost:3000/cart-delete-item', {productId : id})
    .then (response=>{
        postcart();
    })

}