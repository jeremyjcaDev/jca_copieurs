<template>
  <div class="product-showcase">
    <div class="main-image">
      <img
        v-if="currentImages && currentImages.url"
        :src="currentImages.url"
        :alt="currentImages.alt || 'Image configuration'"
        class="showcase-img"
      />
      <div v-else class="placeholder-showcase">
        <div class="placeholder-img">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="placeholder-icon feather feather-image"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Aucune image</span>
        </div>
      </div>
    </div>

    <div class="configuration-summary">
      <h3>Configuration actuelle</h3>
      <div class="selected-products">
        <div
          v-for="product in currentProductWithDetails"
          :key="product.id_product_copieur"
          class="selected-product"
          :class="{
            disabled: checkIfProductIsDisabled(product.id_product_copieur),
            excluded: checkIfProductIsExcluded(product.id_product_copieur),
            required: checkIfProductIsRequired(product.id_product_copieur),
          }"
        >
          <!-- Déclenche le calcul du prix et la propagation de la configuration dès le montage -->
          <div v-if="false" style="display: none"></div>

          <img
            :src="
              product.image_url ||
              'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=100'
            "
            :alt="product.name"
            class="product-thumb"
          />
          <div class="product-details">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-mobile">{{ product.reference }}</span>
            <div class="flex gap-2">
            <span class="product-price text-orange-price">{{
              formatPriceToEuro(product.price + product.variation_price)
            }} (HT)</span>
            <span class="product-price text-gray-700">{{
              formatPriceTTC(product.price + product.variation_price)
            }} (TTC)</span>
            </div>
            <span
              v-if="selectedQuantities[product.id_product_copieur] > 1"
              class="quantity"
            >
              Qté: {{ selectedQuantities[product.id_product_copieur] }}
            </span>

            <!-- Ajout des messages de règles -->
            <div
              v-if="
                getProductRuleMessages(product.id_product_copieur).length > 0
              "
              class="rule-messages"
            >
              <div
                v-for="message in getProductRuleMessages(
                  product.id_product_copieur
                )"
                :key="message.id"
                :class="['rule-message', message.type]"
              >
                <alert-triangle-icon
                  v-if="message.type === 'warning'"
                  class="message-icon"
                />
                <x-circle-icon
                  v-if="message.type === 'error'"
                  class="message-icon"
                />
                <info-icon
                  v-if="message.type === 'info'"
                  class="message-icon"
                />
                <span class="message-text">{{ message.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="price-summary">
        <div class="total-price flex-row ">
          <span class="price-label font-bold">Prix total:</span>
          <div class="flex gap-2">
          <span class="product-price text-orange-price">{{
            formatPriceToEuro(calculateTotalPrice())
          }} (HT)</span>
          <span class="product-price text-gray-700">{{
            formatPriceToEuro(calculateTotalPriceHT())
          }} (TTC)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CopieurImage",
  computed: {
    ...mapState([
      "currentImages",
      "currentProductWithDetails",
      "totalPrice",
      "selectedQuantities",
    ]),
  },
  methods: {
    formatPriceToEuro(price) {
      const priceHT = price / 1.2; // Conversion du prix TTC en HT (TVA 20%)
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(priceHT);
    },
    formatPriceTTC(price) {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },
    checkIfProductIsDisabled(productId) {
      return this.$store.getters.isProductDisabled(productId);
    },
    checkIfProductIsExcluded(productId) {
      return this.$store.getters.isProductExcluded(productId);
    },
    checkIfProductIsRequired(productId) {
      return this.$store.getters.isProductRequired(productId);
    },
    getProductRuleMessages(productId) {
      return this.$store.getters.getProductRuleMessages(productId);
    },
    calculateTotalPrice() {
      return this.totalPrice;
    },
    calculateTotalPriceHT() {
      return this.totalPrice / 1.2; // Conversion du prix TTC en HT (TVA 20%)
    },
  },
};
</script>

<style scoped>
.preview-tab {
  max-width: 100%;
  padding: 0 16px;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}

.tab-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.info-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.configurator-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-showcase {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  order: 1;
}

.main-image {
  margin-bottom: 16px;
}

.showcase-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.placeholder-showcase {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #999;
}

.placeholder-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}

