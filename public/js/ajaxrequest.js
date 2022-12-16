
function removeProduct(cartId, productId) {
    console.log('working ajax');
    $.ajax({
      url: "/removeProduct",
      data: {
        cart: cartId,
        product: productId,
      },
      method: "post",
      success: () => {             
        Swal.fire({
          title: "Product removed from Cart!",
          icon: "success",
          confirmButtonText: "OK",
        }).then( ()=> {
          location.reload();
        })
      },


    });
  }

  function changeQuantity(cartId, productId, count){
    console.log('ajax request succussfully');
    let quantity = parseInt(document.getElementById(productId).innerHTML) 
    $.ajax({
        url:"/changeQuantity",
        data:{
            cart:cartId,
            product:productId,
            count:count,
            quantity:quantity
        },
        method:"post",
        success: (response)=>{ 
          if(response.status){
            document.getElementById(productId).innerHTML = quantity + count;
            // document.getElementById("sum").innerText = response.productData[0].total+"₹"
            // document.getElementById("netamount").innerText = response.productData[0].total+"₹"
            console.log(response);
          } 
          if(response.quantity){
            location.reload()
          }    
           
        }
    })
  }

  function removeFromWishlist(wishlistId,productId){
    console.log('fuction working');
   $.ajax({
    url: "/wishlist-remove",
    method: "post",
    data : {
      wishlistId,
      productId,
    },
    success : ()=>{
      Swal.fire({
        title: "Product removed from wishlist!",
        icon: "success",
        confirmButtonText: "OK",
      }).then( ()=> {
        location.reload();
      })

    }

   })

  }

  function addToCart (proId) {
    console.log('add to cart working');
     $.ajax({
       url: '/cart/'+proId,
       method:'get',
       success :()=>{
        Swal.fire({
          title: "Product added to Cart",
          icon: "success",
          confirmButtonText: "OK",
        }).then( ()=> {
          location.reload();
        })
       }

     })

  }