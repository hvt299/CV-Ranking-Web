'use client';

import { X, FileText, Download } from 'lucide-react';

interface DocumentViewerProps {
    url: string;
    filename?: string;
    onClose: () => void;
}

export default function DocumentViewer({ url, filename = 'Tài liệu', onClose }: DocumentViewerProps) {
    const viewerUrl =
        `https://docs.google.com/gview?url=${encodeURIComponent(
            `${url}?t=${Date.now()}`
        )}&embedded=true`;

    return (
        <div className="fixed inset-0 z-100 flex flex-col bg-slate-900/90 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{filename}</h3>
                        <p className="text-xs text-slate-400">Xem trước trực tiếp</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
                        title="Mở file gốc / Tải về"
                    >
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Tải về</span>
                    </a>
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-700 hover:bg-rose-500 text-slate-300 hover:text-white rounded-xl transition-colors"
                        title="Đóng"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* iFrame Container */}
            <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative">
                {/* Loading state mờ ảo ở dưới */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
                <iframe
                    src={viewerUrl}
                    className="w-full h-full border-none relative z-10 bg-white"
                    title="Document Preview"
                />
            </div>
        </div>
    );
}