.configuration-summary h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px;
}

.selected-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.selected-product {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 2px solid transparent;
}

.product-thumb {
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-name {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}

.product-price {
  font-size: 12px;
  font-weight: 600;
  display: flex;
  gap: 8px;
}

.quantity {
  font-size: 10px;
  color: #666;
}

.price-summary {
  padding: 12px;
  border-radius: 8px;
  color: white;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

.price-label {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
}

.options-configurator {
  display: flex;
  flex-direction: column;
  gap: 12px;
  order: 2;
}

.option-accordion {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.accordion-header:hover {
  background: #f0f0f0;
}

.accordion-title {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.required-badge {
  background: #ffebee;
  color: #d32f2f;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

.accordion-icon {
  width: 20px;
  height: 20px;
  color: #666;
  transition: transform 0.3s;
}

.accordion-icon.rotated {
  transform: rotate(180deg);
}

.accordion-content {
  padding: 16px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.product-item:hover {
  background: white;
  border-color: #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-item.selected {
  background: white;
  border-color: #1976d2;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.2);
}

.product-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f0f0f0;
}

.product-item.excluded,
.selected-product.excluded {
  border-color: #d32f2f;
  background: #ffebee;
}

.product-item.required,
.selected-product.required {
  border-color: #ff9800;
  background: #fff3e0;
}

.none-option {
  border: 2px dashed #ddd;
  justify-content: center;
  text-align: center;
}

.none-option.selected {
  border-color: #1976d2;
  background: #e3f2fd;
}

.product-image {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.none-icon {
  width: 32px;
  height: 32px;
  color: #999;
  margin: 24px auto;
}

.product-badges {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge {
  padding: 2px 4px;
  border-radius: 8px;
  font-size: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.required {
  background: #ffebee;
  color: #d32f2f;
  z-index: 9999;
} 

.badge.price-up {
  background: #e8f5e8;
  color: #2e7d32;
}

.badge.price-down {
  background: #fff3e0;
  color: #f57c00;
}

.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(25, 118, 210, 0.9);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.disabled-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.disabled-icon {
  width: 24px;
  height: 24px;
  color: white;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px;
  line-height: 1.3;
}

.rule-messages {
  margin: 4px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rule-message {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 1.2;
}

.rule-message.error {
  background: #ffebee;
  color: #d32f2f;
}

.rule-message.warning {
  background: #fff3e0;
  color: #f57c00;
}

.rule-message.info {
  background: #e3f2fd;
  color: #1976d2;
}

.message-icon {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.message-text {
  font-weight: 500;
}

.product-mobile {
  font-size: 11px;
  color: #666;
  margin: 0 0 4px;
}

.product-price {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.price-variation {
  font-size: 11px;
  color: #666;
  font-weight: normal;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.qty-btn:hover:not(:disabled) {
  border-color: #1976d2;
  background: #f3f9ff;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-tiny {
  width: 12px;
  height: 12px;
}

.qty-display {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.global-messages {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.global-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease-out;
}

.global-message.error {
  background: #ffebee;
  color: #d32f2f;
  border-left: 4px solid #d32f2f;
}

.global-message.warning {
  background: #fff3e0;
  color: #f57c00;
  border-left: 4px solid #f57c00;
}

.global-message.success {
  background: #e8f5e8;
  color: #2e7d32;
  border-left: 4px solid #2e7d32;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Desktop adaptations */
@media (min-width: 768px) {
  .preview-tab {
    max-width: 1200px;
    padding: 0 24px;
  }

  .configurator-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 32px;
    align-items: start;
  }

  .product-showcase {
    position: sticky;
    top: 24px;
    order: 0;
  }

  .main-image {
    margin-bottom: 20px;
  }

  .showcase-img {
    height: 420px;
  }
 
  .placeholder-showcase {
    height: 420px;
  } 

  .global-messages {
    top: 24px;
    right: 24px;
    left: auto;
    bottom: auto;
    max-width: 400px;
  }

  .global-message {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
}
.product-header {
  display: flex;
  align-items: center;
}
</style>
