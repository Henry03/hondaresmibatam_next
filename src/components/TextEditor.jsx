'use client'

import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import QuillTableBetter from 'quill-table-better';
import 'quill/dist/quill.snow.css';
import 'quill-table-better/dist/quill-table-better.css'

const TextEditor = ({setHtml, html}) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);
  const quill = quillInstance.current?.root.innerHTML;
  const initialized = useRef(false);

  Quill.register({
    'modules/table-better': QuillTableBetter
  }, true)

  const addIdsToHeadings = () => {
    const editor = quillInstance.current?.root;
    if (!editor) return;

    const headings = editor.querySelectorAll('h2, h3');
    let h2Count = 0;
    let h3Count = 0;

    headings.forEach((heading) => {
      if (heading.tagName === 'H2') {
        h2Count++;
        h3Count = 0;
        heading.id = `${h2Count}`;
      } else if (heading.tagName === 'H3') {
        h3Count++;
        heading.id = `${h2Count}-${h3Count}`;
      }
    });
  };

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Compose your page...',
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['table-better'],
            ['clean'],
          ],
          table: false,
            'table-better': {
              language: 'en_US',
              menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'delete'],
              toolbarTable: true
            },
            keyboard: {
              bindings: QuillTableBetter.keyboardBindings
            }
        },
      });
      
      if (html) {
        quillInstance.current.clipboard.dangerouslyPasteHTML(html);
        addIdsToHeadings();
        setHtml(quillInstance.current.root.innerHTML);
      }

      quillInstance.current.on('text-change', () => {
        addIdsToHeadings();
        const updatedHTML = quillInstance.current.root.innerHTML;
        setHtml(updatedHTML);
      });
    }
  }, []);

    useEffect(() => {
    if (quillInstance.current && html && !initialized.current) {
      quillInstance.current.clipboard.dangerouslyPasteHTML(html);
      addIdsToHeadings();
      setHtml(quillInstance.current.root.innerHTML);
      initialized.current = true;
    }
  }, [html]);

  useEffect(() => {
    import('flyonui/dist/index.js').then(() => {
        if (window.HSOverlay?.autoInit) {
        window.HSOverlay.autoInit();
        }
    });
  }, []);
  
  return (
    <div className="w-full">
      <div ref={editorRef} style={{height: 'calc(100dvh - 20rem)'}} />
    </div>
  );
};

export default TextEditor;