// Normalizar API_URL para evitar doble slash
const normalizeUrl = (url) => {
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const API_URL = normalizeUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

// Servicio para manejar todas las peticiones al backend
export const apiService = {
    // ============================================
    // VENTAS
    // ============================================

    async createSale(saleData) {
        try {
            const response = await fetch(`${API_URL}/api/ventas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al procesar venta');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getDailySales(date) {
        try {
            const response = await fetch(`${API_URL}/api/ventas/daily?date=${date}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al obtener ventas diarias');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // USUARIOS
    // ============================================

    async getUsers() {
        try {
            const response = await fetch(`${API_URL}/api/usuarios`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Error al obtener usuarios');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createUser(userData) {
        try {
            const response = await fetch(`${API_URL}/api/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateUser(id, userData) {
        try {
            const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteUser(id) {
        try {
            const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar usuario');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // PRODUCTOS
    // ============================================

    // Obtener todos los PCs
    async getPCs(page = 1, limit = 12, all = false) {
        try {
            const url = all 
                ? `${API_URL}/api/pcs?all=true`
                : `${API_URL}/api/pcs?page=${page}&limit=${limit}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error al obtener PCs');
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

    // ============================================
    // BÚSQUEDA Y FILTROS
    // ============================================

    // Buscar productos
    async searchPCs(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.q) queryParams.append('q', params.q);
            if (params.category) queryParams.append('category', params.category);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice);
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
            if (params.inStock) queryParams.append('inStock', params.inStock);
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);

            const response = await fetch(`${API_URL}/api/pcs/search?${queryParams}`);
            if (!response.ok) throw new Error('Error al buscar productos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener categorías
    async getCategories() {
        try {
            const response = await fetch(`${API_URL}/api/pcs/categories`);
            if (!response.ok) throw new Error('Error al obtener categorías');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener productos relacionados
    async getRelatedProducts(id, limit = 4) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/${id}/related?limit=${limit}`);
            if (!response.ok) throw new Error('Error al obtener productos relacionados');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener productos destacados
    async getFeaturedProducts() {
        try {
            const response = await fetch(`${API_URL}/api/pcs/featured`);
            if (!response.ok) throw new Error('Error al obtener productos destacados');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // UPLOAD DE ARCHIVOS
    // ============================================

    // Upload de imagen
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/upload/image`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al subir imagen');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Upload de video
    async uploadVideo(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/api/upload/video`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al subir video');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // AUTENTICACIÓN
    // ============================================

    // Login
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) throw new Error('Error al iniciar sesión');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Logout
    async logout() {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Error al cerrar sesión');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Verificar sesión
    async verifySession(token) {
        try {
            const response = await fetch(`${API_URL}/api/auth/session`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Sesión inválida');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // GESTIÓN DE POSICIONES
    // ============================================

    // Actualizar posiciones masivamente
    async updatePositions(positions) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/positions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ positions }),
            });

            if (!response.ok) throw new Error('Error al actualizar posiciones');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // CONTACTO
    // ============================================

    // Enviar mensaje de contacto
    async sendContact(contactData) {
        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) throw new Error('Error al enviar mensaje');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    // Obtener productos con bajo stock
    async getLowStockProducts(threshold = 5) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/low-stock?threshold=${threshold}`);
            if (!response.ok) throw new Error('Error al obtener productos con bajo stock');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener productos más vendidos
    async getTopSellingProducts(limit = 10) {
        try {
            const response = await fetch(`${API_URL}/api/pcs/top-selling?limit=${limit}`);
            if (!response.ok) throw new Error('Error al obtener productos más vendidos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // DESCUENTOS POR PRODUCTO
    // ============================================

    async getDescuentosProductos() {
        try {
            const response = await fetch(`${API_URL}/api/descuentos-productos`);
            if (!response.ok) throw new Error('Error al obtener descuentos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createDescuentoProducto(descuentoData) {
        try {
            const response = await fetch(`${API_URL}/api/descuentos-productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(descuentoData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear descuento');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateDescuentoProducto(id, descuentoData) {
        try {
            const response = await fetch(`${API_URL}/api/descuentos-productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(descuentoData),
            });
            if (!response.ok) throw new Error('Error al actualizar descuento');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteDescuentoProducto(id) {
        try {
            const response = await fetch(`${API_URL}/api/descuentos-productos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar descuento');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // PACKS
    // ============================================

    async getPacks() {
        try {
            const response = await fetch(`${API_URL}/api/packs`);
            if (!response.ok) throw new Error('Error al obtener packs');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createPack(packData) {
        try {
            const response = await fetch(`${API_URL}/api/packs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear pack');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updatePack(id, packData) {
        try {
            const response = await fetch(`${API_URL}/api/packs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packData),
            });
            if (!response.ok) throw new Error('Error al actualizar pack');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deletePack(id) {
        try {
            const response = await fetch(`${API_URL}/api/packs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar pack');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // CUPONES
    // ============================================

    async getCupones() {
        try {
            const response = await fetch(`${API_URL}/api/cupones`);
            if (!response.ok) throw new Error('Error al obtener cupones');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async createCupon(cuponData) {
        try {
            const response = await fetch(`${API_URL}/api/cupones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuponData),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al crear cupón');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async updateCupon(id, cuponData) {
        try {
            const response = await fetch(`${API_URL}/api/cupones/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuponData),
            });
            if (!response.ok) throw new Error('Error al actualizar cupón');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async deleteCupon(id) {
        try {
            const response = await fetch(`${API_URL}/api/cupones/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Error al eliminar cupón');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async validarCupon(codigo) {
        try {
            const response = await fetch(`${API_URL}/api/cupones/validar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al validar cupón');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // ESTADÍSTICAS
    // ============================================

    async getEstadisticasCupones() {
        try {
            const response = await fetch(`${API_URL}/api/estadisticas/cupones`);
            if (!response.ok) throw new Error('Error al obtener estadísticas de cupones');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getEstadisticasPacks() {
        try {
            const response = await fetch(`${API_URL}/api/estadisticas/packs`);
            if (!response.ok) throw new Error('Error al obtener estadísticas de packs');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async getEstadisticasDescuentos() {
        try {
            const response = await fetch(`${API_URL}/api/estadisticas/descuentos`);
            if (!response.ok) throw new Error('Error al obtener estadísticas de descuentos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // ============================================
    // UTILIDADES
    // ============================================

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
};