<template>
  <div class="prestashop-pack-configurator">
    <CopieurConfigurateur
      v-if="currentCopieur"
      @configuration-changed="onConfigurationChanged"
      @price-calculated="onPriceCalculated"
    />
    <p v-else>Chargement des données...</p>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import CopieurConfigurateur from "./components/CopieurConfigurateur.vue";

export default Vue.extend({
  name: "App",
  props: ["copieurId", "productId"],
  computed: {
    ...mapState(["currentCopieur", "currentConfiguration", "loading", "error"]),
  },
  components: {
    CopieurConfigurateur,
  },

  data() {
    return {
      totalPrice: 0,
    };
  },

  methods: {
    onConfigurationChanged(configuration) {
      this.$store.commit("SET_USER_SELECTION", configuration);
      // Ici vous pouvez envoyer les données à PrestaShop
      this.sendConfigurationToPrestaShop(configuration);
    },

    onPriceCalculated(price) {
      console.log("Prix calculé:", price);
      this.totalPrice = price;
      // Mettre à jour le prix dans PrestaShop
      this.updatePrestaShopPrice(price);
    },

    sendConfigurationToPrestaShop(configuration) {
      // Intégration avec PrestaShop - à adapter selon vos besoins
      if (window.prestashop && window.prestashop.emit) {
        window.prestashop.emit("packConfigurationChanged", {
          configuration: configuration,
          price: this.totalPrice,
        });
      }
    },

    updatePrestaShopPrice(price) {
      // Mettre à jour l'affichage du prix dans PrestaShop
      const priceElement = document.querySelector(".current-price-value");
      if (priceElement) {
        const priceHT = price / 1.2; // Conversion du prix TTC en HT (TVA 20%)
        priceElement.textContent = this.formatPrice(priceHT);
        priceElement.dataset.content = priceHT;
      }

      const priceElementTTC = document.querySelector(".js-product-price-ttc");
      if(priceElementTTC){
        priceElementTTC.textContent = this.formatPriceTTC(price);
        priceElementTTC.dataset.content = price;
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },
    
    formatPriceTTC(price) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },

    retryLoad() {
      if (this.copieurId) {
        this.$store.dispatch("loadCopieur", this.copieurId, this.productId);
      } 
    },
  },

  mounted() {
    if (this.copieurId) {
      this.$store.dispatch("loadCopieur", this.copieurId, this.productId);
    }
  },

  watch: {
    "$store.state.currentConfiguration": {
      handler(newConfiguration) {
        // Synchronise avec le formulaire PrestaShop
        this.$store.commit("SYNC_WITH_PRESTASHOP_FORM", newConfiguration);
      },
      deep: true,
    },
    "$store.state.currentCopieur": {
      handler(newCopieur) {
        if (newCopieur) {
          this.$store.dispatch("setDefaultConfigurationFromCopieur");
        }
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.app-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e0e0e0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  color: #1976d2;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  border-right: 3px solid transparent;
}

.nav-item:hover {
  background: #f8f9fa;
  color: #1976d2;
}

.nav-item.active {
  background: #e3f2fd;
  color: #1976d2;
  border-right-color: #1976d2;
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-badge {
  background: #e0e0e0;
  color: #666;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  margin-left: auto;
}

.nav-item.active .nav-badge {
  background: #1976d2;
  color: white;
}

.nav-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 16px 24px;
}

.nav-section {
  padding: 8px 24px;
}

.nav-section-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.app-main {
  flex: 1;
  background: #f5f5f5;
}

@media (max-width: 1024px) {
  .app-sidebar {
    width: 260px;
  }

  .app-main {
    margin-left: 260px;
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .app-main {
    margin-left: 0;
  }
  /* In a real implementation, you'd add a mobile menu toggle */
}
.feedback-container {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 9999;
  min-width: 220px;
  max-width: 350px;
  pointer-events: none;
}
.feedback-message {
  padding: 14px 20px;
  border-radius: 6px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 15px;
  pointer-events: all;
}
.feedback-message.success {
  background: #43a047;
}
.feedback-message.error {
  background: #e53935;
}
.feedback-message.info {
  background: #1976d2;
}
</style>
