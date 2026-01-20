<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'

const modelValue = defineModel<string>({ default: '' })

const editor = useEditor({
  content: modelValue.value,
  extensions: [
    StarterKit,
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
  ],
  onUpdate({ editor }) {
    modelValue.value = editor.getHTML()
  },
})
</script>

<template>
  <div v-if="editor" class="tw-border tw-rounded-lg tw-bg-white tw-flex tw-flex-col tw-h-[60vh]"
  >

    <!-- TOOLBAR -->
    <div
        class="tw-flex tw-flex-wrap tw-gap-1 tw-border-b tw-bg-gray-50 tw-p-2 tw-flex-shrink-0"
    >

      <!-- BOLD -->
      <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="[
          'tw-btn',
          editor.isActive('bold') && 'tw-btn-active'
        ]"
      >
        <b>B</b>
      </button>

      <!-- ITALIC -->
      <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="[
          'tw-btn',
          editor.isActive('italic') && 'tw-btn-active'
        ]"
      >
        <i>I</i>
      </button>

      <!-- STRIKE -->
      <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="[
          'tw-btn',
          editor.isActive('strike') && 'tw-btn-active'
        ]"
      >
        <s>S</s>
      </button>

      <div class="tw-w-px tw-bg-gray-300 tw-mx-1" />

      <!-- LIST -->
      <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="['tw-btn', editor.isActive('bulletList') && 'tw-btn-active']"
      >
        •
      </button>

      <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="['tw-btn', editor.isActive('orderedList') && 'tw-btn-active']"
      >
        1.
      </button>

      <div class="tw-w-px tw-bg-gray-300 tw-mx-1" />

      <!-- HEADING -->
      <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="['tw-btn', editor.isActive('heading', { level: 2 }) && 'tw-btn-active']"
      >
        Başlık
      </button>

      <!-- PARAGRAPH -->
      <button
          @click="editor.chain().focus().setParagraph().run()"
          :class="['tw-btn', editor.isActive('paragraph') && 'tw-btn-active']"
      >
        Yazı
      </button>

      <div class="tw-w-px tw-bg-gray-300 tw-mx-1" />

      <!-- TEXT COLOR -->
      <input
          type="color"
          class="tw-h-8 tw-w-8 tw-cursor-pointer"
          @input="editor.chain().focus().setColor(($event.target as HTMLInputElement).value).run()"
      />

      <button
          @click="editor.chain().focus().unsetColor().run()"
          class="tw-btn"
      >
        X
      </button>

      <input
          type="color"
          class="tw-h-8 tw-w-8 tw-cursor-pointer tw-border tw-rounded"
          :class="editor.isActive('highlight') && 'tw-ring-2 tw-ring-blue-400'"
          :value="editor.getAttributes('highlight').color || '#ffffff'"
          @input="
          editor
          .chain()
          .focus()
          .toggleHighlight({
          color: ($event.target as HTMLInputElement).value,
          })
          .run()
          "
      />

      <button
          @click="editor.chain().focus().unsetHighlight().run()"
          class="tw-btn"
      >
        X
      </button>

      <!-- CLEAR -->
      <button
          @click="editor.chain().focus().unsetAllMarks().clearNodes().run()"
          class="tw-btn tw-ml-4"
      >
        ✕ Hepsini Sil
      </button>
    </div>

    <!-- EDITOR -->
    <div class="tw-flex-1 tw-overflow-y-auto tw-p-2" style="min-height: 200px;">
      <EditorContent
          :editor="editor"
          class="editor-content"
      />
    </div>
  </div>
</template>

<style scoped>
.tw-btn {
  @apply tw-px-2 tw-py-1 tw-border tw-rounded-md tw-text-sm
  hover:tw-bg-gray-100 tw-transition
  tw-flex tw-items-center tw-justify-center;
}

.tw-btn-active {
  @apply tw-bg-blue-100 tw-border-blue-400 tw-text-blue-700;
}

.editor-content {
  @apply tw-p-4 tw-outline-none tw-min-h-0;
}
/* Sol boşluk & list fix */
.editor-content :deep(.ProseMirror) {
  @apply tw-outline-none tw-leading-relaxed;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  @apply tw-ml-6;
}
</style>
