const API_URL = "http://127.0.0.1:8000";

export const productAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/products/`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  },

  create: async (product) => {
    const response = await fetch(`${API_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    return response.json();
  },

  update: async (id, product) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }

    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete product");
    }

    return response.json();
  },
};