import { useEffect, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Youtube from '@tiptap/extension-youtube';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    ListTodo,
    Minus,
    Quote,
    Redo,
    Strikethrough,
    Terminal,
    Underline as UnderlineIcon,
    Undo,
    Youtube as YoutubeIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { MediaPicker } from './MediaPicker';
import { mediaUrl } from './mediaUrl';

interface Props {
    value: unknown;
    onChange: (value: unknown) => void;
    placeholder?: string;
    editable?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, editable = true }: Props) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const editor = useEditor({
        editable,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: { HTMLAttributes: { class: 'rounded-lg bg-slate-900 text-slate-100' } },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-emerald-600 underline-offset-4 hover:underline' },
            }),
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full' },
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Start writing your post…',
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: false }),
            TaskList.configure({ HTMLAttributes: { class: 'not-prose space-y-1' } }),
            TaskItem.configure({ nested: true }),
            Youtube.configure({
                inline: false,
                width: 720,
                height: 405,
                HTMLAttributes: { class: 'rounded-lg overflow-hidden my-4' },
            }),
        ],
        content: (value as object) ?? null,
        editorProps: {
            attributes: {
                class:
                    'prose prose-slate prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-blockquote:border-emerald-500 prose-blockquote:not-italic prose-a:text-emerald-600 prose-strong:text-slate-900 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.92em] prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-img:rounded-lg max-w-none min-h-[360px] focus:outline-none px-4 py-4 text-[15px] leading-relaxed',
            },
        },
        onUpdate: ({ editor: e }) => onChange(e.getJSON()),
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getJSON();
        if (JSON.stringify(current) !== JSON.stringify(value)) {
            editor.commands.setContent((value as object) ?? null, false);
        }
    }, [value, editor]);

    useEffect(() => {
        if (editor) editor.setEditable(editable);
    }, [editable, editor]);

    if (!editor) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white">
            {editable && <Toolbar editor={editor} onInsertImage={() => setPickerOpen(true)} />}
            <EditorContent editor={editor} />
            <MediaPicker
                open={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onSelect={(media) => {
                    editor
                        .chain()
                        .focus()
                        .setImage({
                            src: mediaUrl(media.url),
                            alt: media.alt ?? undefined,
                        })
                        .run();
                    setPickerOpen(false);
                }}
            />
        </div>
    );
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
    return (
        <div className="sticky top-0 z-20 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-slate-200 bg-slate-50/95 px-2 py-1.5 backdrop-blur">
            <ToolbarButton
                active={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                aria="H1"
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                aria="H2"
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                aria="H3"
            >
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton
                active={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                aria="Bold"
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                aria="Italic"
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('underline')}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                aria="Underline"
            >
                <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('strike')}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                aria="Strike"
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('highlight')}
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                aria="Highlight"
            >
                <Highlighter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('code')}
                onClick={() => editor.chain().focus().toggleCode().run()}
                aria="Inline code"
            >
                <Code className="h-4 w-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton
                active={editor.isActive({ textAlign: 'left' })}
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                aria="Align left"
            >
                <AlignLeft className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive({ textAlign: 'center' })}
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                aria="Align center"
            >
                <AlignCenter className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive({ textAlign: 'right' })}
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                aria="Align right"
            >
                <AlignRight className="h-4 w-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton
                active={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                aria="Bullet list"
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                aria="Ordered list"
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('taskList')}
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                aria="Task list"
            >
                <ListTodo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('blockquote')}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                aria="Quote"
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                active={editor.isActive('codeBlock')}
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                aria="Code block"
            >
                <Terminal className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                aria="Horizontal rule"
            >
                <Minus className="h-4 w-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton
                active={editor.isActive('link')}
                onClick={() => {
                    const url = window.prompt('URL');
                    if (url == null) return;
                    if (url === '') {
                        editor.chain().focus().unsetLink().run();
                        return;
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }}
                aria="Link"
            >
                <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={onInsertImage} aria="Insert image">
                <ImageIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => {
                    const url = window.prompt('YouTube URL');
                    if (!url) return;
                    editor.chain().focus().setYoutubeVideo({ src: url }).run();
                }}
                aria="Embed YouTube"
            >
                <YoutubeIcon className="h-4 w-4" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} aria="Undo">
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} aria="Redo">
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
}

function ToolbarButton({
    active,
    onClick,
    aria,
    children,
}: {
    active?: boolean;
    onClick: () => void;
    aria: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={aria}
            onClick={onClick}
            className={cn(
                'rounded-md p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900',
                active && 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
            )}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <span className="mx-1 h-5 w-px bg-slate-200" />;
}
