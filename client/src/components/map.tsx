"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

export default function Map() {
  const position = [23.7382497, 90.3772229];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return loading ? null : (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={true}
      style={{ height: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Shimanto Square</Popup>
      </Marker>
    </MapContainer>
  );
}
