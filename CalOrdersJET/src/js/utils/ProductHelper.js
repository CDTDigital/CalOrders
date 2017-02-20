/* 
 * The OnCore Consulting LLC License
 *
 * Copyright 2016 OnCore Consulting LLC, All Rights Reserved.
 *
 * Permission IS NOT GRANTED to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, unless the following conditions are met:
 *
 * Written permission is obtained from  
 * OnCore Consulting LLC and the above copyright 
 * notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var ProductHelper = new function ()
{
    /**
     * Gets the photo for a product and sets it on the product image
     */
    this.getPhoto = function (product)
    {
        if (product === undefined || product === null || product.prdImgImage === null 
                || product.prdImgImage === undefined || product.prdImgImage.length === 0)
        {
            var src = '../../css/images/unknown_product.jpg';
            return src;
        } 
        else
        {
            var file = product.prdImgImage;
                    
            var imageSize = product.prdImgImage.length;
            var imageType = product.prdImgTypeCd.longDesc;

            var reader = new FileReader();

            var data = window.atob(file);
            var arr = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                arr[i] = data.charCodeAt(i);
            }

            var blob = new Blob([arr.buffer], {size: imageSize, type: imageType});

            reader.addEventListener("load", function (event) {
                var preview = document.getElementById('productImage' + product.prdUid);
                
                if ( preview !== null)
                {
                    preview.src = reader.result;
                }
            }, false);

            if (blob) {

                try {
                    reader.readAsDataURL(blob);

                } catch (err)
                {
                    console.log(err);
                }
            }
        }
    };

    this.addProductToCart = function (product)
    {
        var cartProducts;

        // Get cart - if no cart yet then initialize
        if (sessionStorage.cartProducts !== undefined && sessionStorage.cartProducts !== "")
        {
            cartProducts = JSON.parse(sessionStorage.cartProducts);

        } else
        {
            cartProducts = [];
        }

        // If the product already exists in the cart, then just change the quantity
        var result = $.grep(cartProducts, function (item) {
            return item.prdUid === product.prdUid;
        });
        var cartProduct;

        if (result.length === 1)
        {
            cartProduct = result[0];
            cartProduct.quantity += product.quantity();
        } else
        {
            // Deep copy
            cartProduct = jQuery.extend(true, {}, product);
            cartProduct.quantity = product.quantity();
            cartProducts.push(cartProduct);
        }

        console.log("CART CONTENTS:");
        var val;
        for (val in cartProducts)
        {
            console.log("     Prodcut Id: " + cartProducts[val].prdUid + " - Quantity: " + cartProducts[val].quantity);
        }

        // Save cart back into session
        sessionStorage.cartProducts = JSON.stringify(cartProducts);
    }
    ;
};


