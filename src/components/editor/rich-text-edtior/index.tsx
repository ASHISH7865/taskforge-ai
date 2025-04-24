import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import "./editor.css";

const RichTextEditor = ({ content, onChange }: { content: string; onChange: (content: string) => void }) => {
  const editor = useEditor({
    extensions: [
        Color.configure({ types: [TextStyle.name, ListItem.name] }),
        TextStyle.configure({  }),
        StarterKit.configure({
            bulletList: {
              keepMarks: true,
              keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
            orderedList: {
              keepMarks: true,
              keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
            },
        }),
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
        console.log(editor.getHTML())
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
          class: "min-h-[30vh] h-full max-h-[40vh] overflow-y-auto border rounded-md p-2 focus:outline-none rich-text-editor prose prose-sm sm:prose lg:prose-lg xl:prose-2xl",
      },
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* <Textarea
            className="w-full h-full"
            value={content}
            rows={10}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write something..."
        /> */}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
