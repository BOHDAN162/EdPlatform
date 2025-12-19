import React, { useEffect, useMemo, useRef, useState } from "react";
import Modal from "./Modal";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const AVATAR_SIZE = 256;
const VIEWPORT = 280;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CropModal = ({ src, onApply, onClose }) => {
  const imgRef = useRef(null);
  const [zoom, setZoom] = useState(1.1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const image = new Image();
    image.onload = () => setImageSize({ width: image.width, height: image.height });
    image.src = src;
  }, [src]);

  const baseScale = useMemo(() => {
    if (!imageSize.width || !imageSize.height) return 1;
    return Math.max(VIEWPORT / imageSize.width, VIEWPORT / imageSize.height);
  }, [imageSize.height, imageSize.width]);

  const display = useMemo(() => {
    const scale = baseScale * zoom;
    return { width: imageSize.width * scale, height: imageSize.height * scale, scale };
  }, [baseScale, imageSize.height, imageSize.width, zoom]);

  useEffect(() => {
    const maxOffsetX = Math.max(0, (display.width - VIEWPORT) / 2);
    const maxOffsetY = Math.max(0, (display.height - VIEWPORT) / 2);
    setPosition((prev) => ({
      x: clamp(prev.x, -maxOffsetX, maxOffsetX),
      y: clamp(prev.y, -maxOffsetY, maxOffsetY),
    }));
  }, [display.height, display.width]);

  const startDrag = (e) => {
    e.preventDefault();
    const point = e.touches?.[0] || e;
    setDrag({ x: point.clientX, y: point.clientY });
  };

  const move = (e) => {
    if (!drag) return;
    const point = e.touches?.[0] || e;
    const deltaX = point.clientX - drag.x;
    const deltaY = point.clientY - drag.y;
    const maxOffsetX = Math.max(0, (display.width - VIEWPORT) / 2);
    const maxOffsetY = Math.max(0, (display.height - VIEWPORT) / 2);
    setPosition((prev) => ({
      x: clamp(prev.x + deltaX, -maxOffsetX, maxOffsetX),
      y: clamp(prev.y + deltaY, -maxOffsetY, maxOffsetY),
    }));
    setDrag({ x: point.clientX, y: point.clientY });
  };

  const stopDrag = () => setDrag(null);

  const handleSave = () => {
    const image = imgRef.current;
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const ctx = canvas.getContext("2d");
    const { width, height, scale } = display;
    const originX = VIEWPORT / 2 + position.x - width / 2;
    const originY = VIEWPORT / 2 + position.y - height / 2;
    const srcX = clamp(-originX / scale, 0, image.naturalWidth);
    const srcY = clamp(-originY / scale, 0, image.naturalHeight);
    const srcSize = VIEWPORT / scale;
    const croppedSize = Math.min(srcSize, image.naturalWidth - srcX, image.naturalHeight - srcY);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    ctx.drawImage(image, srcX, srcY, croppedSize, croppedSize, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
    onApply(canvas.toDataURL("image/png"));
  };

  return (
    <Modal
      title="Обрезка аватара"
      onClose={onClose}
      size="lg"
      actions={[
        <button key="cancel" className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20" onClick={onClose}>
          Отмена
        </button>,
        <button key="save" className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600" onClick={handleSave}>
          Сохранить
        </button>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <div
            className="relative h-[280px] w-[280px] overflow-hidden rounded-2xl border border-white/15 bg-slate-800"
            onPointerDown={startDrag}
            onPointerMove={move}
            onPointerUp={stopDrag}
            onPointerLeave={stopDrag}
            onTouchStart={startDrag}
            onTouchMove={move}
            onTouchEnd={stopDrag}
          >
            <div className="pointer-events-none absolute inset-0 border-2 border-white/30" />
            {src && (
              <img
                ref={imgRef}
                src={src}
                alt="Для обрезки"
                className="absolute select-none"
                draggable={false}
                style={{
                  width: `${display.width}px`,
                  height: `${display.height}px`,
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                  top: "50%",
                  left: "50%",
                }}
              />
            )}
          </div>
          <div className="flex w-full max-w-md items-center gap-3">
            <span className="text-xs text-white/60">Зум</span>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.02"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-indigo-400"
            />
            <span className="text-xs text-white/60">{zoom.toFixed(2)}x</span>
          </div>
          <p className="text-center text-xs text-white/60">Потяни изображение внутри рамки или увеличь масштаб для точной обрезки.</p>
        </div>
      </div>
    </Modal>
  );
};

const AvatarUploader = ({ value, onSave, onDelete, addToast, showPreview = true, actionLabel }) => {
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [pending, setPending] = useState("");
  const [cropSrc, setCropSrc] = useState("");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Поддерживаются только PNG, JPG или WEBP");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Размер файла до 5 МБ");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPending(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const openCrop = () => {
    if (pending) {
      setCropSrc(pending);
    } else if (preview) {
      setPending(preview);
      setCropSrc(preview);
    }
  };

  const applyCrop = (dataUrl) => {
    setPending(dataUrl);
    setCropSrc("");
  };

  const saveAvatar = () => {
    const finalAvatar = pending || preview;
    if (!finalAvatar) {
      setError("Сначала загрузи изображение");
      return;
    }
    onSave(finalAvatar);
    setPending("");
    addToast?.("Аватар обновлён");
  };

  const removeAvatar = () => {
    setPending("");
    setPreview("");
    onDelete();
    addToast?.("Аватар удалён");
  };

  const layoutClass = showPreview ? "md:flex-row md:items-center md:justify-between" : "";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className={`flex flex-col gap-4 ${layoutClass}`}>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-white">Аватар</p>
          <p className="text-sm text-white/60">Перетащи фото или выбери файл. Поддерживаются png, jpg, webp до 5 МБ.</p>
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <div
            className={`mt-3 flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-6 text-center text-sm transition ${
              isDragging ? "border-indigo-400 bg-indigo-500/10" : "border-white/15 bg-white/5"
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">⬆️</div>
              <p className="text-white">Перетащи фото сюда или выбери файл</p>
              <label className="cursor-pointer text-indigo-300 underline">
                <input type="file" className="sr-only" accept={ACCEPTED_TYPES.join(",")} onChange={(e) => handleFile(e.target.files?.[0])} />
                Выбрать файл
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openCrop}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-50"
              disabled={!pending && !preview}
            >
              Обрезать
            </button>
            <button
              type="button"
              onClick={saveAvatar}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-600"
              disabled={!pending && !preview}
            >
              {actionLabel || "Сохранить"}
            </button>
            <button
              type="button"
              onClick={removeAvatar}
              className="rounded-xl bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Удалить
            </button>
          </div>
        </div>
        {showPreview && (
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 overflow-hidden rounded-full border border-white/15 bg-slate-800">
              {pending || preview ? (
                <img src={pending || preview} alt="Предпросмотр аватара" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl text-white/50">🙂</div>
              )}
            </div>
            <p className="text-xs text-white/60">Предпросмотр 1:1</p>
          </div>
        )}
      </div>
      {cropSrc && <CropModal src={cropSrc} onApply={applyCrop} onClose={() => setCropSrc("")} />}
    </div>
  );
};

export default AvatarUploader;
