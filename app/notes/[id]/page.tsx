import { fetchNoteById } from '@/lib/api';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';
import type { DehydratedState } from '@tanstack/react-query';
//import { use } from 'react';

interface NotePageProps {
  params: Promise<{ id: string }>; // params це Promise
}

export default async function NoteDetailsPage({ params }: NotePageProps) {
  const { id } = await params; // розпаковуємо Promise

  // Вивід для перевірки id
  console.log('Server page params.id:', id);
  const queryClient = new QueryClient();

  // Prefetch нотатки
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState: DehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient noteId={id} dehydratedState={dehydratedState} />
    </HydrationBoundary>
  );
}
