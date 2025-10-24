import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import Input from "@/src/components/ui/input";
import Button from "@/src/components/ui/button";

import Calendar from "@/src/components/calendar";

import {
  IoLocationOutline,
  IoCalendarClearOutline,
  IoSettingsOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { PiDogThin, PiCatThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import {
  FaBug,
  FaBacteria,
  FaEye,
  FaPoop,
  FaCrutch,
  FaFaucet,
} from "react-icons/fa";
import { Cat, Dog } from "../svg";

export default class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toggle: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    return (window.location.href = "/vets/filter");
  }

  render() {
    return (
      <div className="flex md:flex-row flex-col gap-3">
        <div
          className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
          onClick={() => this.handleToggle()}
        >
          <IoLocationOutline size="1.2em" />
          <div>{this.props.location}</div>
        </div>
        <div
          className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
          onClick={() => this.handleToggle()}
        >
          <IoCalendarClearOutline size="1.2em" />
          <div>{this.props.calendar}</div>
        </div>
        <div
          className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300"
          onClick={() => this.handleToggle()}
        >
          {this.props.species === "Dog" ? (
            <Dog size="text-[1.2em]" />
          ) : (
            <Cat size="text-[1.2em]" />
          )}
          <div>{this.props.species.toUpperCase()}</div>
        </div>
        <div
          className="flex flex-row items-center gap-2 border px-4 py-3 rounded-lg hover:shadow-lg cursor-pointer transition-all ease-in-out duration-300 bg-zinc-950 text-white"
          onClick={() => this.handleToggle()}
        >
          <IoSettingsOutline size="1.2em" />
          <div>All filters</div>
        </div>
      </div>
    );
  }
}

class FilterModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      concern: "Flea and tick",
    };

    this.species = [
      {
        name: "Dog",
        icon: <PiDogThin size="1.2em" />,
      },
      {
        name: "Cat",
        icon: <PiCatThin size="1.2em" />,
      },
    ];

    this.concerns = [
      {
        name: "Flea and tick",
        icon: <FaBug size="1.2em" />,
      },
      {
        name: "Skin and ear infections",
        icon: <FaBacteria size="1.2em" />,
      },
      {
        name: "Urinary problems",
        icon: <FaFaucet size="1.2em" />,
      },
      {
        name: "Eye issues",
        icon: <FaEye size="1.2em" />,
      },
      {
        name: "Diarrhea and vomiting",
        icon: <FaPoop size="1.2em" />,
      },
      {
        name: "Mobility concerns",
        icon: <FaCrutch size="1.2em" />,
      },
    ];
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
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

            <Calendar
              date={this.props.calendar}
              setDate={this.props.setCalendar}
            />

            <div className="my-2">
              <div className="text-lg font-bold">Species</div>
              <div className="flex md:flex-row flex-col flex-wrap gap-2 justify-between my-5">
                {this.species.map((s, i) => (
                  <div
                    key={i}
                    className={
                      "flex flex-row justify-between flex-grow basis-1/2 items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 " +
                      (this.props.species === s.name ? "border-2" : "border")
                    }
                    onClick={() => this.props.setSpecies(s.name)}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {s.icon}
                      <div>{s.name}</div>
                    </div>
                    <div
                      className={
                        "w-4 h-4 border-black rounded-full " +
                        (this.props.species === s.name ? "border-4" : "border")
                      }
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-2">
              <div className="text-lg font-bold">Concerns</div>
              <div className="flex md:flex-row flex-col gap-2 flex-wrap justify-between my-5">
                {this.concerns.map((c, i) => (
                  <div
                    key={i}
                    className={
                      "flex flex-row justify-between flex-grow basis-1/2 items-center p-3 border-black rounded-xl cursor-pointer hover:bg-neutral-50 " +
                      (this.state.concern === c.name ? "border-2" : "border")
                    }
                    onClick={() => this.setState({ concern: c.name })}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      {c.icon}
                      <div className="text-sm">{c.name}</div>
                    </div>
                    <div
                      className={
                        "w-4 h-4 border-black rounded-full " +
                        (this.state.concern === c.name ? "border-4" : "border")
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
              onClick={() => this.props.onClose(false)}
            />
            <Button
              text="Apply"
              type="default"
              className="w-full"
              onClick={() => this.props.onClose(false)}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}
