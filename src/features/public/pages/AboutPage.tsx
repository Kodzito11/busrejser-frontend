export default function About() {
  return (
    <div className="page">
      <div className="card">
        <h1>Om os</h1>
        <p className="muted">
          BusPlanen startede som en prototype for at samle administration af busser og faciliteter i ét system.
        </p>

        <h2>Formålet</h2>
        <p>
          Målet er at bygge en enkel platform hvor man kan oprette busser, tilføje faciliteter og senere planlægge ruter og stop.
        </p>

        <h2>Status</h2>
        <p className="muted">
          Lige nu: MVP med backend + database + simpel frontend. Næste: faciliteter på bus + ruter.
        </p>
      </div>
    </div>
  );
}