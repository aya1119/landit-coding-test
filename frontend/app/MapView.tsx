"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet"; 
import type { LeafletEvent, Map as LeafletMap  } from "leaflet";


type Spot = {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
};

function CenterWatcher(props: { onMoveEnd: (lat: number, lng: number) => void }) {
  useMapEvents({
    moveend: (e: LeafletEvent) => {
      const c = e.target.getCenter();
      props.onMoveEnd(c.lat, c.lng);
    },
  });
  return null;
}

// 画像不要のピン（CSSだけで表示）
const pinIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:14px;height:14px;
      background:#2563eb;
      border:2px solid #ffffff;
      border-radius:9999px;
      box-shadow:0 2px 6px rgba(0,0,0,.35);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -8],
});

export default function MapView() {
  const [center, setCenter] = useState({ lat: 35.681236, lng: 139.767125 });
  const [radiusKm, setRadiusKm] = useState(5);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(false);

  // 追加：住所表示用state
  const [centerAddress, setCenterAddress] = useState("住所取得中...");
  const [addrLoading, setAddrLoading] = useState(false);

  // 追加：簡易キャッシュ
  const addrCache = useMemo(() => new Map<string, string>(), []);

  const radiusMeters = useMemo(() => radiusKm * 1000, [radiusKm]);


  // スポット取得（既存）
  useEffect(() => {
    let canceled = false;

    async function run() {
  setLoading(true);
  try {
    const qs = new URLSearchParams({
      lat: String(center.lat),
      lng: String(center.lng),
      radiusKm: String(radiusKm),
    });

    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
    const res = await fetch(`${base}/spots?${qs.toString()}`);

    if (!res.ok) throw new Error(`spots api failed: ${res.status}`);

    const data = await res.json();

    if (!canceled) setSpots(Array.isArray(data?.spots) ? data.spots : []);
  } catch (e) {
    console.error("spots fetch error:", e);
    if (!canceled) setSpots([]);
  } finally {
    if (!canceled) setLoading(false);
  }
}
    run();
    return () => {
      canceled = true;
    };
  }, [center.lat, center.lng, radiusKm]);

  // 追加：逆ジオコーディング関数
  async function fetchCenterAddress(lat: number, lng: number) {
    const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;

    const cached = addrCache.get(key);
    if (cached) {
      setCenterAddress(cached);
      return;
    }

    setAddrLoading(true);

    try {
      const url = new URL(
        "https://nominatim.openstreetmap.org/reverse"
      );

      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lng));

      const res = await fetch(url.toString());
      const data = await res.json();

      const label =
        data?.display_name ??
        `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      addrCache.set(key, label);
      setCenterAddress(label);
    } catch {
      setCenterAddress("住所取得失敗");
    } finally {
      setAddrLoading(false);
    }
  }

  // 追加：中心移動後に住所取得（debounce）
  useEffect(() => {
    const t = setTimeout(() => {
      fetchCenterAddress(center.lat, center.lng);
    }, 300);

    return () => clearTimeout(t);
  }, [center.lat, center.lng]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
      <div className="rounded-lg overflow-hidden border">

        <div className="p-3 flex items-center gap-3 border-b">
          <div className="text-sm">
            中心: {center.lat.toFixed(5)}, {center.lng.toFixed(5)}
          </div>

          {/* 追加：住所表示 */}
          <div className="text-sm">
            住所: {addrLoading ? "取得中..." : centerAddress}
          </div>

          <div className="text-sm">
            半径: {radiusKm} km
          </div>

          <input
            className="ml-auto w-40"
            type="range"
            min={1}
            max={20}
            value={radiusKm}
            onChange={(e) =>
              setRadiusKm(Number(e.target.value))
            }
          />

          <div className="text-sm">
            {loading ? "読み込み中..." : `件数: ${spots.length}`}
          </div>
        </div>

        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: 520, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <CenterWatcher
            onMoveEnd={(lat, lng) =>
              setCenter({ lat, lng })
            }
          />

          <Circle
            center={[center.lat, center.lng]}
            radius={radiusMeters}
          />

      　{spots.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={pinIcon}>
          <Popup>
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm">{s.category}</div>
            <div className="text-sm">{s.address}</div>
          </Popup>
        </Marker>
      ))}
        </MapContainer>
      </div>

      <div className="rounded-lg border p-3 h-[600px] overflow-auto">
        <div className="font-semibold mb-2">スポット一覧</div>

        {spots.length === 0 && !loading && (
          <div className="text-sm text-gray-500">
            該当なし
          </div>
        )}

        <ul className="space-y-2">
          {spots.map((s) => (
            <li key={s.id} className="border rounded p-2">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-gray-600">
                {s.category}
              </div>
              <div className="text-sm text-gray-600">
                {s.address}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

