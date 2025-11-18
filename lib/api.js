const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Servicio para manejar todas las peticiones al backend
export const apiService = {
    // Obtener todos los PCs
    async getPCs() {
        try {
            const response = await fetch(`${API_URL}/api/pcs`);
            if (!response.ok) throw new Error('Error al obtener PCs');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Health check del backend
    async healthCheck() {
        try {
            const response = await fetch(`${API_URL}/api/health`);
            if (!response.ok) throw new Error('Error en health check');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Crear nuevo PC
    async createPC(pcData) {
        try {
            const response = await fetch(`${API_URL}/api/pcs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pcData),
            });
            if (!response.ok) throw new Error('Error al crear PC');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener PC por ID
    async getPCById(id) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/${id}`);
            if (!response.ok) throw new Error('Error al obtener PC');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Actualizar PC
    async updatePC(id, pcData) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pcData),
            });
            if (!response.ok) throw new Error('Error al actualizar PC');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Eliminar PC
    async deletePC(id) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar PC');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },
};