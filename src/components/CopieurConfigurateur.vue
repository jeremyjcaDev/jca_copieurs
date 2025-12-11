<template>
  <div class="preview-tab">
    <div class="configurator-container">
      <!-- Configuration des options avec accordéons -->
      <div class="options-configurator">
        <div
          v-for="(option, index) in copieur.options"
          :key="`preview-option-${option.ordre}`"
          class="option-accordion"
          :class="{ 'is-open': openAccordions[index] }"
        >
          <div class="accordion-header" @click="toggleAccordion(index)">
            <div class="accordion-title">
              <h4 class="option-title">
                {{ option.titre_option || option.nom_option }}
              </h4>
              <span
                v-if="!option.choix_multiple && !option.affiche_aucun_produit"
                class="required-badge"
              >
                Obligatoire
              </span>
            </div>
            <chevron-down-icon
              class="accordion-icon"
              :class="{ rotated: openAccordions[index] }"
            />
          </div>

          <div class="accordion-content" v-show="openAccordions[index]">
            <div class="products-list">
              <!-- Option "Aucun produit" si activée -->
              <div
                v-if="option.affiche_aucun_produit"
                class="product-item none-option"
                :class="{
                  selected: selectedConfiguration[option.id] === null,
                }"
                @click="selectNoneOption(option.id)"
              >
                <div class="product-image">
                  <x-circle-icon class="none-icon" />
                  <div
                    v-if="selectedConfiguration[option.id] === null"
                    class="selection-overlay"
                  >
                    <check-circle-icon class="check-icon" />
                  </div>
                </div>
                <div class="product-info flex flex-col justify-center">
                  <h5 class="product-name">Aucun produit</h5>
                  <p class="product-description-copieur">
                    Ne pas sélectionner de produit pour cette option
                  </p>
                </div>
              </div>

              <!-- Produits de l'option -->
              <div
                v-for="product in getProductsByOptionId(option.id)"
                :key="`preview-product-${product.id_product_copieur}`"
                class="product-item"
                :class="{
                  selected: checkIfProductIsSelected(
                    option.id,
                    product.id_product_copieur
                  ),
                  disabled: checkIfProductIsDisabled(
                    product.id_product_copieur
                  ),
                  excluded: checkIfProductIsExcluded(
                    product.id_product_copieur
                  ),
                  required: checkIfProductIsRequired(
                    product.id_product_copieur
                  ),
                }"
                @click="toggleProductSelection(option, product)"
              >
                <div class="product-image">
                  <img
                    :src="
                      product.image_url ||
                      'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=300'
                    "
                    :alt="product.nom_produit_ordinateur"
                    class="product-img"
                  />

                  <!-- Badges de statut -->
                  <div class="product-badges">
                    <span
                      v-if="product.achat_obligatoire"
                      class="badge required"
                      >Obligatoire</span
                    >
                    <span
                      v-if="product.variation_price > 0"
                      class="badge price-up"
                      >+{{ formatPriceToEuro(product.variation_price) }}</span
                    >
                    <span
                      v-if="product.variation_price < 0"
                      class="badge price-down"
                      >{{ formatPriceToEuro(product.variation_price) }}</span
                    >
                  </div>

                  <!-- Overlay de sélection -->
                  <div
                    v-if="
                      checkIfProductIsSelected(
                        option.id,
                        product.id_product_copieur
                      )
                    "
                    class="selection-overlay"
                  >
                    <check-circle-icon class="check-icon" />
                  </div>

                  <!-- Overlay de désactivation -->
                  <div
                    v-if="checkIfProductIsDisabled(product.id_product_copieur)"
                    class="disabled-overlay"
                  >
                    <x-circle-icon class="disabled-icon" />
                  </div>
                </div>

                <div class="product-info">
                  <div class="product-header">
                    <h5 class="product-name">
                      {{ product.name }}
                    </h5>

                    <!-- Messages de règles à droite du nom -->
                    <div
                      v-if="
                        getProductRuleMessages(product.id_product_copieur)
                          .length > 0
                      "
                      class="rule-messages"
                      style="
                        margin-left: 16px;
                        display: inline-flex;
                        align-items: center;
                      "
                    >
                      <div
                        v-for="message in getProductRuleMessages(
                          product.id_product_copieur
                        )"
                        :key="message.id"
                        :class="['rule-message', message.type]"
                        style="margin-left: 8px"
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

                  <p class="product-mobile">{{ product.reference }}</p>
                  <div class="product-price text-orange-price">
                    {{
                      formatPriceToEuro(product.price + product.variation_price)
                    }} 
                    <span
                      v-if="product.variation_price !== 0"
                      class="price-variation"
                    >
                      ({{ product.variation_price > 0 ? "+" : ""
                      }}{{ formatPriceToEuro(product.variation_price) }}) 
                    </span>
                    
                    <!-- Contrôles de quantité -->
                    <div
                      v-if="
                        product.case_choix_qte &&
                        checkIfProductIsSelected(
                          option.id,
                          product.id_product_copieur
                        )
                      "
                      class="quantity-controls"
                      @click.stop
                    >
                      <button
                        @click="decreaseQuantity(product.id_product_copieur)"
                        :disabled="
                          selectedQuantities[product.id_product_copieur] <=
                          product.qte_min
                        "
                        class="qty-btn"
                      >
                        <minus-icon class="icon-tiny" />
                      </button>
                      <span class="qty-display">{{
                        selectedQuantities[product.id_product_copieur] || 1
                      }}</span>
                      <button
                        @click="increaseQuantity(product.id_product_copieur)"
                        :disabled="
                          selectedQuantities[product.id_product_copieur] >=
                          product.qte_max
                        "
                        class="qty-btn"
                      >
                        <plus-icon class="icon-tiny" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages globaux de validation -->
    <div v-if="globalValidationMessages.length > 0" class="global-messages">
      <div
        v-for="message in globalValidationMessages"
        :key="message.id"
        :class="['global-message', message.type]"
      >
        <alert-triangle-icon
          v-if="message.type === 'warning'"
          class="message-icon"
        ></alert-triangle-icon>
        <x-circle-icon
          v-if="message.type === 'error'"
          class="message-icon"
        ></x-circle-icon>
        <check-circle-icon
          v-if="message.type === 'success'"
          class="message-icon"
        ></check-circle-icon>
        <span>{{ message.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import {
  XCircleIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  PlusIcon,
  MinusIcon,
  ChevronDownIcon,
} from "vue-feather-icons";

export default Vue.extend({
  name: "CopieurConfigurateur",
  components: {
    XCircleIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    InfoIcon,
    PlusIcon,
    MinusIcon,
    ChevronDownIcon,
  },

  data() {
    return {
      selectedConfiguration: {},
      selectedQuantities: {},
      ruleMessages: [],
      openAccordions: {},
    };
  },

  computed: {
    ...mapState(["currentCopieur"]),

    copieur() {
      return (
        this.currentCopieur?.Copieur || {
          options: [],
          produits: [],
          configurations: [],
          rules: [],
        }
      );
    },

    globalValidationMessages() {
      const messages = [];

      if (this.copieur.rules) {
        this.copieur.rules.forEach((rule) => {
          if (this.isRuleTriggered(rule)) {
            if (rule.target_type === 'product') {
              const targetProduct = this.copieur.produits.find(
                (p) => p.id_product_copieur === rule.target_id
              );
              const isTargetSelected = this.getSelectedProductIds().includes(
                rule.target_id
              );

              if (rule.action_type === "exclude" && isTargetSelected) {
                messages.push({
                  id: `global-${rule.id}`,
                  type: "error",
                  text:
                    rule.message ||
                    `${targetProduct?.name} est exclu par une règle`,
                });
              } else if (rule.action_type === "require" && !isTargetSelected) {
                messages.push({
                  id: `global-${rule.id}`,
                  type: "warning",
                  text:
                    rule.message ||
                    `${targetProduct?.name} est requis par une règle`,
                });
              }
            } else if (rule.target_type === 'option') {
              const targetOption = this.copieur.options.find(
                (o) => o.id === rule.target_id
              );
              const isOptionSelected = this.isOptionSelected(rule.target_id);

              if (rule.action_type === "exclude" && isOptionSelected) {
                messages.push({
                  id: `global-${rule.id}`,
                  type: "error",
                  text:
                    rule.message ||
                    `L'option ${targetOption?.nom_option} est exclue par une règle`,
                });
              } else if (rule.action_type === "require" && !isOptionSelected) {
                messages.push({
                  id: `global-${rule.id}`,
                  type: "warning",
                  text:
                    rule.message ||
                    `L'option ${targetOption?.nom_option} est requise par une règle`,
                });
              }
            }
          }
        });
      }

      return messages;
    },
  },

  methods: {
    toggleAccordion(index) {
      Vue.set(this.openAccordions, index, !this.openAccordions[index]);
    },

    selectNoneOption(optionId) {
      const currentSelection = this.selectedConfiguration[optionId];

      if (Array.isArray(currentSelection)) {
        currentSelection.forEach((productId) => {
          Vue.delete(this.selectedQuantities, productId);
        });
      } else if (typeof currentSelection === "number" && currentSelection !== null) {
        Vue.delete(this.selectedQuantities, currentSelection);
      }

      this.$set(this.selectedConfiguration, optionId, null);

      this.applyExclusionRules();
      this.updateImage();

      const selectedProducts = this.getSelectedProductsWithDetails();
      if (selectedProducts.length === 0) {
        this.$store.dispatch("setDefaultConfigurationFromCopieur").then(() => {
          const defaultProducts = this.getSelectedProductsWithDetails();
          this.onConfigurationChanged({ produits: defaultProducts });
        });
      } else {
        this.onConfigurationChanged({ produits: selectedProducts });
      }
    },

    checkIfProductIsSelected(optionId, productId) {
      const selection = this.selectedConfiguration[optionId];
      if (selection === 0) {
        return productId === 0;
      }
      if (Array.isArray(selection)) {
        return selection.includes(productId);
      }
      return selection === productId;
    },

    getSelectedProductsDetails() {
      const selectedIds = this.getSelectedProductIds();
      return this.copieur.produits.filter((p) =>
        selectedIds.includes(p.id_product_copieur)
      );
    },

    getSelectedProductIds() {
      const productIds = [];
      Object.values(this.selectedConfiguration).forEach((selection) => {
        if (Array.isArray(selection)) {
          productIds.push(...selection);
        } else if (typeof selection === "number" && selection !== null) {
          productIds.push(selection);
        }
      });
      return productIds;
    },

    getProductsByOptionId(optionId) {
      return this.copieur.produits.filter(
        (product) => product.id_copieur_option === optionId
      );
    },

    checkIfProductIsDisabled(productId) {
      if (this.copieur.rules) {
        for (const rule of this.copieur.rules) {
          if (rule.action_type === "exclude" && this.isRuleTriggered(rule)) {
            if (rule.target_type === 'product' && rule.target_id === productId) {
              return true;
            }

            if (rule.target_type === 'option') {
              const product = this.copieur.produits.find(
                p => p.id_product_copieur === productId
              );
              if (product && product.id_copieur_option === rule.target_id) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    checkIfProductIsExcluded(productId) {
      return this.checkIfProductIsDisabled(productId);
    },

    checkIfProductIsRequired(productId) {
      if (this.copieur.rules) {
        for (const rule of this.copieur.rules) {
          if (rule.action_type === "require" && this.isRuleTriggered(rule)) {
            if (rule.target_type === 'product' && rule.target_id === productId) {
              return true;
            }

            if (rule.target_type === 'option') {
              const product = this.copieur.produits.find(
                p => p.id_product_copieur === productId
              );
              if (product && product.id_copieur_option === rule.target_id) {
                return true;
              }
            }
          }
        }
      }
      return false;
    },

    isRuleTriggered(rule) {
      const selectedProductIds = this.getSelectedProductIds();

      switch (rule.rule_type) {
        case "no_product_exclusion": {
          if (rule.source_type === 'option') {
            return this.isNoProductSelectedInOptionById(rule.source_id);
          }
          return false;
        }

        case "option_exclusion":
        case "option_obligation":
          return this.isOptionSelected(rule.source_id);

        case "product_exclusion":
        case "product_obligation":
          return selectedProductIds.includes(rule.source_id);

        case "quantity_rule": {
          if (!selectedProductIds.includes(rule.source_id)) return false;

          const quantity = this.selectedQuantities[rule.source_id] || 1;
          switch (rule.condition_operator) {
            case "=":
              return quantity === rule.condition_value;
            case ">=":
              return quantity >= rule.condition_value;
            case "<=":
              return quantity <= rule.condition_value;
            case ">":
              return quantity > rule.condition_value;
            case "<":
              return quantity < rule.condition_value;
            default:
              return false;
          }
        }

        default:
          return false;
      }
    },

    isNoProductSelectedInOptionById(optionId) {
      const selection = this.selectedConfiguration[optionId];

      if (selection === null || selection === undefined) {
        return true;
      }

      if (Array.isArray(selection) && selection.length === 0) {
        return true;
      }

      return false;
    },

    isOptionSelected(optionId) {
      const option = this.copieur.options.find((o) => o.id === optionId);
      if (!option) return false;

      const optionProducts = this.getProductsByOptionId(option.id);
      return optionProducts.some((product) =>
        this.getSelectedProductIds().includes(product.id_product_copieur)
      );
    },

    getProductRuleMessages(productId) {
      const messages = [];

      if (this.copieur.rules) {
        this.copieur.rules.forEach((rule) => {
          if (rule.target_type === 'product' && rule.target_id === productId && this.isRuleTriggered(rule)) {
            let type = "info";
            let text = rule.message || "Règle appliquée";

            if (rule.action_type === "exclude") {
              type = "error";
              text = rule.message || "Produit exclu par une règle";
            }
            if (rule.action_type === "require") {
              type = "warning";
              text = rule.message || "Produit requis par une règle";
            }

            messages.push({
              id: `rule-${rule.id}`,
              type,
              text,
            });
          }
        });
      }

      return messages;
    },

    toggleProductSelection(option, product) {
      if (this.checkIfProductIsDisabled(product.id_product_copieur)) return;

      const optionId = option.id;

      if (option.choix_multiple) {
        if (!this.selectedConfiguration[optionId]) {
          Vue.set(this.selectedConfiguration, optionId, []);
        }

        const currentSelection = [...this.selectedConfiguration[optionId]];
        const index = currentSelection.indexOf(product.id_product_copieur);

        if (index > -1) {
          currentSelection.splice(index, 1);
          Vue.delete(this.selectedQuantities, product.id_product_copieur);
        } else {
          currentSelection.push(product.id_product_copieur);
          Vue.set(
            this.selectedQuantities,
            product.id_product_copieur,
            product.qte_min || 1
          );
        }

        Vue.set(this.selectedConfiguration, optionId, currentSelection);
      } else {
        if (
          this.selectedConfiguration[optionId] === product.id_product_copieur
        ) {
          Vue.set(this.selectedConfiguration, optionId, null);
          Vue.delete(this.selectedQuantities, product.id_product_copieur);
        } else {
          Vue.set(
            this.selectedConfiguration,
            optionId,
            product.id_product_copieur
          );
          Vue.set(
            this.selectedQuantities,
            product.id_product_copieur,
            product.qte_min || 1
          );
        }
      }

      this.applyExclusionRules();
      this.updateImage();

      const selectedProducts = this.getSelectedProductsWithDetails();
      if (selectedProducts.length === 0) {
        this.$store.dispatch("setDefaultConfigurationFromCopieur").then(() => {
          const defaultProducts = this.getSelectedProductsWithDetails();
          this.onConfigurationChanged({ produits: defaultProducts });
        });
      } else {
        this.onConfigurationChanged({ produits: selectedProducts });
      }
    },

    applyExclusionRules() {
      if (!this.copieur.rules) return;

      this.copieur.rules.forEach((rule) => {
        if (rule.action_type === "exclude" && this.isRuleTriggered(rule)) {
          if (rule.target_type === 'product') {
            const targetId = rule.target_id;

            Object.keys(this.selectedConfiguration).forEach((optionId) => {
              const selection = this.selectedConfiguration[optionId];

              if (Array.isArray(selection)) {
                const index = selection.indexOf(targetId);
                if (index > -1) {
                  selection.splice(index, 1);
                  Vue.set(this.selectedConfiguration, optionId, selection);
                }
              } else if (selection === targetId) {
                Vue.set(this.selectedConfiguration, optionId, null);
              }
            });

            Vue.delete(this.selectedQuantities, targetId);
          } else if (rule.target_type === 'option') {
            const optionProducts = this.getProductsByOptionId(rule.target_id);

            optionProducts.forEach(product => {
              const productId = product.id_product_copieur;

              Object.keys(this.selectedConfiguration).forEach((optionId) => {
                const selection = this.selectedConfiguration[optionId];

                if (Array.isArray(selection)) {
                  const index = selection.indexOf(productId);
                  if (index > -1) {
                    selection.splice(index, 1);
                    Vue.set(this.selectedConfiguration, optionId, selection);
                  }
                } else if (selection === productId) {
                  Vue.set(this.selectedConfiguration, optionId, null);
                }
              });

              Vue.delete(this.selectedQuantities, productId);
            });
          }
        }
      });
    },

    decreaseQuantity(productId) {
      if (this.selectedQuantities[productId] > 1) {
        this.$set(
          this.selectedQuantities,
          productId,
          this.selectedQuantities[productId] - 1
        );
        this.updateTotalPrice();
        this.updateImage();
      }
    },

    increaseQuantity(productId) {
      const product = this.copieur.produits.find(
        (p) => p.id_product_copieur === productId
      );
      if (product && this.selectedQuantities[productId] < product.qte_max) {
        this.$set(
          this.selectedQuantities,
          productId,
          this.selectedQuantities[productId] + 1
        );
        this.updateTotalPrice();
        this.updateImage();
      }
    },

    updateTotalPrice() {
      const totalPrice = Object.entries(this.selectedQuantities).reduce(
        (sum, [productId, qty]) => {
          const product = this.copieur.produits.find(
            (p) => p.id_product_copieur === parseInt(productId)
          );
          return product ? sum + product.price * qty : sum;
        },
        0
      );
      this.$store.dispatch("updateTotalPrice", totalPrice);
    },

    getSelectedProductsWithDetails() {
      const selectedIds = this.getSelectedProductIds();
      const selectedProducts = this.copieur.produits.filter((p) =>
        selectedIds.includes(p.id_product_copieur)
      );
      this.$store.dispatch("updateProductWithDetails", selectedProducts);
      return selectedProducts;
    },

    calculateTotalPrice() {
      let total = 0;
      const selectedProducts = this.getSelectedProductsWithDetails();

      selectedProducts.forEach((product) => {
        console.log('product', product);
        const quantity =
          this.selectedQuantities[product.id_product_copieur] || 1;
        const price = (product.price || 0) + (product.variation_price || 0);
        total += price * quantity;
      });

      if (
        this.copieur.remise_copieur &&
        this.copieur.remise_copieur.type &&
        this.copieur.remise_copieur.valeur
      ) {
        if (this.copieur.remise_copieur.type === "percentage") {
          total = total * (1 - this.copieur.remise_copieur.valeur / 100);
        } else if (this.copieur.remise_copieur.type === "fixed") {
          total = Math.max(0, total - this.copieur.remise_copieur.valeur);
        }
      }

      this.$store.dispatch("updateTotalPrice", total);
      return total;
    },

    getSelectedConfigurationUser() {
      const products = [];
      const selectedIds = this.getSelectedProductIds();
      selectedIds.forEach((id_product_copieur) => {
        const quantity = this.selectedQuantities[id_product_copieur] || 1;
        products.push({ id_product_copieur, quantity });
      });
      return this.getConfigurationUser(products);
    },

    getConfigurationUser(products) {
      return products
        .map((p) => `${p.id_product_copieur}:${p.quantity}`)
        .sort()
        .join("|");
    },

    getConfiguration(products) {
      return products.map((p) => ({
        id: p.id_product_prestashop,
        id_product_attribute: p.id_product_attribute_prestashop || 0,
        qty: p.quantity || 1,
        name: p.name || "",
        price: p.price || 0,
      }));
    },

    onConfigurationChanged(configuration) {
      const signature = this.getConfigurationUser(configuration.produits || []);
      const configArray = this.getConfiguration(configuration.produits || []);
      this.currentImageConfig();
      this.$store.commit("SET_SELECTION_FINGERPRINT", signature);
      this.$store.commit("SET_USER_SELECTION", configArray);
      this.$emit("configuration-changed", configArray);
      this.$emit("price-calculated", this.calculateTotalPrice());
    },

    updateImage() {
      this.$forceUpdate();
    },

    formatPriceToEuro(price) {
      if (typeof price !== "number" || isNaN(price)) return "0,00 €";
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(price);
    },

    currentImageConfig() {
      if (
        !this.copieur.configurations ||
        this.copieur.configurations.length === 0
      )
        return null;

      const currentConfig = this.getSelectedConfigurationUser();
      for (const config of this.copieur.configurations) {
        const imageConfig = this.getConfigurationUser(config.products || []);
        if (imageConfig === currentConfig) {
          this.$store.dispatch("updateImages", config);
          return;
        }
      }

      return this.copieur.configurations[0];
    },
  },

  mounted() {
    Vue.set(this.openAccordions, 0, true);

    if (
      this.$store.state.currentConfiguration &&
      Array.isArray(this.$store.state.currentConfiguration) &&
      this.$store.state.currentConfiguration.length > 0
    ) {
      this.$store.state.currentConfiguration.forEach((product) => {
        const option = this.copieur.options.find((opt) => {
          return this.getProductsByOptionId(opt.id).some(
            (p) => p.id_product_copieur === product.id
          );
        });
        if (option) {
          if (option.choix_multiple) {
            if (!Array.isArray(this.selectedConfiguration[option.id])) {
              Vue.set(this.selectedConfiguration, option.id, []);
            }
            if (!this.selectedConfiguration[option.id].includes(product.id)) {
              this.selectedConfiguration[option.id].push(product.id);
            }
          } else {
            Vue.set(this.selectedConfiguration, option.id, product.id);
          }
          Vue.set(this.selectedQuantities, product.id, product.qty || 1);
        }
      });

      this.onConfigurationChanged({
        produits: this.getSelectedProductsWithDetails(),
      });
      this.currentImageConfig();
    } else {
      this.$store.dispatch("setDefaultConfigurationFromCopieur").then(() => {
        if (
          this.$store.state.currentConfiguration &&
          Array.isArray(this.$store.state.currentConfiguration)
        ) {
          this.$store.state.currentConfiguration.forEach((product) => {
            const option = this.copieur.options.find((opt) => {
              return this.getProductsByOptionId(opt.id).some(
                (p) => p.id_product_prestashop === product.id
              );
            });
            if (option) {
              if (option.choix_multiple) {
                if (!Array.isArray(this.selectedConfiguration[option.id])) {
                  Vue.set(this.selectedConfiguration, option.id, []);
                }
                if (
                  !this.selectedConfiguration[option.id].includes(product.id)
                ) {
                  this.selectedConfiguration[option.id].push(product.id);
                }
              } else {
                Vue.set(this.selectedConfiguration, option.id, product.id);
              }
              Vue.set(this.selectedQuantities, product.id, product.qty || 1);
            }
          });
        }

        this.onConfigurationChanged({
          produits: this.getSelectedProductsWithDetails(),
        });
        this.$emit("price-calculated", this.calculateTotalPrice());
        this.currentImageConfig();
      });
    }
  },
});
</script>

<style scoped>
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
  padding: 14px;
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
  padding: 10px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 5px;
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
  border-color: #ed7124;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.2);
}

.product-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f0f0f0;
}

.product-item.excluded {
  border-color: #d32f2f;
  background: #ffebee;
}

.product-item.required {
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
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.none-icon {
  width: 27px;
  height: 27px;
  color: #999;
  margin: 15px auto;
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
  z-index: 99999;
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
  background: rgb(245 124 0 / 79%);
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
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px;
  line-height: 1;
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
  margin: 0;
}

.product-price {
  font-size: 14px;
  font-weight: 600;
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

@media (min-width: 768px) {
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

.product-description-copieur {
  color: #7a7a7a;
  font-size: 12px;
  margin: 0;
}
</style>
