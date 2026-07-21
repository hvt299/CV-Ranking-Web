'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    Link,
    List,
    BlockQuote,
    Code,
    CodeBlock,
    HorizontalLine,
    Table,
    TableToolbar,
    Image,
    ImageToolbar,
    ImageCaption,
    ImageStyle,
    ImageResize,
    AutoImage,
    MediaEmbed,
    FontFamily,
    FontSize,
    FontColor,
    FontBackgroundColor,
    Highlight,
    Alignment,
    Indent,
    IndentBlock,
    RemoveFormat,
    SelectAll,
    PasteFromOffice,
    Autoformat,
    Undo,
    type EditorConfig
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

interface RichTextEditorProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder
}: RichTextEditorProps) {
    const config: EditorConfig = {
        licenseKey: 'GPL',

        plugins: [
            Essentials,
            Paragraph,
            Heading,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Link,
            List,
            BlockQuote,
            Code,
            CodeBlock,
            HorizontalLine,
            Table,
            TableToolbar,
            Image,
            ImageToolbar,
            ImageCaption,
            ImageStyle,
            ImageResize,
            AutoImage,
            MediaEmbed,
            FontFamily,
            FontSize,
            FontColor,
            FontBackgroundColor,
            Highlight,
            Alignment,
            Indent,
            IndentBlock,
            RemoveFormat,
            SelectAll,
            PasteFromOffice,
            Autoformat,
            Undo
        ],

        toolbar: {
            shouldNotGroupWhenFull: true,
            items: [
                'heading',
                '|',
                'fontFamily',
                'fontSize',
                'fontColor',
                'fontBackgroundColor',
                'highlight',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'removeFormat',
                '|',
                'link',
                'bulletedList',
                'numberedList',
                'outdent',
                'indent',
                '|',
                'alignment',
                'blockQuote',
                'code',
                'codeBlock',
                'insertTable',
                'horizontalLine',
                'mediaEmbed',
                '|',
                'undo',
                'redo'
            ]
        },

        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        },

        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                '|',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side',
                '|',
                'resizeImage'
            ]
        },

        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                }
            ]
        },

        placeholder: placeholder ?? 'Nhập nội dung...'
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
            <style jsx global>{`
                .ck.ck-editor {
                    border: none;
                }

                .ck.ck-toolbar {
                    border: 0 !important;
                    border-bottom: 1px solid rgb(226 232 240) !important;
                    background: rgb(248 250 252) !important;
                    padding: 8px !important;
                }

                .dark .ck.ck-toolbar {
                    background: rgb(15 23 42) !important;
                    border-bottom-color: rgb(51 65 85) !important;
                }

                .ck.ck-editor__main > .ck-editor__editable {
                    min-height: 380px;
                    border: 0 !important;
                    box-shadow: none !important;
                    padding: 20px 24px;
                    font-size: 15px;
                    line-height: 1.8;
                    background: transparent;
                }

                .dark .ck.ck-editor__editable {
                    color: #f8fafc;
                }

                .ck.ck-button.ck-on {
                    background: rgb(59 130 246 / 0.12) !important;
                }

                .ck.ck-dropdown__panel,
                .ck.ck-list {
                    border-radius: 10px;
                }
            `}</style>

            <CKEditor
                editor={ClassicEditor}
                config={config}
                data={value}
                onChange={(_, editor) => onChange(editor.getData())}
            />
        </div>
    );
}