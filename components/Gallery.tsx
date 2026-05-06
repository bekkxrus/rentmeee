"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import type { CarImage } from "@/lib/types";

type GalleryProps = {
  images: CarImage[];
  carName: string;
};

export function Gallery({ images, carName }: GalleryProps) {
  const orderedImages = useMemo(
    () => [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary)),
    [images],
  );
  const [selectedImage, setSelectedImage] = useState(orderedImages[0]);

  if (!orderedImages.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-neutral-100 text-sm font-semibold text-neutral-500">
        Images coming soon
      </div>
    );
  }

  const activeImage = selectedImage ?? orderedImages[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-soft">
        <Image
          src={activeImage.image_url}
          alt={carName}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
        />
      </div>
      {orderedImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {orderedImages.map((image, index) => (
            <button
              type="button"
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                activeImage.id === image.id
                  ? "border-yellow-400"
                  : "border-transparent hover:border-neutral-300"
              }`}
              aria-label={`View ${carName} image ${index + 1}`}
            >
              <Image
                src={image.image_url}
                alt={`${carName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
