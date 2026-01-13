'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Filter from '@/src/components/filter/vet';
import Button from '@/src/components/ui/button';

import Landing from '@/src/app/_components/home/Landing';
import Category from '@/src/app/_components/vets/Category';
import ExpertVets from '@/src/app/_components/vets/ExpertVets';

import axios from '@/src/lib/axiosInstance';

import Testimonials from '../_components/home/Testimonials';
import Accordion from '@/src/components/ui/accordion';
import faqData from '@/src/data/faqData';

interface SliderItem {
  filename: string;
  path: string;
}

interface SiteSettings {
  vet_landing_slider: SliderItem[];
  vet_banner_one: {
    filename: string;
    path: string;
  };
}

interface VetCategory {
  src: string;
  link: string;
}

const vetCategories: VetCategory[] = [
  {
    src: '/vets/vet-online.png',
    link: '/vets/browse?type=online',
  },
  {
    src: '/vets/vet-physical.png',
    link: '/vets/browse?type=physical',
  },
  {
    src: '/vets/vet-home.png',
    link: '/vets/browse?type=homeService',
  },
  {
    src: '/vets/emergency.png',
    link: '/vets/browse?type=emergency',
  },
  {
    src: '/vets/vaccination.png',
    link: '/vets/browse?type=vaccination',
  },
  {
    src: '/vets/spay-neuter.png',
    link: '/vets/browse?type=spay-neuter',
  },
];

