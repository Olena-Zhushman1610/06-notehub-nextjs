'use client';

import { useQuery, HydrationBoundary } from '@tanstack/react-query';
import type { DehydratedState } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  noteId: string;
  dehydratedState: DehydratedState;
}

export default function NoteDetailsClient({ noteId, dehydratedState }: NoteDetailsClientProps) {
  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteDetailsContent id={noteId} />
    </HydrationBoundary>
  );
}

function NoteDetailsContent({ id }: { id: string }) {
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>Created: {new Date(note.createdAt).toLocaleString()}</p>
        <p className={css.date}>Updated: {new Date(note.updatedAt).toLocaleString()}</p>
        <p className={css.tag}>Tag: {note.tag ?? 'General'}</p>
      </div>
    </div>
  );
}
