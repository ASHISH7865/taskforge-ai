/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,

    Undo,
    Redo,
    AlignLeft,
    Highlighter,
    AlignCenter,
    AlignJustify,
    AlignRight,
    Pilcrow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


type MenuButtonProps = {
    children: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    className?: string;
};

const MenuButton: React.FC<MenuButtonProps> = ({ children, tooltip, onClick, className }) => (
    <Button
        variant="ghost"
        className={cn("p-2 rounded  transition-colors relative group", className)}
        aria-label={tooltip}
        onClick={onClick}
    >
        {children}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-primary text-primary-foreground text-xs rounded py-1 px-2 whitespace-nowrap">
            {tooltip}
        </span>
    </Button>
);

function MenuBar({ editor }: { editor: any }) {
    if (!editor) {
        return null
    }

    return (
        <div className="control-group">
            <div className="button-group flex gap-1  flex-wrap">
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 , class: 'text-2xl font-bold' }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
                        <Heading1 className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                        <Heading2 className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                        <Heading3 className="w-4 h-4" />
                    </MenuButton>
                </div>
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
                        <Pilcrow className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                        <Bold className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
                        <Italic className="w-4 h-4" />
                    </MenuButton>
                </div>
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="Strike" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
                        <Strikethrough className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Highlight" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                        <Highlighter className="w-4 h-4" />
                    </MenuButton>
                </div>
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="Undo" onClick={() => editor.chain().focus().undo().run()} className={editor.isActive('undo') ? 'is-active' : ''}>
                        <Undo className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Redo" onClick={() => editor.chain().focus().redo().run()} className={editor.isActive('redo') ? 'is-active' : ''}>
                        <Redo className="w-4 h-4" />
                    </MenuButton>
                </div>
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="List" onClick={() => editor.chain().focus().toggleList({ type: 'bullet' }).run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
                        <List className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Ordered List" onClick={() => editor.chain().focus().toggleList({ type: 'ordered' }).run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
                        <ListOrdered className="w-4 h-4" />
                    </MenuButton>
                </div>
                <div className='flex gap-1 items-center justify-center flex-wrap bg-[#111] rounded-md'>
                    <MenuButton tooltip="Left" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                        <AlignLeft className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Center" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                        <AlignCenter className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Right" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                        <AlignRight className="w-4 h-4" />
                    </MenuButton>
                    <MenuButton tooltip="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
                        <AlignJustify className="w-4 h-4" />
                    </MenuButton>
                </div>

            </div>
        </div>
    );
}

export default MenuBar;
