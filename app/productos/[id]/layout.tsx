import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  
  // Obtener producto de Supabase
  const { data: product, error } = await supabase
    .from('Productos')
    .select('*')
    .eq('id', parseInt(id))
    .single()
  
  if (error || !product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  const formatPrice = (price: number | string) => {
    let numPrice = 0;
    if (typeof price === 'string') {
      numPrice = parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.'));
    } else {
      numPrice = price;
    }
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(numPrice);
  };

  const title = `${product.NOMBRE} - ${formatPrice(product.PRECIO)}`
  const description = product.DETALLE || `Compra ${product.NOMBRE} en PCSystem Hualpén. ${product.stock ? '✓ En stock' : 'Consultar disponibilidad'}.`

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
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
