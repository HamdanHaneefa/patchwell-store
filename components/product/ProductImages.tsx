'use client';

import Image from 'next/image';
import { ShopifyImage } from '@/lib/shopify/types';

interface ProductImagesProps {
  images: ShopifyImage[];
  productTitle: string;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export default function ProductImages({
  images,
  productTitle,
  activeImageIndex,
  setActiveImageIndex,
}: ProductImagesProps) {
  return (
    <div className="product-detail__images">
      {images.length > 0 && images[activeImageIndex] ? (
        <Image
          src={images[activeImageIndex].url}
          alt={images[activeImageIndex].altText || productTitle}
          width={600}
          height={600}
          className="product-detail__main-image"
          priority
        />
      ) : (
        <div className="product-detail__main-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-2)' }}>
          <span>No Product Image</span>
        </div>
      )}

      {images.length > 1 && (
        <div className="product-detail__thumbnails">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img.url}
              alt={`${productTitle} Thumbnail ${idx + 1}`}
              width={80}
              height={80}
              className={`product-detail__thumb${activeImageIndex === idx ? ' active' : ''}`}
              onClick={() => setActiveImageIndex(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
