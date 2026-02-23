import MapClient from "./MapClient";

export default function Page() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Landit Spot Explorer</h1>
      <MapClient />
    </main>
  );
}
