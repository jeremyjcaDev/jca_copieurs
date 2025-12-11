import Vue from "vue";
import App from "./App.vue";
import store from "./store"; // <--- ton store Vuex
import CopieurImage from "./components/CopieurImage.vue";

document.addEventListener("DOMContentLoaded", () => {
  const vueContainer = document.getElementById("vue-product-copieur-front");
  const copieurId = vueContainer?.dataset.copieurId || null;
  const productId = vueContainer?.dataset.productId || null;
  // Injecter l'input hidden dans le form natif PrestaShop
  const addToCartForm = document.getElementById("add-to-cart-or-refresh");
  if (
    addToCartForm &&
    !document.getElementById("customization-copieur-input")
  ) {
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "customization_copieur";
    hiddenInput.id = "customization-copieur-input";
    hiddenInput.value = "";
    addToCartForm.appendChild(hiddenInput);
  }
  new Vue({
    store, // <--- injecte le store ici
    render: (h) =>
      h(App, {
        props: { copieurId , productId },
      }),
  }).$mount("#vue-product-copieur-front");

  new Vue({
    store, // <--- injecte le store ici
    render: (h) =>
      h(CopieurImage, {
        props: { copieurId },
      }),
  }).$mount("#copieur-js-vue-image");
});
