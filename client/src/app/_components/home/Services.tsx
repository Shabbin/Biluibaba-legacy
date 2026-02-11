"use client";

import { useState } from "react";
import Link from "next/link";

import Button from "@/src/components/ui/button";

import { FaShoppingCart, FaPaw, FaArrowRight } from "react-icons/fa";
import { LuStethoscope } from "react-icons/lu";

const services = [
  {
    id: 0,
    name: "Petcommerce",
    icon: <FaShoppingCart size="2em" color="white" />,
    description:
      "Cillum ex excepteur non fugiat quis quis aliqua fugiat anim consequat proident. Irure dolore ex pariatur Lorem voluptate nostrud est culpa. Amet ea ea quis consectetur consectetur tempor culpa veniam anim id. Nisi ea sit ullamco laborum consequat et mollit officia velit. Aliqua esse proident culpa labore. Dolore ut voluptate ad incididunt deserunt mollit quis sunt pariatur non do.Consectetur cupidatat occaecat irure mollit ex adipisicing. Est esse cupidatat sit proident irure enim enim nulla adipisicing amet amet eiusmod nostrud esse. Et elit aliquip incididunt velit ex reprehenderit. Sit nisi magna sunt dolore.",
    button: {
      text: "Shop",
      link: "/products",
    },
  },
  {
    id: 1,
    name: "Get A Vet",
    icon: <LuStethoscope size="2em" color="white" />,
    description:
      "Tempor culpa labore voluptate labore aliqua tempor aute exercitation qui laborum voluptate sit exercitation cupidatat. Quis cupidatat quis magna laborum laborum magna excepteur eiusmod nulla id do. Magna veniam ullamco excepteur occaecat nisi consectetur excepteur magna qui nisi voluptate esse adipisicing. Ut ea consequat dolore quis adipisicing nulla quis eu incididunt qui cupidatat occaecat commodo. Deserunt elit quis cillum incididunt in cillum commodo. Occaecat ullamco voluptate nostrud exercitation sit tempor dolore ex amet ea non enim ut amet.Tempor ad commodo incididunt incididunt occaecat minim cupidatat anim nulla adipisicing nulla. Culpa nulla consequat et excepteur quis qui laboris nostrud. Sit Lorem dolor cupidatat excepteur culpa consequat ea.",
    button: {
      text: "Browse Vet",
      link: "/vet",
    },
  },
  {
    id: 2,
    name: "Lost & Found",
    icon: <FaPaw size="2em" color="white" />,
    description:
      "Occaecat eu esse aliquip laborum irure enim aliquip ullamco minim est ea laborum fugiat irure. Ex exercitation aliqua ipsum dolore labore eu minim laboris qui enim id enim officia. Laboris reprehenderit ad proident ipsum consectetur consectetur tempor culpa consectetur elit esse. Excepteur mollit nulla laboris anim eu occaecat elit veniam dolore occaecat aute irure.Lorem ullamco excepteur eiusmod ipsum. Minim cupidatat occaecat non in ut sint laborum aute consectetur quis. Excepteur culpa tempor laboris eiusmod voluptate. Ad et aute consequat nulla et ad fugiat ipsum est aliquip consequat quis. Consequat occaecat qui duis laboris elit labore proident nisi officia culpa nisi. Aute anim minim officia eu exercitation nisi aliqua aute cupidatat adipisicing.",
    button: {
      text: "List/Find Pets",
      link: "/adoptions",
    },
  },
];

const Services = () => {
  const [contentID, setContentID] = useState(0);

  return (
    <div className="bg-zinc-950 py-20 text-white">
      <div className="container mx-auto">
        <div className="flex md:flex-row flex-col gap-10 flex-1 justify-between items-center">
          <div className="basis-1/2">
            <h1 className="text-6xl font-bold mb-14">
              Our Pet Care
              <br /> Services
            </h1>
            {services.map((service) => (
              <div className="mb-10" key={service.id}>
                <div
                  className="flex justify-between cursor-pointer hover:text-neutral-400 transition-all ease-in-out duration-300 mb-10"
                  onClick={() => setContentID(service.id)}
                >
                  <div className="text-3xl">{service.name}</div>
                  <FaArrowRight size="2em" />
                </div>
                <hr />
              </div>
            ))}
          </div>
          <div className="basis-1/2 px-8 py-10 border rounded-3xl flex flex-col justify-between transition-all ease-in-out duration-500 md:mx-0 mx-5">
            <div>
              <div className="flex gap-5 mb-10">
                {services[contentID].icon}
                <div className="text-2xl font-medium">
                  {services[contentID].name}
                </div>
              </div>
              <div className="mb-10 text-xl">
                {services[contentID].description}
              </div>
            </div>

            <div>
              <Link href={services[contentID].button.link}>
                <Button
                  text={services[contentID].button.text}
                  type="default"
                  icon={<FaPaw size="2em" color="white" />}
                  className="py-2"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
