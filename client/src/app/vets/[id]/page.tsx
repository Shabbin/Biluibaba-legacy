import { Suspense } from 'react';

import axios from '@/src/lib/axiosInstance';

import Profile from './vet';

interface Params {
  id: string;
}

interface VetPageProps {
  params: Params;
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const { data } = await axios.get('/api/vet/get-all-id');

    if (!data.success) return [];
    else
      return data.vets.map((vet: { _id: string }) => ({
        id: vet._id.toString(),
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

const VetProfile = ({ params }: VetPageProps): JSX.Element => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Profile params={params} />
    </Suspense>
  );
};

export default VetProfile;
