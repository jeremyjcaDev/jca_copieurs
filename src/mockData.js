export const mockCopieurData = {
  id: 26,
  Copieur: {
    nom_copieur: "test Copieur 2",
    titre_copieur: "test Copieur 2",
    description: "",
    active: 1,
    options: [
      {
        id: 10,
        ordre: 1,
        nom_option: "Copieur",
        titre_option: "azeazda",
        affiche_aucun_produit: 0,
        choix_multiple: 0,
        exclusion_si_affich_est_1: [],
        obligation_si_affich_est_1: [],
        id_produit_selectionne: {
          "19": [0]
        }
      },
      {
        id: 11,
        ordre: 2,
        nom_option: "Consom",
        titre_option: "cons",
        affiche_aucun_produit: 1,
        choix_multiple: 0,
        exclusion_si_affich_est_1: [],
        obligation_si_affich_est_1: [],
        id_produit_selectionne: {
          "17": [35],
          "18": [36, 37]
        }
      },
      {
        id: 12,
        ordre: 3,
        nom_option: "zaeaez",
        titre_option: "azeaze",
        affiche_aucun_produit: 0,
        choix_multiple: 0,
        exclusion_si_affich_est_1: [],
        obligation_si_affich_est_1: [],
        id_produit_selectionne: {
          "18": [36]
        }
      }
    ],
    produits: [
      {
        id_product_copieur: 21,
        id_product_prestashop: 19,
        id_product_attribute_prestashop: 0,
        ordre: 1,
        dans_quel_option: "Copieur",
        id_copieur_option: 10,
        name: "Mug personnalisable",
        reference: "demo_14",
        variation_price: 0,
        achat_obligatoire: 0,
        case_choix_qte: 0,
        qte_min: 1,
        qte_max: 1,
        accessoire_exclu: [],
        accessoire_obligatoire: [],
        price: 16.68,
        image_url: "http://localhost:8080/img/p/2/4/24-home_default.jpg"
      },
      {
        id_product_copieur: 22,
        id_product_prestashop: 18,
        id_product_attribute_prestashop: 36,
        ordre: 1,
        dans_quel_option: "Consom",
        id_copieur_option: 11,
        name: "Carnet de notes Colibri - Type de papier: Ligné",
        reference: "demo_10",
        variation_price: 0,
        achat_obligatoire: 0,
        case_choix_qte: 0,
        qte_min: 1,
        qte_max: 1,
        accessoire_exclu: [],
        accessoire_obligatoire: [],
        price: 15.48,
        image_url: "http://localhost:8080/img/p/2/5/25-home_default.jpg"
      },
      {
        id_product_copieur: 23,
        id_product_prestashop: 18,
        id_product_attribute_prestashop: 37,
        ordre: 2,
        dans_quel_option: "Consom",
        id_copieur_option: 11,
        name: "Carnet de notes Colibri - Type de papier: Vierge",
        reference: "demo_10",
        variation_price: 0,
        achat_obligatoire: 0,
        case_choix_qte: 0,
        qte_min: 1,
        qte_max: 1,
        accessoire_exclu: [],
        accessoire_obligatoire: [],
        price: 15.48,
        image_url: "http://localhost:8080/img/p/2/5/25-home_default.jpg"
      },
      {
        id_product_copieur: 24,
        id_product_prestashop: 17,
        id_product_attribute_prestashop: 35,
        ordre: 3,
        dans_quel_option: "Consom",
        id_copieur_option: 11,
        name: "Carnet de notes Ours brun - Type de papier: Pointillés",
        reference: "demo_9",
        variation_price: 0,
        achat_obligatoire: 0,
        case_choix_qte: 0,
        qte_min: 1,
        qte_max: 1,
        accessoire_exclu: [],
        accessoire_obligatoire: [],
        price: 15.48,
        image_url: "http://localhost:8080/img/p/2/7/27-home_default.jpg"
      },
      {
        id_product_copieur: 25,
        id_product_prestashop: 18,
        id_product_attribute_prestashop: 36,
        ordre: 1,
        dans_quel_option: "zaeaez",
        id_copieur_option: 12,
        name: "Carnet de notes Colibri - Type de papier: Ligné",
        reference: "demo_10",
        variation_price: 0,
        achat_obligatoire: 0,
        case_choix_qte: 0,
        qte_min: 1,
        qte_max: 1,
        accessoire_exclu: [],
        accessoire_obligatoire: [],
        price: 15.48,
        image_url: "http://localhost:8080/img/p/2/5/25-home_default.jpg"
      }
    ],
    rules: [
      {
        id: 2,
        copieur_id: 26,
        rule_type: "product_exclusion",
        source_type: "product",
        source_id: 21,
        target_type: "product",
        target_id: 21,
        condition_type: "simple",
        condition_operator: "=",
        condition_value: 0,
        action_type: "exclude",
        message: "zeae",
        priority: 0,
        active: true,
        created_at: "2025-11-08 13:16:18",
        updated_at: "2025-11-09 14:07:08"
      },
      {
        id: 3,
        copieur_id: 26,
        rule_type: "no_product_exclusion",
        source_type: "option",
        source_id: 11,
        target_type: "product",
        target_id: 25,
        condition_type: "simple",
        condition_operator: "=",
        condition_value: 0,
        action_type: "exclude",
        message: "test",
        priority: 0,
        active: true,
        created_at: "2025-11-14 11:01:31",
        updated_at: "2025-11-14 10:53:22"
      }
    ],
    configurations: [
      {
        id: 69,
        nom: "Configuration 1",
        alt: "Configuration à mapper",
        url: null,
        products: [
          {
            id: 191,
            id_product_prestashop: 19,
            id_product_copieur: 21,
            id_product_attribute_prestashop: 0,
            quantity: 1
          },
          {
            id: 192,
            id_product_prestashop: 18,
            id_product_copieur: 22,
            id_product_attribute_prestashop: 36,
            quantity: 1
          }
        ],
        is_default: true
      },
      {
        id: 70,
        nom: "Configuration 3",
        alt: "Configuration à mapper",
        url: null,
        products: [
          {
            id: 193,
            id_product_prestashop: 19,
            id_product_copieur: 21,
            id_product_attribute_prestashop: 0,
            quantity: 1
          },
          {
            id: 194,
            id_product_prestashop: 18,
            id_product_copieur: 23,
            id_product_attribute_prestashop: 37,
            quantity: 1
          }
        ],
        is_default: false
      },
      {
        id: 71,
        nom: "Configuration 3",
        alt: "Configuration à mapper",
        url: null,
        products: [
          {
            id: 195,
            id_product_prestashop: 19,
            id_product_copieur: 21,
            id_product_attribute_prestashop: 0,
            quantity: 1
          },
          {
            id: 196,
            id_product_prestashop: 17,
            id_product_copieur: 24,
            id_product_attribute_prestashop: 35,
            quantity: 1
          }
        ],
        is_default: false
      }
    ],
    remise_copieur: {
      type: "",
      valeur: 0,
      description: ""
    },
    remise_globale: {
      type: "",
      valeur: 0,
      description: ""
    },
    prix_groupes_clients: [],
    product_relations: [
      {
        id: 3,
        id_copieur: 26,
        id_product: 24
      }
    ]
  },
  created_at: "2025-10-29 02:28:19",
  updated_at: "2025-11-09 17:23:50",
  rentalInfo: {
    rentalEnabled: true,
    duration36Enabled: true,
    duration60Enabled: true,
    rentalConfiguration: [
      {
        id: 1,
        priceMin: 0.01,
        priceMax: 2,
        duration36Months: 1,
        duration60Months: 5,
        sortOrder: 0,
        dateAdd: "2025-11-24 01:04:13",
        dateUpd: "2025-11-24 01:04:13"
      },
      {
        id: 4,
        priceMin: 0,
        priceMax: 0,
        duration36Months: 0,
        duration60Months: 45,
        sortOrder: 3,
        dateAdd: "2025-12-10 23:42:30",
        dateUpd: "2025-12-10 23:59:09"
      },
      {
        id: 5,
        priceMin: 0,
        priceMax: 0,
        duration36Months: 0,
        duration60Months: 0,
        sortOrder: 3,
        dateAdd: "2025-12-10 23:42:30",
        dateUpd: "2025-12-10 23:42:30"
      },
      {
        id: 6,
        priceMin: 5,
        priceMax: 100,
        duration36Months: 2,
        duration60Months: 15,
        sortOrder: 5,
        dateAdd: "2025-12-10 23:59:39",
        dateUpd: "2025-12-11 01:58:09"
      }
    ]
  }
};
