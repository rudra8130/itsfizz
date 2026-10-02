import Hero from "./components/Hero";

export default function App() {
  return (
    <main>
      <Hero />
      <section className="flex h-screen items-center justify-center bg-neutral-900 text-white">
        <h2 className="text-3xl">Next section</h2>
      </section>
    </main>
  );
}