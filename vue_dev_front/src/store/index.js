import Vue from "vue";
import Vuex from "vuex";
import ApiService from "../services/api";

Vue.use(Vuex);

// Helpers pour les calculs
const calculateProductPrice = (product) => {
  return (product.price || 0) + (product.variation_price || 0);
};

const generateConfigurationSignature = (configuration) => {
  return configuration
    .map((item) => `${item.id_product_attribute}:${item.qty}`)
    .sort()
    .join("|");
};

export default new Vuex.Store({
  state: {
    currentCopieur: null,
    currentConfiguration: [],
    configurationSignature: "",
    loading: false,
    error: null,
    customizationInput: "",
    totalPrice: 0,
    currentImages: null,
    currentProductWithDetails: null,
    selectedQuantities: {}, // Ajout de la propriété pour suivre les quantités sélectionnées
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },

    // Stocke les données complètes du copieur (options, produits, règles, etc.)
    SET_CURRENT_COPIEUR(state, copieur) {
      state.currentCopieur = copieur;
    },

    // Stocke la sélection actuelle de l'utilisateur (produits sélectionnés + quantités)
    SET_USER_SELECTION(state, configuration) {
      state.currentConfiguration = configuration;
    },

    // Stocke une "empreinte" unique de la configuration pour comparaisons rapides
    SET_SELECTION_FINGERPRINT(state, signature) {
      state.configurationSignature = signature;
    },

    SET_TOTAL_PRICE(state, price) {
      state.totalPrice = price;
    },

    // Synchronise la configuration avec l'input hidden PrestaShop
    SYNC_WITH_PRESTASHOP_FORM(state, configuration) {
      const serializedConfig = JSON.stringify({
        components: configuration,
        timestamp: Date.now(),
        signature: generateConfigurationSignature(configuration),
      });

      // Mettre à jour l'input hidden pour PrestaShop
      const input = document.getElementById("customization-copieur-input");
      if (input) {
        input.value = serializedConfig;
      }

      // Stocker dans le state pour debug/référence
      state.customizationInput = serializedConfig;
    },

    CLEAR_ERROR(state) {
      state.error = null;
    },

    // Synchronise les images de la configuration en cours avec la vue qui se trouve dans un autre composant ( container CopieurImage)
    SET_IMAGES(state, images) {
      console.warn("SET IMAGES mutation called with images:", images);
      state.currentImages = images;
    },
    SET_PRODUCT_WITH_DETAILS(state, { product }) {
      state.currentProductWithDetails = product;
    },
    SET_SELECTED_QUANTITIES(state, quantities) {
      state.selectedQuantities = quantities;
    },
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    currentCopieurData: (state) => state.currentCopieur?.Copieur || null,
    getProductById: (state) => (productId) => {
      return state.currentCopieur?.Copieur?.produits?.find(
        (p) => p.id_product_copieur === productId
      );
    },
    getOptionById: (state) => (optionId) => {
      return state.currentCopieur?.Copieur?.options?.find(
        (o) => o.id === optionId
      );
    },
    getProductName: (state, getters) => (productId) => {
      const product = getters.getProductById(productId);
      return product?.name || "Produit inconnu";
    },

    getProductPrice: (state, getters) => (productId) => {
      const product = getters.getProductById(productId);
      return product ? calculateProductPrice(product) : 0;
    },
    getConfigurationDetails: (state, getters) => {
      if (!state.currentConfiguration?.length || !getters.currentCopieurData) {
        return { totalItems: 0, totalPrice: 0, products: [] };
      }

      const products = state.currentConfiguration.map((configItem) => {
        const product = getters.getProductById(configItem.id_product_copieur);
        return {
          ...configItem,
          productDetails: product,
          totalPrice: (configItem.price || 0) * (configItem.qty || 1),
        };
      });

      return {
        totalItems: state.currentConfiguration.reduce(
          (sum, item) => sum + (item.qty || 1),
          0
        ),
        totalPrice: products.reduce((sum, item) => sum + item.totalPrice, 0),
        products: products,
      };
    },
    isProductDisabled: (state) => (productId) => {
      return state.currentCopieur?.disabledProducts?.includes(productId);
    },
    isProductExcluded: (state) => (productId) => {
      return state.currentCopieur?.excludedProducts?.includes(productId);
    },
    isProductRequired: (state) => (productId) => {
      return state.currentCopieur?.requiredProducts?.includes(productId);
    },
    getProductRuleMessages: (state) => (productId) => {
      // Exemple de logique pour récupérer les messages de règles d'un produit
      const product = state.currentCopieur?.Copieur?.produits?.find(
        (p) => p.id_product_copieur === productId
      );

      if (!product) return [];

      // Exemple de structure de messages
      return (
        product.rules?.map((rule) => ({
          id: rule.id,
          type: rule.type, // "warning", "error", "info"
          text: rule.message,
        })) || []
      );
    },
  },

  actions: {
    async loadCopieur({ commit }, copieurId) {
      try {
        commit("SET_LOADING", true);
        commit("CLEAR_ERROR");

        const response = await ApiService.getCopieur(copieurId);

        if (response && response.success && response.data) {
          commit("SET_CURRENT_COPIEUR", response.data);
        } else {
          throw new Error("Données copieur invalides");
        }
      } catch (error) {
        commit("SET_ERROR", "Impossible de charger le configurateur");
      } finally {
        commit("SET_LOADING", false);
      }
    },

    setDefaultConfigurationFromCopieur({ commit, state, getters }) {
      if (!state.currentCopieur?.Copieur) return;
      const copieur = state.currentCopieur.Copieur;
      // Chercher la configuration par défaut
      const defaultConfig = copieur.configurations?.find(
        (config) => config.is_default
      );

      if (defaultConfig && defaultConfig.products) {
        const configuration = defaultConfig.products.map((product) => ({
          id: product.id_product_copieur,
          id_product_attribute: product.id_product_attribute_prestashop,
          qty: product.quantity || 1,
          name: getters.getProductName(product.id_product_copieur),
          price: getters.getProductPrice(product.id_product_copieur),
        }));
        commit("SET_USER_SELECTION", configuration);
      } else {
        // Si pas de configuration par défaut, prendre le premier produit de chaque option obligatoire
        const defaultProducts = [];

        copieur.options?.forEach((option) => {
          if (!option.choix_multiple && !option.affiche_aucun_produit) {
            const firstProduct = copieur.produits?.find(
              (p) => p.id_copieur_option === option.id
            );
            if (firstProduct) {
              defaultProducts.push({
                id: firstProduct.id_product_prestashop,
                id_product_attribute:
                  firstProduct.id_product_attribute_prestashop || 0,
                qty: firstProduct.qte_min || 1,
                name: firstProduct.name,
                price: firstProduct.price,
              });
            }
          }
        });
        commit("SET_USER_SELECTION", defaultProducts);
      }
    },

    updateConfiguration({ commit }, configuration) {
      const signature = generateConfigurationSignature(configuration);
      commit("SET_USER_SELECTION", configuration);
      commit("SET_SELECTION_FINGERPRINT", signature);
      commit("SYNC_WITH_PRESTASHOP_FORM", configuration);
    },

    updateImages({ commit }, images) {
      commit("SET_IMAGES", images);
    },
    updateProductWithDetails({ commit }, product) {
      commit("SET_PRODUCT_WITH_DETAILS", { product });
    },

    updateTotalPrice({ commit }, price) {
      commit("SET_TOTAL_PRICE", price);
    },
    updateSelectedQuantities({ commit }, quantities) {
      commit("SET_SELECTED_QUANTITIES", quantities);
    },
  },
});
