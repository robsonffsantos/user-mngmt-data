const API_URL = "http://127.0.0.1:5000/users";

export const fetchUsers = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar usuários");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Erro ao criar usuário");
    return await response.json();
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return null;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Erro ao atualizar usuário");
    return await response.json();
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return null;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erro ao excluir usuário");
    return await response.json();
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return null;
  }
};
