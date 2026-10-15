import CatalogueFlipbook from '../../components/CatalogueFlipbook/CatalogueFlipbook';

import './Catalogue.css';

const Catalogue = () => {
  return (
    <main className="catalogue-page">

      <section className="catalogue-page__content">

        <div className="catalogue-page__heading">

          <span className="catalogue-page__eyebrow">
            AIROMOTION
          </span>

          <h1>
            Product Catalogue
          </h1>

          <p>
            Explore our smart technology solutions.
          </p>

        </div>


        <CatalogueFlipbook />

      </section>

    </main>
  );
};

export default Catalogue;