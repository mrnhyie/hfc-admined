'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import MaterialIcon from '@/components/MaterialIcon';

/* A plain GET form: search works before any JS runs, and the shortcut only moves
   the caret into the box. On the results page the field mirrors the address bar so
   there is one search box, not two. */
export default function AdminSearch({ placeholder = 'Search everything' }) {
  const input = useRef(null);
  const params = useSearchParams();
  const term = params.get('q') ?? '';
  const [mod, setMod] = useState('⌘');

  useEffect(() => {
    if (/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)) return;
    setMod('Ctrl');
  }, []);

  useEffect(() => {
    if (input.current && input.current.value !== term) input.current.value = term;
  }, [term]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <form className="admin-search" action="/admin/search" method="get" role="search">
      <MaterialIcon name="search" />
      <input
        ref={input}
        name="q"
        type="search"
        defaultValue={term}
        placeholder={placeholder}
        aria-label="Search the chapel site content"
        autoComplete="off"
      />
      <kbd>{mod} K</kbd>
    </form>
  );
}
