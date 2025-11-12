import { Metadata } from 'next'
import { getProductById } from '@/data/products'
import { notFound } from 'next/navigation'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(parseInt(params.id))
  
  if (!product) {
    return {
      title: 'Producto no encontrado',
    }
  }

  const title = `${product.name} - ${product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}`
  const description = product.longDescription || product.description || `Compra ${product.name} en PCSystem Hualpén. ${product.stock ? '✓ En stock' : 'Consultar disponibilidad'}.`

  return {
    title,
    description,
    keywords: [
      product.name,
      ...product.tags || [],
      product.category,
      'PCSystem',
      'Hualpén',
      'comprar',
      'tienda tecnología'
    ],
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
        ...(product.images?.map(img => ({
          url: img,
          width: 800,
          height: 600,
          alt: product.name,
        })) || [])
      ],
      type: 'website',
      locale: 'es_CL',
      siteName: 'PCSystem',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://pcsystem.cl/productos/${params.id}`,
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
