"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Image,
  ActionIcon,
  Select,
  Text,
  Badge,
  Group,
  Loader,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconTrash, IconGripVertical, IconUpload, IconPhoto } from "@tabler/icons-react";
import { adminApi } from "@/lib/api-client";
import { notifications } from "@mantine/notifications";

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  variantId: string | null;
}

// ============================================
// Sortable Image Thumbnail
// ============================================
interface SortableImageProps {
  image: ImageItem;
  variants: { id: string; label: string }[];
  onRemove: (id: string) => void;
  onVariantChange: (id: string, variantId: string | null) => void;
}

function SortableImage({
  image,
  variants,
  onRemove,
  onVariantChange,
}: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  const variantLabel = image.variantId
    ? variants.find((v) => v.id === image.variantId)?.label
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-md border-2 border-gray-200 bg-white p-2 shadow-sm"
    >
      <div className="mb-1 flex items-center justify-between">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <IconGripVertical size={16} className="text-gray-400" />
        </div>
        <ActionIcon
          size="xs"
          color="red"
          variant="subtle"
          onClick={() => onRemove(image.id)}
        >
          <IconTrash size={12} />
        </ActionIcon>
      </div>

      <Image
        src={image.url}
        w="100%"
        h={100}
        radius="sm"
        fit="cover"
        fallbackSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3C/svg%3E"
      />

      {variantLabel && (
        <Badge size="xs" mt={4} variant="light" color="blue" fullWidth>
          {variantLabel}
        </Badge>
      )}

      {variants.length > 0 && (
        <Select
          size="xs"
          mt={4}
          placeholder="General"
          clearable
          data={variants.map((v) => ({ value: v.id, label: v.label }))}
          value={image.variantId}
          onChange={(v) => onVariantChange(image.id, v)}
        />
      )}
    </div>
  );
}

// ============================================
// Main Component
// ============================================
interface SortableImageGridProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  variants?: { id: string; name: string; type: string; value: string }[];
  folder?: string;
}

export default function SortableImageGrid({
  images,
  onChange,
  variants = [],
  folder = "products",
}: SortableImageGridProps) {
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const variantOptions = variants
    .filter((v) => v.type === "color")
    .map((v) => ({
      id: v.id,
      value: v.id,
      label: `${v.name}: ${v.value}`,
    }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);
    onChange(arrayMove(images, oldIndex, newIndex));
  };

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      setUploading(true);

      try {
        const uploaded = await Promise.all(
          files.map((file) => adminApi.uploadFile(file, folder)),
        );

        const newImages: ImageItem[] = uploaded.map((result, i) => ({
          id: `new-${Date.now()}-${i}`,
          url: result.url,
          alt: "",
          variantId: null,
        }));

        onChange([...images, ...newImages]);

        notifications.show({
          title: "Subidas",
          message: `${files.length} imagen${files.length > 1 ? "es" : ""} subida${files.length > 1 ? "s" : ""} (convertida${files.length > 1 ? "s" : ""} a AVIF)`,
          color: "green",
        });
      } catch {
        notifications.show({
          title: "Error",
          message: "Error al subir imágenes",
          color: "red",
        });
      } finally {
        setUploading(false);
      }
    },
    [images, onChange, folder],
  );

  const handleRemove = (id: string) => {
    onChange(images.filter((i) => i.id !== id));
  };

  const handleVariantChange = (id: string, variantId: string | null) => {
    onChange(
      images.map((i) => (i.id === id ? { ...i, variantId } : i)),
    );
  };

  return (
    <div>
      <Text fw={500} size="sm" mb="xs">
        Imágenes ({images.length})
      </Text>

      {/* Drop Zone */}
      <Dropzone
        onDrop={handleUpload}
        accept={IMAGE_MIME_TYPE}
        maxSize={10 * 1024 * 1024}
        loading={uploading}
        mb="md"
        styles={{
          root: {
            borderColor: "#C41E3A40",
            "&:hover": { borderColor: "#C41E3A" },
          },
        }}
      >
        <Group justify="center" gap="xl" py="md" style={{ pointerEvents: "none" }}>
          <Dropzone.Accept>
            <IconUpload size={40} className="text-[#C41E3A]" stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconPhoto size={40} className="text-red-500" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            {uploading ? (
              <Loader size="sm" color="#C41E3A" />
            ) : (
              <IconPhoto size={40} className="text-gray-400" stroke={1.5} />
            )}
          </Dropzone.Idle>

          <div>
            <Text size="sm" fw={500} inline>
              Arrastrá imágenes acá o hacé click para seleccionar
            </Text>
            <Text size="xs" c="dimmed" inline mt={4}>
              JPG, PNG, WebP, GIF — máx 10MB — se convierten a AVIF
            </Text>
          </div>
        </Group>
      </Dropzone>

      {/* Sortable Grid */}
      {images.length > 0 && (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((i) => i.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    variants={variantOptions}
                    onRemove={handleRemove}
                    onVariantChange={handleVariantChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Text size="xs" c="dimmed" mt="xs">
            Arrastrá para reordenar. La primera imagen es la principal.
            {variantOptions.length > 0 &&
              " Podés asignar imágenes a variantes de color."}
          </Text>
        </>
      )}
    </div>
  );
}
