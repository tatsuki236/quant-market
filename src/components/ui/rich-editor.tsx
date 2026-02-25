import { useEditor, EditorContent } from "@tiptap/react";
import type { EditorView } from "prosemirror-view";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Strikethrough,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
  Minus,
  ImagePlus,
  Undo,
  Redo,
  Link as LinkIcon,
  Palette,
  Highlighter,
  Type,
  Pilcrow,
  Eye,
  Pencil,
} from "lucide-react";
import { useRef, useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const lowlight = createLowlight(common);

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
};

const BUCKET = "product-images";

// note風カラーパレット
const TEXT_COLORS = [
  { label: "デフォルト", value: "" },
  { label: "赤", value: "#ef4444" },
  { label: "青", value: "#3b82f6" },
  { label: "緑", value: "#22c55e" },
  { label: "オレンジ", value: "#f97316" },
  { label: "紫", value: "#a855f7" },
  { label: "グレー", value: "#6b7280" },
];

const HIGHLIGHT_COLORS = [
  { label: "なし", value: "" },
  { label: "黄", value: "#fef08a" },
  { label: "赤", value: "#fecaca" },
  { label: "青", value: "#bfdbfe" },
  { label: "緑", value: "#bbf7d0" },
  { label: "紫", value: "#e9d5ff" },
];

const PREVIEW_PROSE =
  "prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none [&_img]:rounded-lg [&_img]:max-w-full [&_pre]:relative [&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:pr-14 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono [&_mark]:rounded [&_mark]:px-0.5 [&_a]:text-primary [&_a]:underline [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg";

/** プレビュー内の <pre> にコピーボタンを付与 */
function usePreviewCopyButtons(ref: React.RefObject<HTMLDivElement | null>, active: boolean, content: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const pres = el.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.className =
        "code-copy-btn absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-[#cdd6f4] transition-colors select-none";
      btn.textContent = "コピー";
      btn.onclick = () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(code);
        btn.textContent = "コピー済み ✓";
        setTimeout(() => { btn.textContent = "コピー"; }, 2000);
      };
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  }, [active, content]);
}

