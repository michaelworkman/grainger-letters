import { useEffect, useRef } from "react";
import { places } from "@/data/places";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const placeBounds = L.latLngBounds(
  places.map((place) => [place.lat, place.lng] as [number, number]),
);

const latSpan = Math.max(
  placeBounds.getNorth() - placeBounds.getSouth(),
  1,
);
const lngSpan = Math.max(
  placeBounds.getEast() - placeBounds.getWest(),
  1,
);
const midLatitudeRadians =
  ((placeBounds.getNorth() + placeBounds.getSouth()) / 2) * (Math.PI / 180);
const projectedLngSpan = lngSpan * Math.cos(midLatitudeRadians);
const mobileMapAspectRatio = Math.min(
  1.7,
  Math.max(1.3, projectedLngSpan / latSpan),
);

export function PlacesSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const fitMapToPlaces = (map: L.Map) => {
      const isMobile = window.innerWidth < 640;

      map.fitBounds(placeBounds, {
        paddingTopLeft: L.point(isMobile ? 20 : 40, isMobile ? 20 : 40),
        paddingBottomRight: L.point(isMobile ? 20 : 40, isMobile ? 20 : 40),
      });
    };

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const amberIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:14px;height:14px;background:hsl(37,53%,50%);border:2px solid hsl(60,5%,10%);border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon: amberIcon }).addTo(map);
      marker.bindPopup(
        `<div style="font-family:'Plus Jakarta Sans',sans-serif;max-width:220px;">
          <strong style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;display:block;margin-bottom:4px;">${place.name}</strong>
          <span style="font-family:'Courier Prime',monospace;font-size:11px;color:#5c5c5c;display:block;margin-bottom:6px;">${place.period}</span>
          <p style="font-family:'Lora',serif;font-size:12px;line-height:1.5;color:#1a1a18;margin:0;">${place.note}</p>
        </div>`,
        { maxWidth: 240 }
      );
    });

    fitMapToPlaces(map);

    const handleResize = () => {
      map.invalidateSize();
      fitMapToPlaces(map);
    };

    window.addEventListener("resize", handleResize);
    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener("resize", handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground mb-4 text-center">
          The Places
        </h2>
        <p className="text-center text-mid-gray font-label text-sm mb-8">
          37 locations across four continents, mentioned in the letters
        </p>
        <div
          ref={mapRef}
          className="w-full min-h-[240px] rounded border border-warm-rule sm:min-h-0 sm:h-[600px]"
          style={{ aspectRatio: `${mobileMapAspectRatio.toFixed(2)} / 1` }}
        />
      </div>
    </section>
  );
}
