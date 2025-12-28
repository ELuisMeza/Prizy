export interface TypeProduct {
  name: string;
  category: {
    es: string;
    en: string;
  };
  subcategory: {
    es: string;
    en: string;
  };
  store: string;
  price_history: {
    month: string;
    price: number;
  }[];
}

export interface Category {
  id: string;
  name: {
    es: string;
    en: string;
  };
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: {
    es: string;
    en: string;
  };
}