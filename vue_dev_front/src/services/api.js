import axios from "axios";

// Service API pour le module PrestaShop JCA Copieurs
class ApiService {
  constructor() {
    this.baseURL = window.JCA_COPIEURS_CONFIG?.apiBaseUrl;
    this.token = window.JCA_COPIEURS_CONFIG?.token || "";

    // Configuration Axios
    this.axios = axios.create({
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    // Intercepteur pour ajouter le token CSRF
    this.axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.data = config.data || {};
          config.data.token = this.token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les réponses
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 401) {
            console.error("🔒 Token invalide ou expiré");
          } else if (status === 403) {
            console.error("🚫 Accès refusé");
          } else if (status === 404) {
            console.error("🔍 Endpoint non trouvé");
          } else if (status >= 500) {
            console.error("🔥 Erreur serveur");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Méthode générique pour faire des requêtes POST vers le contrôleur
   */
  async request(action, data = {}) {
    try {
      const payload = { action, ...data };
      const response = await this.axios.post(this.baseURL, payload);
      return response.data;
    } catch (error) {
      if (error.request) {
        throw new Error("Erreur de connexion au serveur PrestaShop");
      }
      throw error;
    }
  }

  /**
   * Recherche de produits dans le catalogue PrestaShop
   */
  async searchProducts(query, limit = 50, category = null) {
    return this.request("searchProducts", { query, limit, category });
  }

  /**
   * Récupération des détails d'un produit
   */
  async getProductDetails(productId) {
    return this.request("getProductDetails", { productId });
  }

  /**
   * Récupération de la liste des copieurs
   */
  async getCopieurs() {
    return this.request("getCopieurs");
  }

  /**
   * Récupération d'un copieur spécifique par ID
   */
  async getCopieur(id) {
    return this.request("getCopieur", { id });
  }

  /**
   * Création d'un nouveau copieur
   */
  async createCopieur(copieurData) {
    return this.request("createCopieur", copieurData);
  }

  /**
   * Mise à jour d'un copieur existant
   */
  async updateCopieur(id, copieurData) {
    return this.request("updateCopieur", { id, ...copieurData });
  }

  /**
   * Suppression d'un copieur
   */
  async deleteCopieur(id) {
    return this.request("deleteCopieur", { id });
  }

  async addCopieurToCatalogue(id) {
    return this.request("addCopieurToCatalogue", { id });
  }
  /**
   * Duplication d'un copieur
   */
  async duplicateCopieur(copieurData) {
    const duplicatedData = {
      ...copieurData,
      Copieur: {
        ...copieurData.Copieur,
        nom_copieur: `${copieurData.Copieur.nom_copieur} (Copie)`,
        titre_copieur: `${copieurData.Copieur.titre_copieur} (Copie)`,
      },
    };
    delete duplicatedData.id;
    return this.createCopieur(duplicatedData);
  }

  /**
   * Export d'un copieur au format JSON
   */
  exportCopieur(copieur) {
    const exportData = {
      Copieur: copieur.Copieur,
      exported_at: new Date().toISOString(),
      version: "1.0",
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Suppression d'une option
   */
  async deleteOption(idOption) {
    if (typeof idOption === "string" && idOption.startsWith("temp_")) {
      return { success: true, message: "Option temporaire ignorée." };
    }
    return this.request("deleteOption", { idOption });
  }

  /**
   * Suppression d'un produit
   */
  async deleteProduct(idProduct) {
    if (typeof idProduct === "string" && idProduct.startsWith("temp_")) {
      return { success: true, message: "Produit temporaire ignoré." };
    }
    return this.request("deleteProduct", { idProductCopieur: idProduct });
  }

  /**
   * Suppression d'une règle
   */
  async deleteRule(idRule) {
    if (typeof idRule === "string" && idRule.startsWith("temp_")) {
      return { success: true, message: "Règle temporaire ignorée." };
    }
    return this.request("deleteRule", { idRule });
  }

  /**
   * Import d'un copieur depuis JSON
   */
  async importCopieur(jsonData) {
    const data = JSON.parse(jsonData);
    if (!data.Copieur) {
      throw new Error('Format JSON invalide: propriété "Copieur" manquante');
    }
    return this.createCopieur(data);
  }

  /**
   * Test de connexion à l'API
   */
  async testConnection() {
    return this.request("testConnection");
  }
}

// Export d'une instance singleton
export default new ApiService();

// Fonction utilitaire pour afficher des messages utilisateur
export function showUserMessage({ type = "info", message = "" }) {
  document.querySelectorAll(".feedback-container").forEach((el) => el.remove());

  const feedbackContainer = document.createElement("div");
  feedbackContainer.className = `feedback-container ${type}`;

  const feedbackMessage = document.createElement("div");
  feedbackMessage.className = `feedback-message ${type}`;
  feedbackMessage.textContent = message;

  feedbackContainer.appendChild(feedbackMessage);
  document.body.appendChild(feedbackContainer);

  setTimeout(() => {
    feedbackContainer.remove();
  }, 4000);
}
