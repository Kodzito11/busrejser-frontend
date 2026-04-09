import "../../../styles/public/AboutPage.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-top">
        <section className="about-hero card">
          <h1>BusPlanen</h1>
          <p className="about-slogan">Billige ture, dyre minder.</p>

          <div className="about-lead">
            <p>
              Busrejser er ikke et kompromis – det er en smartere måde at rejse på.            </p>

            <p>
              I dag er mange rejser spredt og svære at sammenligne. BusPlanen samler ruter, priser og muligheder ét sted, så du hurtigt kan finde og booke den rigtige tur.
            </p>
            <p>
              Platformen er bygget til at udnytte kapacitet bedre og samle efterspørgsel smartere. Det betyder flere afgange, bedre priser og flere muligheder for at komme afsted.
            </p>
            <p>
              Tag afsted spontant, find nye ruter og kom længere for mindre.
            </p>
            <p>Vi sørger for overblik og enkelhed.</p>
            <p>
              så du kan fokusere på selve oplevelsen!
            </p>
          </div>
        </section>

        <section className="about-benefits card">
          <h2>For dig betyder det:</h2>
          <div className="about-benefits-list">
            <article className="about-benefit-item">
              <h3>Overblik</h3>
              <p>
                Find mulighederne hurtigt, sammenlign tydeligt og få samlet det
                overblik, der gør det lettere at vælge rigtigt.
              </p>
            </article>

            <article className="about-benefit-item">
              <h3>Klare priser</h3>
              <p>
                Se priser og valg tydeligt uden un1dvendig forvirring, så hele
                oplevelsen f1les mere enkel og gennemskuelig.
              </p>
            </article>

            <article className="about-benefit-item">
              <h3>Hurtig booking</h3>
              <p>
                Kom hurtigere videre med færre trin, mindre friktion og en
                bookingoplevelse der føles rolig fra start til slut.
              </p>
            </article>
          </div>
        </section>
      </div>

      <section className="about-story card">
        <div className="section-accent" />
        <h2>Hvorfor BusPlanen?</h2>
        <p>
          Busrejser er ofte rodet, uigennemskuelige og spredt på flere
          platforme. Det g1r det sv1rere end n1dvendigt at finde den rigtige tur.
        </p>
        <p>
          BusPlanen samler rejser, ruter og priser ét sted, så du hurtigere kan
          få overblik og booke uden at skulle lede flere steder.
        </p>
      </section>

      <section className="about-vision card">
        <div className="section-accent" />
        <h2>Vores retning</h2>
        <p>
          BusPlanen er stadig under udvikling, men visionen er klar: en moderne
          platform for busrejser, bygget til at gøre det nemt at tage afsted
          spontant og få mere ud af hver tur.
        </p>
      </section>

      <section className="about-contact card">
        <h2>Kontakt</h2>
        <p>
          Har du spørgsmål eller feedback, er du velkommen til at skrive til os
          på <a href="mailto:kontakt@busplanen.dk">kontakt@busplanen.dk</a>.
        </p>
      </section>
    </div>
  );
}
