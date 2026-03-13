
document.addEventListener("DOMContentLoaded", () => {
  // DOM REFERENCES
        const cartIcon = document.querySelector(".CustomBagIcon");
        const drawer = document.getElementById("customCartDrawer");
        const template = document.getElementById("cartItemTemplate");
        const closeBtn = drawer?.querySelector(".closeCustomDrawerbtn");
        const itemsContainer = document.getElementById("drawerCartItems");
        const footer = drawer?.querySelector(".custom-cart-footer");
        const totalAmount = drawer?.querySelector(".custom-cart-total .amount");
        const cartIconCount = document.getElementById("cartIcon");
        const drawerEmpty = document.querySelector(".drawer-empty");
        const addToCartBtn = document.getElementById("customBTM");
        const removeAllItems =  document.querySelector(".removeAllItems")
        const drawer_overlay  = document.querySelector(".drawer-overlay")
        if (!drawer || !cartIcon) return;
        // EVENT BINDINGS
        cartIcon.addEventListener("click", openDrawer);
        closeBtn?.addEventListener("click", openDrawer);
        addToCartBtn?.addEventListener("click", handleAddToCart);
        removeAllItems.addEventListener("click" , removeItems)
        drawer_overlay.addEventListener("click" , closeDrawer)
        // DRAWER CONTROLS
        async function openDrawer() {
          drawer.classList.toggle("active");
          drawer_overlay.classList.toggle("active")
          await loadCart();
        }
        function closeDrawer() {drawer.classList.remove("active");
          drawer_overlay.classList.remove("active")
        }
        async function removeItems() {await removeAllItemFromCart()}
        // FETCH CART
        async function fetchCart() {
          const response = await fetch("/cart.js");
          if (!response.ok) throw new Error("Cart fetch failed");
          return await response.json();
        }
        // LOAD + RENDER CART
        async function loadCart() {
          try {
            const cart = await fetchCart();
            renderCart(cart);
          } catch (err) {
            console.error("Cart Load Error:", err);
          }
        }

        function renderCart(cart) {
          itemsContainer.innerHTML = "";
          // Update cart icon
          cartIconCount.textContent = cart.item_count;
          cartIconCount.style.display = cart.item_count ? "flex" : "none";

          // Empty state handling
          if (cart.item_count === 0) {
            drawerEmpty?.classList.remove("hidden");
            footer?.classList.add("hidden");
            return;
          }
          drawerEmpty?.classList.add("hidden");
          footer?.classList.remove("hidden");
          cart.items.forEach((item) => {
            const clone = template.content.cloneNode(true);
            const img = clone.querySelector("img");
            const title = clone.querySelector(".cart-item__title");
            const variant = clone.querySelector(".cart-item__variant");
            const qty = clone.querySelector(".qty-value");
            const price = clone.querySelector(".cart-item__price");
            const customLineItemTxt = clone.querySelector(".customLineItemTxt");
            const propertiesImage  = clone.querySelector('.propertiesImage')
            img.src = item.image;
            img.alt = item.product_title;
            propertiesImage.src = item.properties.Custom_Image
            title.textContent = item.product_title;
            qty.textContent = item.quantity;
            price.textContent = formatMoney(cart.currency, item.final_line_price);
            customLineItemTxt.textContent = item.properties.Custom_Text
            item.variant_title && item.variant_title !== "Default Title" ? (variant.textContent = item.variant_title) : variant.remove();
            bindCartItemEvents(clone, item);
            itemsContainer.appendChild(clone);
          });
          totalAmount.textContent = formatMoney(cart.currency, cart.total_price);
        }
        // ITEM EVENTS
        function bindCartItemEvents(clone, item) {
          const minusBtn = clone.querySelector(".minus");
          const plusBtn = clone.querySelector(".plus");
          const removeBtn = clone.querySelector(".cart-item__remove");
          minusBtn?.addEventListener("click", () => {
            if (item.quantity > 1) {
              updateQuantity(item.key, item.quantity - 1);
            }
          });
          plusBtn?.addEventListener("click", () => {
            updateQuantity(item.key, item.quantity + 1);
          });
          removeBtn?.addEventListener("click", () => {
            updateQuantity(item.key, 0);
          });
        }
        // UPDATE QUANTITY
        async function updateQuantity(key, quantity) {
          try {
            await fetch("/cart/change.js", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: key, quantity }),
            });
            await loadCart();
          } catch (err) {
            console.error("Cart Update Error:", err);
          }
        }
        // ADD TO CART
        async function handleAddToCart(e) {
          e.preventDefault();
          const form = addToCartBtn.closest("form");
          const variantId = form.querySelector(".product-variant-id")?.value;
          const quantityInput = document.querySelector(".quantity__input");
          const maxQty = parseInt(form.querySelector(".varient-max-quantity")?.value);
          const quantity = Number(quantityInput?.value);
          const errorMsg = document.querySelector(".custom__error-message");
          const customText = document.getElementById('custom-text').value
          const customImageFile = document.getElementById('custom-image').files[0];
          
          if (quantity<1|| customText.length <=0 ) return
          if (maxQty && quantity > maxQty) {
            errorMsg.textContent = `Only ${maxQty} items available.`;
            return;
          }
          // console.log(customText.length);
          
   
          errorMsg.textContent = "";
          try {
            addToCartBtn.classList.add("loading");
              const formData = new FormData();
              formData.append("id", variantId);
              formData.append("quantity", quantity);
              formData.append("properties[Custom_Text]", customText);

              if (customImageFile) {
                formData.append("properties[Custom_Image]", customImageFile);
              }
            const response = await fetch("/cart/add.js", {
              method: "POST",
              body : formData
            });
            const data = await response.json();
            if (response.ok) {
                  addToCartBtn.textContent = "Item Added In Cart";
                  addToCartBtn.classList.remove("custom-atc-btn", "loading");
                  addToCartBtn.classList.add("BgGreen");
                  setTimeout(() => {
                  addToCartBtn.textContent = "Add to Cart";
                  addToCartBtn.classList.remove("BgGreen");
                  addToCartBtn.classList.add("custom-atc-btn");
                  addToCartBtn.disabled = false;
                  openDrawer();
                }, 2000);

          loadCart()
            }else{
            errorMsg.textContent= data.message
            }
          } catch (err) {
            console.log(err);
            errorMsg.textContent = err.message || "Item unavailable";
          } finally {
            addToCartBtn.classList.remove("loading");
          }
        }
        // HELPERS
        function formatMoney(currency, amount) {return `${currency} ${(amount / 100).toFixed(2)}`;}
        async function removeAllItemFromCart() {
          try {
              const response = await fetch("/cart/clear.js", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
              });
              const data = await response.json();
              await renderCart(data)
          } catch (error) {
              console.error("Error clearing cart:", error);
          }
        }
});

