export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  longDescription: string;
  stock: boolean;
  stockQuantity: number;
  features: string[];
  specifications: { [key: string]: string };
  rating: number;
  reviews: number;
  tags: string[];
}

export const products: Product[] = [
  // Componentes PC
  {
    id: 1,
    name: "Procesador Intel Core i5-12400F",
    category: "components",
    price: 120000,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80"
    ],
    description: "Procesador de 6 núcleos y 12 hilos, ideal para gaming y productividad",
    longDescription: "El Intel Core i5-12400F ofrece un rendimiento excepcional para gaming y multitarea. Con arquitectura híbrida de 12va generación, este procesador combina potencia y eficiencia energética, perfecto para jugadores y creadores de contenido.",
    stock: true,
    stockQuantity: 15,
    features: [
      "6 núcleos de rendimiento",
      "12 hilos de procesamiento",
      "Frecuencia base de 2.5 GHz",
      "Turbo Boost hasta 4.4 GHz",
      "Compatible con DDR4 y DDR5",
      "Socket LGA1700"
    ],
    specifications: {
      "Núcleos": "6",
      "Hilos": "12",
      "Frecuencia Base": "2.5 GHz",
      "Frecuencia Turbo": "4.4 GHz",
      "Cache": "18 MB Intel Smart Cache",
      "TDP": "65W",
      "Socket": "LGA1700",
      "Gráficos": "No incluidos (F series)"
    },
    rating: 4.8,
    reviews: 234,
    tags: ["Intel", "Gaming", "Productividad", "12th Gen"]
  },
  {
    id: 2,
    name: "Tarjeta Gráfica RTX 3060 12GB",
    category: "components",
    price: 350000,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&q=80",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80"
    ],
    description: "GPU para gaming en 1080p/1440p con Ray Tracing",
    longDescription: "La NVIDIA GeForce RTX 3060 con 12GB de VRAM GDDR6 es perfecta para gaming en alta resolución. Equipada con tecnología Ray Tracing y DLSS, ofrece gráficos realistas y rendimiento superior en los títulos más exigentes.",
    stock: true,
    stockQuantity: 8,
    features: [
      "12GB GDDR6 de memoria",
      "Ray Tracing de 2da generación",
      "DLSS 2.0 para mayor rendimiento",
      "NVIDIA Reflex para baja latencia",
      "Compatible con DirectX 12 Ultimate",
      "Salidas DisplayPort y HDMI"
    ],
    specifications: {
      "Memoria": "12GB GDDR6",
      "CUDA Cores": "3584",
      "Boost Clock": "1777 MHz",
      "Ancho de Banda": "360 GB/s",
      "Bus de Memoria": "192-bit",
      "TDP": "170W",
      "Conectores": "1x 8-pin",
      "Salidas": "3x DisplayPort 1.4a, 1x HDMI 2.1"
    },
    rating: 4.7,
    reviews: 189,
    tags: ["NVIDIA", "RTX", "Ray Tracing", "Gaming"]
  },
  {
    id: 3,
    name: "Memoria RAM DDR4 16GB 3200MHz",
    category: "components",
    price: 45000,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=500&q=80",
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&q=80"
    ],
    description: "Kit 2x8GB para rendimiento óptimo",
    longDescription: "Kit de memoria RAM de alto rendimiento ideal para gaming y aplicaciones exigentes. Configuración dual channel para máximo ancho de banda.",
    stock: true,
    stockQuantity: 25,
    features: [
      "Kit de 2x8GB (16GB total)",
      "Velocidad 3200MHz",
      "CL16 baja latencia",
      "Disipador de aluminio",
      "Compatible con Intel y AMD",
      "Perfil XMP 2.0"
    ],
    specifications: {
      "Capacidad": "16GB (2x8GB)",
      "Tipo": "DDR4",
      "Velocidad": "3200MHz",
      "Latencia": "CL16",
      "Voltaje": "1.35V",
      "Formato": "DIMM 288-pin"
    },
    rating: 4.6,
    reviews: 312,
    tags: ["RAM", "DDR4", "Gaming", "Dual Channel"]
  },
  {
    id: 5,
    name: "Monitor Gaming 24\" 144Hz",
    category: "peripherals",
    price: 180000,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
      "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500&q=80"
    ],
    description: "Panel IPS, 1ms de respuesta, FreeSync",
    longDescription: "Monitor gaming profesional con panel IPS de 24 pulgadas y tasa de refresco de 144Hz. Ideal para gaming competitivo con tiempo de respuesta de 1ms y tecnología FreeSync.",
    stock: true,
    stockQuantity: 12,
    features: [
      "Panel IPS de 24 pulgadas",
      "144Hz de tasa de refresco",
      "1ms de tiempo de respuesta",
      "AMD FreeSync Premium",
      "Full HD 1920x1080",
      "Ajuste de altura y rotación"
    ],
    specifications: {
      "Tamaño": "24 pulgadas",
      "Resolución": "1920x1080 (Full HD)",
      "Panel": "IPS",
      "Tasa de Refresco": "144Hz",
      "Tiempo de Respuesta": "1ms MPRT",
      "Brillo": "350 cd/m²",
      "Contraste": "1000:1",
      "Conectividad": "HDMI 2.0, DisplayPort 1.2"
    },
    rating: 4.9,
    reviews: 156,
    tags: ["Monitor", "144Hz", "Gaming", "IPS"]
  },
  {
    id: 6,
    name: "Teclado Mecánico RGB",
    category: "peripherals",
    price: 65000,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80"
    ],
    description: "Switch Blue, retroiluminación RGB personalizable",
    longDescription: "Teclado mecánico gaming con switches Blue clicky para una experiencia de escritura táctil. Retroiluminación RGB completamente personalizable y construcción premium.",
    stock: true,
    stockQuantity: 20,
    features: [
      "Switches mecánicos Blue",
      "RGB por tecla personalizable",
      "Frame de aluminio",
      "Anti-ghosting completo",
      "Cable trenzado extraíble",
      "Reposamuñecas magnético"
    ],
    specifications: {
      "Tipo": "Mecánico",
      "Switches": "Blue (Clicky)",
      "Retroiluminación": "RGB por tecla",
      "Conectividad": "USB-C",
      "N-Key Rollover": "Sí",
      "Formato": "TKL (Tenkeyless)"
    },
    rating: 4.7,
    reviews: 203,
    tags: ["Teclado", "Mecánico", "RGB", "Gaming"]
  },
  {
    id: 9,
    name: "Control PlayStation 5 DualSense",
    category: "gaming",
    price: 65000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80"
    ],
    description: "Control inalámbrico con retroalimentación háptica",
    longDescription: "El revolucionario control DualSense de PlayStation 5 ofrece una experiencia de juego inmersiva con retroalimentación háptica avanzada y gatillos adaptativos.",
    stock: true,
    stockQuantity: 30,
    features: [
      "Retroalimentación háptica",
      "Gatillos adaptativos",
      "Micrófono integrado",
      "Batería recargable",
      "Compatible con PC",
      "Conector USB-C"
    ],
    specifications: {
      "Conectividad": "Bluetooth 5.1, USB-C",
      "Batería": "1560 mAh",
      "Autonomía": "12-15 horas",
      "Peso": "280g",
      "Compatibilidad": "PS5, PC",
      "Audio": "Conector jack 3.5mm"
    },
    rating: 4.9,
    reviews: 412,
    tags: ["PlayStation", "DualSense", "Gaming", "Wireless"]
  },
  {
    id: 21,
    name: "Cámara IP WiFi Full HD",
    category: "security",
    price: 45000,
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=500&q=80",
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=500&q=80"
    ],
    description: "Visión nocturna, detección de movimiento",
    longDescription: "Cámara de seguridad IP WiFi con resolución Full HD, visión nocturna infrarroja y detección inteligente de movimiento. Acceso remoto desde tu smartphone.",
    stock: true,
    stockQuantity: 18,
    features: [
      "Resolución Full HD 1080p",
      "Visión nocturna hasta 10m",
      "Detección de movimiento IA",
      "Audio bidireccional",
      "Almacenamiento en nube",
      "App móvil gratuita"
    ],
    specifications: {
      "Resolución": "1920x1080 (Full HD)",
      "Visión Nocturna": "LED IR hasta 10m",
      "Conectividad": "WiFi 2.4GHz",
      "Almacenamiento": "MicroSD hasta 128GB",
      "Audio": "Bidireccional",
      "Alimentación": "12V DC"
    },
    rating: 4.5,
    reviews: 89,
    tags: ["Seguridad", "WiFi", "Cámara IP", "Smart Home"]
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (productId: number, category: string, limit: number = 4): Product[] => {
  return products
    .filter(p => p.id !== productId && p.category === category)
    .slice(0, limit);
};