const Vet: React.FC = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const [calendar, setCalendar] = useState<string>('');
  const [species, setSpecies] = useState<string>('');
  const [site, setSite] = useState<SiteSettings>({
    vet_landing_slider: [],
    vet_banner_one: { filename: '', path: '' },
  });

  const fetchSiteSettings = async (): Promise<void> => {
    try {
      const { data } = await axios.get('/api/admin/site-settings');

      if (data.success) setSite(data.site);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date();
    setLocation('Dhaka, BD');
    setCalendar(
      `${date.toLocaleDateString('en-US', {
        weekday: 'long',
      })}, ${date.toLocaleDateString('en-US', {
        month: 'long',
      })} ${date.getDate()}, ${new Date().getFullYear()}`
    );
    setSpecies('Dog');

    fetchSiteSettings();
  }, []);

  return (
    <div>
      {!loading && (
        <div className="p-5">
          <Landing slider={site.vet_landing_slider} />
        </div>
      )}

      <Category categories={vetCategories} />

      <div className="container mx-auto md:px-0 px-5">
        <div className="flex flex-row justify-center items-center py-10">
          <div className="basis-1/2">
            <img
              src="/logo-black.png"
              alt="Logo Black"
              className="w-[200px] mb-5"
            />
            <h2 className="text-4xl font-semibold mb-3">
              Your partner in pet health!
            </h2>
            <h2 className="text-4xl font-semibold">
              Choose us for expert care.
            </h2>
            <p className="text-lg py-5">24/7 Online Vets & Many Services</p>
            <Button text="Consult Now" className="w-2/3" type="default" />
          </div>
          <img src="/vet1.png" alt="Vet One" className="basis-1/2 w-1/2" />
        </div>

        <img src={site.vet_banner_one.path} alt="Vet Banner One" />

        <div className="flex flex-row items-center gap-10 justify-between py-10">
          <img src="/vet2.png" alt="Vet Two" className="basis-1/2 w-1/2" />
          <div className="basis-1/2">
            <h2 className="text-4xl/10 font-bold mb-10">
              Get an online appointment with an expert vet!
            </h2>
            <Button text="Consult Now" className="w-2/3" type="default" />
          </div>
        </div>

        <img src="/vet3.png" alt="Vet Banner Two" />

        <div className="flex flex-row items-center gap-10 justify-between py-10">
          <div className="basis-1/2">
            <h2 className="text-4xl font-bold mb-10">
              Get an offline appointment with an expert vet!
            </h2>
            <Button text="Consult Now" className="w-2/3" type="default" />
          </div>
          <img src="/vet4.png" alt="Vet Two" className="basis-1/2 w-1/2" />
        </div>

        <div className="flex md:flex-row flex-col gap-5">
          <div className="basis-1/3">
            <img src="/vets/vet-homepage-3.png" alt="homepage1" />
          </div>
          <div className="basis-1/3">
            <img src="/vets/vet-homepage-2.png" alt="homepage2" />
          </div>
          <div className="basis-1/3">
            <img src="/vets/vet-homepage-1.png" alt="homepage3" />
          </div>
        </div>

        <ExpertVets />

        <img src="/vet5.png" alt="Vet Banner Four" />

        <div className="flex md:flex-row flex-col gap-5 py-10">
          <div className="basis-1/4 rounded-lg border-2 flex flex-col gap-5 items-center pb-5">
            <img
              src="/vets/vet-home2.png"
              alt="Home"
              className="rounded-tl-lg rounded-tr-lg"
            />
            <h2 className="text-xl font-bold">Home Services</h2>
            <Button text="Book Appointment" type="default" className="!py-3 mb-3" />
          </div>
          <div className="basis-1/4 border-2 rounded-lg flex flex-col gap-5 items-center pb-5">
            <img
              src="/vets/emergency2.png"
              alt="Emergency"
              className="rounded-tl-lg rounded-tr-lg"
            />
            <h2 className="text-xl font-bold">Emergency</h2>
            <Button text="Book Appointment" type="default" className="!py-3 mb-3" />
          </div>
          <div className="basis-1/4 border-2 rounded-lg flex flex-col gap-5 items-center pb-5">
            <img
              src="/vets/vaccine2.png"
              alt="Vaccine"
              className="rounded-tl-lg rounded-tr-lg"
            />
            <h2 className="text-xl font-bold">Vaccine</h2>
            <Button text="Book Appointment" type="default" className="!py-3 mb-3" />
          </div>
          <div className="basis-1/4 border-2 rounded-lg flex flex-col gap-5 items-center pb-5">
            <img
              src="/vets/spay2.png"
              alt="Spay"
              className="rounded-tl-lg rounded-tr-lg"
            />
            <h2 className="text-xl font-bold">Spay/Neutered</h2>
            <Button text="Book Appointment" type="default" className="!py-3 mb-3" />
          </div>
        </div>

        <img src="/vet6.png" alt="Vet Banner Five" />

        <div className="py-5">
          <div className="flex md:flex-row flex-col items-center justify-between border-2 rounded-lg py-24 px-20 gap-y-5">
            <div className="basis-2/3">
              <div className="flex md:flex-row flex-col items-center gap-8">
                <img
                  src="/vet-premium.png"
                  alt="Vet Premium"
                  className="w-[100px]"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
                  <p className="text-xl font-light text-gray-400">
                    To get more useful features!
                  </p>
                </div>
              </div>
            </div>
            <div className="basis-1/3 flex justify-end flex-row">
              <Button text="Subscribe" type="outline" />
            </div>
          </div>
        </div>

        <div className="bg-neutral-100">
          <div className="flex flex-row items-center justify-between rounded-lg py-24 px-20 gap-y-5">
            <div className="border-r border-black pe-5 py-5">
              <img src="/logo-black.png" alt="Logo" className="w-[250px]" />
            </div>
            <div className="basis-full px-20">
              <div className="text-5xl font-semibold mb-5">
                Take care your
                <br />
                best friend <span className="text-orange-500">in seconds</span>
              </div>
              <p className="text-3xl text-gray-400">
                A Platform for your beloved pet!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-between divide-x-2 gap-5 py-5">
          <div className="basis-2/3">
            <img src="/vet-map.png" alt="Vet Map" className="w-full" />
          </div>
          <div className="basis-1/3 py-20 px-20">
            <div className="text-2xl">Your Nearby</div>
            <div className="font-bold text-blue-500 text-2xl">
              Veterinary Hospital
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
        </div>
        <Accordion items={faqData} />
      </div>

      <Testimonials />
    </div>
  );
};

export default Vet;
