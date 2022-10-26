import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptab_btns flex flex-wrap">
      <div
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <span className="font-bold">bold</span>
      </div>
      <div
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <span className="italic">italic</span>
      </div>
      <div
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <span className="line-through">strike</span>
      </div>
      <div
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        <span>&lt;code&gt;</span>
      </div>
      <div
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        paragraph
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        H1
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        H2
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        H3
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
      >
        H4
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
      >
        H5
      </div>
      <div
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
      >
        H6
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </div>
      <div
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </div>
      <div
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code block
      </div>
      <div
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        blockquote
      </div>
      <div onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </div>
      <div
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </div>
      <div
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </div>
    </div>
  );
};

const TibTap = (props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `${props.content}`,
    onUpdate({ editor }) {
      props.onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TibTap;
// export default (props) => {
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: `${props.content}`,
//     onUpdate({ editor }) {
//       props.onChange(editor.getHTML());
//     },
//   });

//   return (
//     <div>
//       <MenuBar editor={editor} />
//       <EditorContent editor={editor} />
//     </div>
//   );
// };
