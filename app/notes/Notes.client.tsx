'use client';

import css from './App.module.css';
import NoteList from '@/components/NoteList/NoteList';
import { useState, useEffect, useCallback } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

export default function NotesClient() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const saved = localStorage.getItem('notesPage');
    return saved ? Number(saved) : 1;
  });

  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  useEffect(() => {
    localStorage.setItem('notesPage', page.toString());
  }, [page]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, search: debouncedSearch }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const pageCount = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {data && pageCount > 1 && (
          <Pagination page={page} onChange={setPage} pageCount={pageCount} />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      <NoteList data={data} isLoading={isLoading} isError={isError} />

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
}