const RichEditor = ({ value, onChange, placeholder, label }: RichEditorProps) => {
  const { seller } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [floatingMenu, setFloatingMenu] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  usePreviewCopyButtons(previewRef, isPreview, value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Placeholder.configure({ placeholder: placeholder || "ここに記事を入力..." }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: ({ editor }) => {
      requestAnimationFrame(() => {
        try {
          const { node } = editor.view.domAtPos(editor.state.selection.anchor);
          const el = node instanceof HTMLElement ? node : node.parentElement;
          el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        } catch { /* scroll may fail if DOM not ready */ }
      });
    },
    onSelectionUpdate: ({ editor }) => {
      // テキスト選択時にフローティングメニューを表示
      const { from, to } = editor.state.selection;
      if (from === to) {
        setFloatingMenu(null);
        return;
      }
      try {
        const coords = editor.view.coordsAtPos(from);
        const scrollEl = scrollRef.current;
        if (scrollEl) {
          const rect = scrollEl.getBoundingClientRect();
          setFloatingMenu({
            top: coords.top - rect.top - 48,
            left: Math.min(coords.left - rect.left, rect.width - 320),
          });
        }
      } catch {
        setFloatingMenu(null);
      }
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!seller || !editor) return;
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${seller.auth_user_id}/articles/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
      if (error) return;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    },
    [seller, editor]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        handlePaste: (_view: EditorView, event: ClipboardEvent) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of items) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) uploadImage(file);
              return true;
            }
          }
          return false;
        },
        handleDrop: (_view: EditorView, event: DragEvent) => {
          const files = event.dataTransfer?.files;
          if (!files?.length) return false;
          for (const file of files) {
            if (file.type.startsWith("image/")) {
              event.preventDefault();
              uploadImage(file);
              return true;
            }
          }
          return false;
        },
      },
    });
  }, [editor, uploadImage]);

  const addLink = () => {
    if (!editor) return;
    const url = window.prompt("URLを入力");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  if (!editor) return null;

  const ToolBtn = ({
    active,
    onClick,
    children,
    title,
    className: extraClass,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded hover:bg-muted transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground"
      } ${extraClass || ""}`}
    >
      {children}
    </button>
  );

  const s = "h-4 w-4";
  const Sep = () => <div className="w-px h-5 bg-border mx-0.5" />;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] border border-border rounded-xl bg-background">
      {/* ラベル + ツールバー */}
      <div className="shrink-0 border-b border-border bg-background rounded-t-xl">
        {label && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-sm font-medium">{label}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
          {/* 見出し */}
          <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="見出し1">
            <Heading1 className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="見出し2">
            <Heading2 className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="見出し3">
            <Heading3 className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="本文">
            <Pilcrow className={s} />
          </ToolBtn>

          <Sep />

          {/* テキスト装飾 */}
          <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="太字">
            <Bold className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="斜体">
            <Italic className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="下線">
            <UnderlineIcon className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="取り消し線">
            <Strikethrough className={s} />
          </ToolBtn>

          <Sep />

          {/* 文字色 */}
          <div className="relative">
            <ToolBtn active={showColorPicker} onClick={() => { setShowColorPicker(!showColorPicker); setShowHighlightPicker(false); }} title="文字色">
              <Palette className={s} />
            </ToolBtn>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 flex gap-1 p-2 rounded-lg border border-border bg-popover shadow-lg">
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value || "default"}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      if (c.value) editor.chain().focus().setColor(c.value).run();
                      else editor.chain().focus().unsetColor().run();
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value || "var(--foreground)" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ハイライト */}
          <div className="relative">
            <ToolBtn active={showHighlightPicker} onClick={() => { setShowHighlightPicker(!showHighlightPicker); setShowColorPicker(false); }} title="ハイライト">
              <Highlighter className={s} />
            </ToolBtn>
            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1 z-30 flex gap-1 p-2 rounded-lg border border-border bg-popover shadow-lg">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value || "none"}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      if (c.value) editor.chain().focus().toggleHighlight({ color: c.value }).run();
                      else editor.chain().focus().unsetHighlight().run();
                      setShowHighlightPicker(false);
                    }}
                    className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value || "transparent" }}
                  >
                    {!c.value && <span className="text-[10px]">✕</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Sep />

          {/* リスト・引用 */}
          <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="箇条書き">
            <List className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="番号リスト">
            <ListOrdered className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="引用">
            <Quote className={s} />
          </ToolBtn>

          <Sep />

          {/* ブロック挿入 */}
          <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="コードブロック">
            <Code className={s} />
          </ToolBtn>
          <ToolBtn active={editor.isActive("link")} onClick={addLink} title="リンク">
            <LinkIcon className={s} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="区切り線">
            <Minus className={s} />
          </ToolBtn>
          <ToolBtn onClick={() => fileInputRef.current?.click()} title="画像">
            <ImagePlus className={s} />
          </ToolBtn>

          <Sep />

          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="元に戻す">
            <Undo className={s} />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="やり直す">
            <Redo className={s} />
          </ToolBtn>

          <Sep />

          {/* プレビュー切替 */}
          <ToolBtn
            active={isPreview}
            onClick={() => setIsPreview(!isPreview)}
            title={isPreview ? "編集に戻る" : "プレビュー"}
            className={isPreview ? "!bg-primary !text-primary-foreground" : ""}
          >
            {isPreview ? <Pencil className={s} /> : <Eye className={s} />}
          </ToolBtn>
          {isPreview && (
            <span className="text-xs text-muted-foreground ml-1 select-none">プレビュー中</span>
          )}
        </div>
      </div>

      {/* エディタ本体 or プレビュー */}
      {isPreview ? (
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 pb-[40vh]">
          {value && value !== "<p></p>" ? (
            <div className="p-4 sm:p-6 rounded-xl bg-card border border-border">
              <div
                ref={previewRef}
                className={PREVIEW_PROSE}
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
              コンテンツがありません
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto relative" ref={scrollRef}>
          {/* フローティングメニュー — テキスト選択時に表示 */}
          {floatingMenu && (
            <div
              className="absolute z-30 flex items-center gap-0.5 px-2 py-1.5 rounded-lg border border-border bg-popover shadow-lg animate-in fade-in duration-150"
              style={{ top: floatingMenu.top, left: Math.max(8, floatingMenu.left) }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="太字"><Bold className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="斜体"><Italic className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="下線"><UnderlineIcon className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="取り消し線"><Strikethrough className={s} /></ToolBtn>
              <Sep />
              <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="見出し2"><Heading2 className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="見出し3"><Heading3 className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="本文"><Type className={s} /></ToolBtn>
              <Sep />
              <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="箇条書き"><List className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="番号リスト"><ListOrdered className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="引用"><Quote className={s} /></ToolBtn>
              <Sep />
              <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="コード"><Code className={s} /></ToolBtn>
              <ToolBtn active={editor.isActive("link")} onClick={addLink} title="リンク"><LinkIcon className={s} /></ToolBtn>
            </div>
          )}

          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none px-4 sm:px-8 pt-6 pb-[40vh] min-h-full focus-within:outline-none [&_.tiptap]:outline-none [&_.tiptap]:min-h-[300px] [&_.is-editor-empty:first-child::before]:text-muted-foreground/50 [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:pointer-events-none [&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono [&_img]:rounded-lg [&_img]:max-w-full [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_mark]:rounded [&_mark]:px-0.5 [&_a]:text-primary [&_a]:underline"
          />
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default RichEditor;
