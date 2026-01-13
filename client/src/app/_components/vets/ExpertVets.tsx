'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import axios from '@/src/lib/axiosInstance';
import VetProfile from '@/src/components/profile/vet';

interface VetSlots {
  [day: string]: string[];
}

interface VetData {
  _id: string;
  name: string;
  profilePicture: string;
  degree: string;
  verified: boolean;
  appointments: {
    online?: {
      fee: number;
    };
    slots: VetSlots;
  };
}

const ExpertVets: React.FC = () => {
  const [vets, setVets] = useState<VetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  const fetchVets = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/api/vet');

      if (data.success) setVets(data.vets);
    } catch (error) {
      console.error('Error fetching vets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVets();
  }, []);

  return (
    <div>
      <h1 className="md:text-4xl text-3xl font-bold text-center py-10">
        Our Expert Vets
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex md:flex-row flex-col md:-m-2 mx-2 flex-wrap items-center justify-between">
          {vets.map((vet, i) => (
            <VetProfile
              src={vet.profilePicture}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5}
              reviews={100}
              verified={vet.verified}
              slots={vet.appointments.slots}
              price={vet.appointments.online?.fee}
              type="online"
              key={i}
              router={router}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertVets;
