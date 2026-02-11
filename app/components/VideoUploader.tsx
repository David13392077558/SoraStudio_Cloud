"use client";

import React, { useState } from "react";
import { X, Upload, Loader } from "lucide-react";

type Props = {
  onVideoSelect: (file: File | null) => void;
  preview?: string;
  className?: string;
  isLoading?: boolean;
};

export function VideoUploader({
  onVideoSelect,
  preview,
  className = "",
  isLoading = false,
}: Props) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0] && files[0].type.startsWith("video/")) {
      onVideoSelect(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onVideoSelect(file);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
          dragOver
            ? "border-blue-400 bg-blue-50/10 scale-[1.01] shadow-lg"
            : "border-purple-300/40 hover:border-purple-400 bg-white/5 hover:bg-white/10"
        } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative group">
            <video
              src={preview}
              controls
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow"
            />
            {!isLoading && (
              <button
                type="button"
                className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 shadow-lg hover:scale-110 transition-all"
                onClick={() => onVideoSelect(null)}
                aria-label="Remove video"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              {isLoading ? (
                <Loader size={44} className="text-purple-300 animate-spin" />
              ) : (
                <Upload size={44} className="text-purple-200 transition-colors" />
              )}
            </div>
            <p className="text-base sm:text-lg font-semibold text-white/85 mb-2">
              {isLoading ? "上传中..." : "拖拽视频到此处"}
            </p>
            <p className="text-sm text-white/60 mb-6">或点击下方按钮选择文件</p>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="video-upload"
              disabled={isLoading}
            />
            {!isLoading && (
              <label
                htmlFor="video-upload"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg cursor-pointer hover:shadow-lg hover:shadow-purple-500/40 transition-all hover:scale-[1.02] font-medium"
              >
                选择文件
              </label>
            )}
          </>
        )}
      </div>
    </div>
  );
}

