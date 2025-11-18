import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  // Obtener producto del backend
  try {
    const response = await fetch(`${API_URL}/api/pcs/${id}`, {
      next: { revalidate: 60 } // Cache por 60 segundos
    });
    
    if (!response.ok) {
      return {
        title: 'Producto no encontrado',
      }
    }
    
    const product = await response.json();

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));
    } else {
      numPrice = price;
    }
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(numPrice);
  };

  const imagenes = (product as any).IMAGENES || {};
  const images = imagenes.images || [];
  const mainIndex = imagenes.mainImageIndex || 0;
  const mainImage = images[mainIndex] || images[0] || '/images/placeholder-product.jpg';

  const title = `${product.NOMBRE} - ${formatPrice(product.PRECIO)}`
  const description = product.DETALLE || `Compra ${product.NOMBRE} en PCSystem Hualpén. ${((product as any).STOCK || 0) > 0 ? '✓ En stock' : 'Consultar disponibilidad'}.`

  return {
    title,
    description,
    keywords: [
      product.NOMBRE,
      product.CATEGORIA,
      product.SUBCATEGORIA,
      'PCSystem',
      'Hualpén',
      'comprar',
      'tienda tecnología'
    ].filter(Boolean),
    openGraph: {
      title,
      description,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: product.NOMBRE,
        }
      ],
      type: 'website',
      locale: 'es_CL',
      siteName: 'PCSystem',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [mainImage],
    },
    alternates: {
      canonical: `https://pcsystem.cl/productos/${id}`,
    },
  }
  } catch (error) {
    console.error('Error fetching product metadata:', error);
    return {
      title: 'Producto no encontrado',
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
