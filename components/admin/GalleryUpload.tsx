"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Trash2, CheckCircle2, AlertCircle, Image, Film, Loader2 } from "lucide-react";

interface MediaRow {
  id: string;
  url: string;
  type: "image" | "video";
  caption?: string | null;
  uploaded_at: string;
  storage_key?: string;
}

interface FileUploadState {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  result?: MediaRow;
  previewUrl: string;
}

interface GalleryUploadProps {
  initialMedia: MediaRow[];
  eventId: string;
}

export function GalleryUpload({ initialMedia, eventId }: GalleryUploadProps) {
  const router = useRouter();
  const [uploadedMedia, setUploadedMedia] = useState<MediaRow[]>(initialMedia);
  const [caption, setCaption] = useState("");
  const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Sync state whenever server re-renders initialMedia
  useEffect(() => {
    setUploadedMedia(initialMedia);
  }, [initialMedia]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      fileStates.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const newStates: FileUploadState[] = Array.from(files).map((file) => ({
      file,
      status: "pending",
      previewUrl: URL.createObjectURL(file),
    }));
    setFileStates((prev) => [...prev, ...newStates]);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so same files can be re-selected
      e.target.value = "";
    }
  };

  const removeFileState = (index: number) => {
    setFileStates((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadAll = async () => {
    const pendingIndexes = fileStates
      .map((f, i) => (f.status === "pending" ? i : -1))
      .filter((i) => i >= 0);

    if (pendingIndexes.length === 0) return;

    for (const idx of pendingIndexes) {
      // Set to uploading
      setFileStates((prev) =>
        prev.map((f, i) => (i === idx ? { ...f, status: "uploading" } : f))
      );

      const fileState = fileStates[idx];
      const fd = new FormData();
      fd.append("eventId", eventId);
      fd.append("file", fileState.file);
      if (caption.trim()) fd.append("caption", caption.trim());

      try {
        const res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setFileStates((prev) =>
            prev.map((f, i) =>
              i === idx ? { ...f, status: "done", result: data.item } : f
            )
          );
          setUploadedMedia((prev) => [data.item, ...prev]);
        } else {
          setFileStates((prev) =>
            prev.map((f, i) =>
              i === idx ? { ...f, status: "error", error: data.error || "Upload failed" } : f
            )
          );
        }
      } catch {
        setFileStates((prev) =>
          prev.map((f, i) =>
            i === idx ? { ...f, status: "error", error: "Network error" } : f
          )
        );
      }
    }

    setCaption("");
  };

  const handleDelete = async (item: MediaRow) => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/admin/gallery/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, storageKey: item.storage_key, url: item.url }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedMedia((prev) => prev.filter((m) => m.id !== item.id));
        setDeleteTarget(null);
        router.refresh();
      } else {
        setDeleteError(data.error || "Failed to delete. Please try again.");
      }
    } catch {
      setDeleteError("Network error while deleting. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const pendingCount = fileStates.filter((f) => f.status === "pending").length;
  const uploadingCount = fileStates.filter((f) => f.status === "uploading").length;
  const doneCount = fileStates.filter((f) => f.status === "done").length;
  const totalQueued = fileStates.length;

  return (
    <div className="space-y-6">

      {/* ── Drop Zone ── */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200
          ${isDragging
            ? "border-bcn-orange bg-bcn-orange/10 scale-[1.01]"
            : "border-white/20 hover:border-bcn-orange/50 hover:bg-white/[0.02]"
          }`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
          ${isDragging ? "bg-bcn-orange/20" : "bg-[#1F1F1F]"}`}>
          <Upload className={`w-7 h-7 transition-colors ${isDragging ? "text-bcn-orange" : "text-[#8C857B]"}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-[#DFD8CE]">
            {isDragging ? "Drop files here" : "Tap or drag to add photos & videos"}
          </p>
          <p className="text-xs text-[#5C564E] mt-1">Supports JPG, PNG, GIF, MP4, MOV, WEBM</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* ── File Queue ── */}
      {fileStates.length > 0 && (
        <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <p className="text-xs font-semibold text-[#8C857B] uppercase tracking-wider">
              Queue ({fileStates.length} file{fileStates.length !== 1 ? "s" : ""})
            </p>
            {uploadingCount > 0 && (
              <span className="text-xs text-bcn-orange flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading {doneCount + 1} of {totalQueued}…
              </span>
            )}
          </div>

          <ul className="divide-y divide-white/5">
            {fileStates.map((fs, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0E0E0E] flex-shrink-0 relative">
                  {fs.file.type.startsWith("video/") ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                      <Film className="w-5 h-5 text-[#5C564E]" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fs.previewUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#DFD8CE] truncate font-medium">{fs.file.name}</p>
                  <p className="text-[11px] text-[#5C564E] mt-0.5">
                    {(fs.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                  {fs.error && (
                    <p className="text-[11px] text-red-400 mt-0.5">{fs.error}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {fs.status === "uploading" && (
                    <Loader2 className="w-4 h-4 text-bcn-orange animate-spin" />
                  )}
                  {fs.status === "done" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {fs.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                  {fs.status === "pending" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFileState(i); }}
                      className="p-1 text-[#5C564E] hover:text-red-400 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Caption + Upload Button ── */}
      {fileStates.some((f) => f.status === "pending") && (
        <div className="space-y-3">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption for all files in this batch…"
            maxLength={200}
            className="w-full bg-[#161616] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F5F1E8]
                       placeholder-[#5C564E] focus:outline-none focus:border-bcn-orange/60 transition-colors"
          />
          <button
            onClick={uploadAll}
            disabled={uploadingCount > 0}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-black
                       bg-bcn-gradient hover:opacity-90 transition-opacity
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,132,0,0.25)]"
          >
            {uploadingCount > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading {doneCount + 1} of {totalQueued}…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload {pendingCount} File{pendingCount !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Uploaded Gallery ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[#8C857B] uppercase tracking-wider">
            Gallery ({uploadedMedia.length} item{uploadedMedia.length !== 1 ? "s" : ""})
          </p>
        </div>

        {uploadedMedia.length === 0 ? (
          <div className="bg-[#161616] border border-white/10 rounded-2xl py-10 text-center">
            <p className="text-xs text-[#5C564E]">No media uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uploadedMedia.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10 aspect-square"
              >
                {item.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                    <Film className="w-8 h-8 text-[#5C564E]" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.caption ?? ""}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Caption overlay */}
                {item.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-[10px] text-white line-clamp-2">{item.caption}</p>
                  </div>
                )}

                {/* Delete button */}
                <button
                  onClick={() => {
                    setDeleteError(null);
                    setDeleteTarget(item);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/70 text-[#8C857B] hover:text-[#FF5533] hover:bg-red-950/60
                             opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Type badge */}
                <div className="absolute top-2 left-2 w-6 h-6 rounded-md bg-black/60 flex items-center justify-center">
                  {item.type === "video"
                    ? <Film className="w-3 h-3 text-[#A39C90]" />
                    : <Image className="w-3 h-3 text-[#A39C90]" />
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#161616] border border-red-500/30 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete media item?</h3>
                <p className="text-xs text-[#8C857B]">This removes the file from storage permanently</p>
              </div>
            </div>

            {deleteTarget.caption && (
              <p className="text-xs text-[#A39C90] bg-black/30 rounded-xl px-3 py-2 border border-white/5">
                &ldquo;{deleteTarget.caption}&rdquo;
              </p>
            )}

            {deleteError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {deleteError}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-[#DFD8CE] bg-[#252525] hover:bg-[#303030] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…</>
                ) : (
                  <><Trash2 className="w-3.5 h-3.5" /> Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
