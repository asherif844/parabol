import {Editor as EditorState} from '@tiptap/core'
import Placeholder from '@tiptap/extension-placeholder'
import {Editor, EditorContent, EditorEvents, JSONContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, {useState} from 'react'

interface Props {
  autoFocus?: boolean
  content: JSONContent
  handleSubmit: (editor: EditorState) => void
  readOnly: boolean
  placeholder: string
}

const PromptResponseEditor = (props: Props) => {
  const {autoFocus: autoFocusProp, content, handleSubmit, readOnly, placeholder} = props
  const [_isEditing, setIsEditing] = useState(false)
  const [autoFocus, setAutoFocus] = useState(autoFocusProp)

  const setEditing = (isEditing: boolean) => {
    setIsEditing(isEditing)
    setAutoFocus(false)
  }

  const onUpdate = () => {
    setEditing(true)
  }

  const onSubmit = async ({editor: newEditorState}: EditorEvents['blur']) => {
    setEditing(false)
    handleSubmit(newEditorState)
  }

  const showPlaceholder = !content && !!placeholder
  const editor: Editor | null = useEditor({
    content,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: showPlaceholder ? placeholder : ''
      })
    ],
    autofocus: autoFocus,
    onUpdate,
    onBlur: onSubmit,
    editable: !readOnly
  })

  return <EditorContent editor={editor} />
}
export default PromptResponseEditor
