'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Underline, Heading, Link, List, Alignment, Indent, IndentBlock, RemoveFormat, PasteFromOffice, Autoformat, Undo, type EditorConfig } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const config: EditorConfig = {
        licenseKey: 'GPL',
        plugins: [Essentials, Paragraph, Heading, Bold, Italic, Underline, Link, List, Alignment, Indent, IndentBlock, RemoveFormat, PasteFromOffice, Autoformat, Undo],
        toolbar: {
            shouldNotGroupWhenFull: false,
            items: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'alignment', '|', 'link', 'removeFormat']
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Đoạn văn', class: 'ck-heading_paragraph' },
                { model: 'heading2', view: 'h2', title: 'Tiêu đề 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Tiêu đề 3', class: 'ck-heading_heading3' }
            ]
        },
        placeholder: placeholder ?? 'Nhập nội dung...'
    };

    return (
        <div className="jd-rich-editor w-full overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900">
            <style jsx global>{`
                .jd-rich-editor .ck.ck-editor {
                    width: 100%;
                    border: none !important;
                }

                .jd-rich-editor .ck.ck-toolbar {
                    border: 0 !important;
                    border-bottom: 1px solid rgb(226 232 240) !important;
                    background: rgb(248 250 252) !important;
                    padding: 5px 8px !important;
                    min-height: 42px;
                    border-radius: 0 !important;
                }

                .dark .jd-rich-editor .ck.ck-toolbar {
                    background: rgb(15 23 42) !important;
                    border-bottom-color: rgb(51 65 85) !important;
                }

                .jd-rich-editor .ck.ck-toolbar .ck.ck-button {
                    min-width: 32px;
                    min-height: 32px;
                    border-radius: 6px !important;
                    margin: 1px !important;
                }

                .jd-rich-editor .ck.ck-toolbar .ck.ck-button:hover {
                    background: rgb(226 232 240) !important;
                }

                .dark .jd-rich-editor .ck.ck-toolbar .ck.ck-button:hover {
                    background: rgb(51 65 85) !important;
                }

                .jd-rich-editor .ck.ck-button.ck-on {
                    background: rgb(59 130 246 / 0.12) !important;
                    color: rgb(37 99 235) !important;
                }

                .jd-rich-editor .ck.ck-editor__main > .ck-editor__editable {
                    min-height: 220px;
                    max-height: 320px;
                    overflow-y: auto;
                    border: 0 !important;
                    box-shadow: none !important;
                    padding: 14px 16px !important;
                    font-size: 14px;
                    line-height: 1.7;
                    background: transparent !important;
                    color: rgb(51 65 85);
                }

                .jd-rich-editor .ck.ck-editor__main > .ck-editor__editable.ck-focused {
                    border: 0 !important;
                    box-shadow: none !important;
                }

                .dark .jd-rich-editor .ck.ck-editor__main > .ck-editor__editable {
                    color: rgb(226 232 240);
                }

                .jd-rich-editor .ck.ck-editor__editable .ck-placeholder::before {
                    color: rgb(148 163 184) !important;
                    font-style: normal !important;
                }

                .jd-rich-editor .ck-content h2 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 12px 0 8px;
                    color: rgb(30 41 59);
                }

                .jd-rich-editor .ck-content h3 {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 10px 0 6px;
                    color: rgb(51 65 85);
                }

                .dark .jd-rich-editor .ck-content h2,
                .dark .jd-rich-editor .ck-content h3 {
                    color: rgb(248 250 252);
                }

                .jd-rich-editor .ck-content p {
                    margin: 0 0 8px;
                }

                .jd-rich-editor .ck-content ul,
                .jd-rich-editor .ck-content ol {
                    padding-left: 24px;
                    margin: 8px 0;
                }

                .jd-rich-editor .ck-content li {
                    margin: 3px 0;
                }

                .jd-rich-editor .ck.ck-dropdown__panel,
                .jd-rich-editor .ck.ck-list {
                    border-radius: 8px !important;
                }

                .jd-rich-editor .ck-editor__editable::-webkit-scrollbar {
                    width: 6px;
                }

                .jd-rich-editor .ck-editor__editable::-webkit-scrollbar-track {
                    background: transparent;
                }

                .jd-rich-editor .ck-editor__editable::-webkit-scrollbar-thumb {
                    background: rgb(203 213 225);
                    border-radius: 999px;
                }

                .dark .jd-rich-editor .ck-editor__editable::-webkit-scrollbar-thumb {
                    background: rgb(71 85 105);
                }

                @media (max-width: 640px) {
                    .jd-rich-editor .ck.ck-toolbar {
                        padding: 4px !important;
                    }

                    .jd-rich-editor .ck.ck-toolbar .ck.ck-button {
                        min-width: 30px;
                        min-height: 30px;
                    }

                    .jd-rich-editor .ck.ck-editor__main > .ck-editor__editable {
                        min-height: 200px;
                        max-height: 280px;
                        padding: 12px !important;
                        font-size: 14px;
                    }
                }
            `}</style>

            <CKEditor editor={ClassicEditor} config={config} data={value || ''} onChange={(_, editor) => onChange(editor.getData())} />
        </div>
    );
}