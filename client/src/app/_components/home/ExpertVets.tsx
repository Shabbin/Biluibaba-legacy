'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

import VetProfile from '@/src/components/profile/vet';
import axios from '@/src/lib/axiosInstance';

interface VetSlot {
  availableSlots?: string[];
}

interface VetSlotsMap {
  sunday?: VetSlot;
  monday?: VetSlot;
  tuesday?: VetSlot;
  wednesday?: VetSlot;
  thursday?: VetSlot;
  friday?: VetSlot;
  saturday?: VetSlot;
  [key: string]: VetSlot | undefined;
}

interface VetAppointments {
  slots: VetSlotsMap;
  online?: {
    fee?: number;
  };
}

interface VetData {
  _id: string;
  name: string;
  profilePicture: string;
  degree: string;
  verified: boolean;
  appointments: VetAppointments;
}

interface ExpertVetsProps {
  router: AppRouterInstance;
  VetsData?: VetData[];
}

const ExpertVets: React.FC<ExpertVetsProps> = ({ router }) => {
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState<VetData[]>([]);

  const fetchVets = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/api/vet/');
      if (data.success) setVets(data.vets);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch expert vets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVets();
  }, []);

  return (
    <div className="py-10">
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
