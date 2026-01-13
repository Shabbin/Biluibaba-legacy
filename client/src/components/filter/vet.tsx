'use client';

import React, { useState, ReactNode } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';

import Input from '@/src/components/ui/input';
import Button from '@/src/components/ui/button';
import Calendar from '@/src/components/calendar';

import {
  IoLocationOutline,
  IoCalendarClearOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { PiDogThin, PiCatThin } from 'react-icons/pi';
import { CiSearch } from 'react-icons/ci';
import {
  FaBug,
  FaBacteria,
  FaEye,
  FaPoop,
  FaCrutch,
  FaFaucet,
} from 'react-icons/fa';
import { Cat, Dog } from '../svg';

interface FilterProps {
  location: string;
  calendar: string;
  species: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  calendar: string;
  setCalendar: (date: string) => void;
  species: string;
  setSpecies: (species: string) => void;
}

interface SpeciesItem {
  name: string;
  icon: ReactNode;
}

interface ConcernItem {
  name: string;
  icon: ReactNode;
}

const VetFilter: React.FC<FilterProps> = ({ location, calendar, species }) => {
  const handleToggle = (): void => {
    window.location.href = '/vets/filter';
  };

  return (
    <div className="flex md:flex-row flex-col gap-3">
      <div
        className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
        onClick={handleToggle}
      >
        <IoLocationOutline size="1.2em" />
        <div>{location}</div>
      </div>
      <div
        className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
        onClick={handleToggle}
      >
        <IoCalendarClearOutline size="1.2em" />
        <div>{calendar}</div>
      </div>
      <div
        className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
        onClick={handleToggle}
      >
        {species === 'Dog' ? (
          <Dog size="text-[1.2em]" />
        ) : (
          <Cat size="text-[1.2em]" />
        )}
        <div>{species.toUpperCase()}</div>
      </div>
      <div
        className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300 bg-zinc-950 text-white"
        onClick={handleToggle}
      >
        <IoSettingsOutline size="1.2em" />
        <div>All filters</div>
      </div>
    </div>
  );
};

export const VetFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  calendar,
  setCalendar,
  species,
  setSpecies,
}) => {
  const [concern, setConcern] = useState<string>('Flea and tick');

  const speciesList: SpeciesItem[] = [
    {
      name: 'Dog',
      icon: <PiDogThin size="1.2em" />,
    },
    {
      name: 'Cat',
      icon: <PiCatThin size="1.2em" />,
    },
  ];

  const concerns: ConcernItem[] = [
    {
      name: 'Flea and tick',
      icon: <FaBug size="1.2em" />,
    },
    {
      name: 'Skin and ear infections',
      icon: <FaBacteria size="1.2em" />,
    },
    {
      name: 'Urinary problems',
      icon: <FaFaucet size="1.2em" />,
    },
    {
      name: 'Eye issues',
      icon: <FaEye size="1.2em" />,
    },
    {
      name: 'Diarrhea and vomiting',
      icon: <FaPoop size="1.2em" />,
    },
    {
      name: 'Mobility concerns',
      icon: <FaCrutch size="1.2em" />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      backdrop="blur"
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader>Filter</ModalHeader>
        <ModalBody>
          <div className="my-2">
            <div className="text-lg font-bold">Your location</div>
            <div className="relative block my-2">
              <CiSearch
                size="2em"
                className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 right-3"
              />
              <Input placeholder="Type to search" />
            </div>
          </div>

          <Calendar date={calendar} setDate={setCalendar} />

          <div className="my-2">
            <div className="text-lg font-bold">Species</div>
            <div className="flex md:flex-row flex-col flex-wrap gap-2 justify-between my-5">
              {speciesList.map((s, i) => (
                <div
                  key={i}
                  className={
                    'flex flex-row justify-between flex-grow basis-1/2 items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 ' +
                    (species === s.name ? 'border-2' : 'border')
                  }
                  onClick={() => setSpecies(s.name)}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {s.icon}
                    <div>{s.name}</div>
                  </div>
                  <div
                    className={
                      'w-4 h-4 border-black rounded-full ' +
                      (species === s.name ? 'border-4' : 'border')
                    }
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-2">
            <div className="text-lg font-bold">Concerns</div>
            <div className="flex md:flex-row flex-col gap-2 flex-wrap justify-between my-5">
              {concerns.map((c, i) => (
                <div
                  key={i}
                  className={
                    'flex flex-row justify-between flex-grow basis-1/2 items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 ' +
                    (concern === c.name ? 'border-2' : 'border')
                  }
                  onClick={() => setConcern(c.name)}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {c.icon}
                    <div className="text-sm">{c.name}</div>
                  </div>
                  <div
                    className={
                      'w-4 h-4 border-black rounded-full ' +
                      (concern === c.name ? 'border-4' : 'border')
                    }
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-row justify-between items-center gap-2 border-t-1">
          <Button
            text="clear"
            type="default"
            className="w-full"
            onClick={() => onClose(false)}
          />
          <Button
            text="Apply"
            type="default"
            className="w-full"
            onClick={() => onClose(false)}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VetFilter;
