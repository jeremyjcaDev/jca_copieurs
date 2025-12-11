import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import CopieurImage from "./components/CopieurImage.vue";

if (!window.JCA_COPIEURS_CONFIG) {
  window.JCA_COPIEURS_CONFIG = {
    apiBaseUrl: null,
    token: 'dev-token'
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const vueContainer = document.getElementById("vue-product-copieur-front");
  const imageContainer = document.getElementById("copieur-js-vue-image");

  if (vueContainer) {
    const copieurId = vueContainer?.dataset.copieurId || '26';
    const productId = vueContainer?.dataset.productId || null;

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
      store,
      render: (h) =>
        h(App, {
          props: { copieurId: parseInt(copieurId), productId: productId ? parseInt(productId) : null },
        }),
    }).$mount("#vue-product-copieur-front");
  }

  if (imageContainer) {
    const copieurId = imageContainer?.dataset.copieurId || '26';

    new Vue({
      store,
      render: (h) =>
        h(CopieurImage, {
          props: { copieurId: parseInt(copieurId) },
        }),
    }).$mount("#copieur-js-vue-image");
  }

  if (!vueContainer && !imageContainer) {
    const devContainer = document.getElementById("app");
    if (devContainer) {
      new Vue({
        store,
        render: (h) =>
          h(App, {
            props: { copieurId: 26, productId: null },
          }),
      }).$mount("#app");
    }
  }
});
