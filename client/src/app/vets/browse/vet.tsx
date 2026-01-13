'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import axios from '@/src/lib/axiosInstance';

import Filter from '@/src/components/filter/vet';
import VetProfile from '@/src/components/profile/vet';

import VetsData from '@/src/app/vets/browse/vet.data';

interface VetSlots {
  [day: string]: string[];
}

interface VetAppointments {
  slots: VetSlots;
  [key: string]: { fee?: number } | VetSlots;
}

interface VetData {
  _id: string;
  name: string;
  profilePicture: string;
  degree: string;
  verified: boolean;
  appointments: VetAppointments;
}

interface VetTypeData {
  name: string;
  src: string;
}

interface PetFilter {
  species: string;
  concerns: string[];
}

const VetBrowse: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const type = searchParams.get('type') || 'online';

  const date = new Date();

  const [loading, setLoading] = useState<boolean>(false);
  const [vetData, setVetData] = useState<VetTypeData | undefined>(
    VetsData.vets.find((item: VetTypeData) => item.name === type)
  );
  const [vets, setVets] = useState<VetData[]>([]);
  const [location, setLocation] = useState<string>('Dhaka, Bangladesh');
  const [calendar, setCalendar] = useState<string>(
    `${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })}, ${date.toLocaleDateString('en-US', {
      month: 'long',
    })} ${date.getDate()}, ${new Date().getFullYear()}`
  );
  const [species, setSpecies] = useState<string>('Dog');

  const fetchVets = async (): Promise<void> => {
    if (!vetData) return;
    
    try {
      const { data } = await axios.get(`/api/vet/get?type=${vetData.name}`);

      if (data.success) setVets(data.vets);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const petFilterStr = localStorage.getItem('pet-filter');
    const petFilter: PetFilter | null = petFilterStr ? JSON.parse(petFilterStr) : null;
    
    if (!petFilter || petFilter.concerns.length === 0) {
      router.push('/vets/filter?from=' + pathname + (type ? `?type=${type}` : ''));
      return;
    } else {
      setSpecies(petFilter.species);
    }

    fetchVets();
  }, []);

  if (!vetData) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <img src={vetData.src} alt="Banner" />

      <div className="flex md:flex-row flex-col justify-between md:items-center my-20 md:mx-0 mx-5">
        <div className="text-center md:text-left md:mb-0 mb-10">
          <div className="text-xl">Select a vet</div>
          <div className="text-lg">For your {vetData.name} appointment</div>
        </div>
        <Filter location={location} calendar={calendar} species={species} />
      </div>

      <div className="flex md:flex-row flex-col md:-m-2 mx-2 flex-wrap items-center">
        {loading ? (
          <div>Loading vets...</div>
        ) : (
          vets.map((vet, i) => (
            <VetProfile
              src={vet.profilePicture}
              id={vet._id}
              name={vet.name}
              designation={vet.degree}
              star={5}
              reviews={100}
              verified={vet.verified}
              slots={vet.appointments.slots}
              price={(vet.appointments[type] as { fee?: number })?.fee}
              key={i}
              type={type}
              router={router}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VetBrowse;
