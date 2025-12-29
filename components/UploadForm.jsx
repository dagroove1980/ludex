'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Redirect to game page
      router.push(`/game/${data.gameId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div
        className={`group relative flex flex-col items-center justify-center w-full min-h-[240px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : 'border-gray-300 dark:border-[#473b54] bg-white dark:bg-[#1e1726] hover:bg-gray-50 dark:hover:bg-[#251d2f] hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          required
        />
        <div className="flex flex-col items-center text-center p-8 z-10">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-3xl text-primary">
              cloud_upload
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Upload Rulebook
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            Drag & drop your PDF here or browse your files. We'll automatically
            identify the game and parse the rules.
          </p>
          {file ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[20px]">
                description
              </span>
              <span className="text-sm font-medium text-primary">
                {file.name}
              </span>
            </div>
          ) : (
            <button
              type="button"
              className="h-10 px-6 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all"
            >
              Browse Files
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {file && (
        <button
          type="submit"
          disabled={uploading}
          className="w-full h-10 px-6 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:shadow-none"
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            'Upload & Process'
          )}
        </button>
      )}
    </form>
  );
}





