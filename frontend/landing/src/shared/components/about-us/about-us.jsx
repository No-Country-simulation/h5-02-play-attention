import Image from "next/image";

export function AboutUsSection() {
  return (
    <div className="py-12 px-4 lg:px-20">
      {/* Sección Sobre Nosotros */}
      <section className="max-w-6xl mx-auto py-8">
        <h2 className="text-3xl font-bold text-center text-primary-900 mb-16">
          Sobre Nosotros
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-12 mt-12">
          <div className="md:w-1/2">
            <Image
              src="/about-us.png"
              alt="Niño usando tecnología de neurofeedback"
              width={300}
              height={300}
              className="object-cover w-full"
            />
          </div>
          <div className="md:w-1/2 space-y-4">
            <p className="text-secondary-800">
              Play Attention nació de la colaboración entre científicos de la
              NASA y expertos en neurociencia, con el objetivo de crear una
              herramienta que pudiera ayudar a mejorar la concentración y el
              rendimiento cognitivo.
            </p>
            <p className="text-secondary-800">
              Desde nuestros inicios, nos hemos dedicado a perfeccionar nuestra
              tecnología de neurofeedback para hacerla accesible a personas de
              todas las edades y condiciones. Hoy, Play Attention es utilizado
              por miles de personas en todo el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* Sección Nuestro Equipo */}
      <section className="bg-secondary-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Texto a la izquierda */}
            <div className="md:w-1/2 flex justify-center md:justify-start">
              <div className="max-w-md text-center md:text-left">
                <h2 className="text-3xl font-bold text-primary-900 mb-6">
                  Nuestro Equipo
                </h2>
                <div className="space-y-0">
                  <p className="text-secondary-800">
                    Con más de 25 años de experiencia.
                  </p>
                  <p className="text-secondary-800">Equipo Interdisciplinario</p>
                  <p className="text-secondary-800">
                    Comprometidos a buscar siempre la mejor solución para cada
                    persona.
                  </p>
                </div>
              </div>
            </div>

            {/* Imágenes a la derecha */}
            <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              {/* Imagen 1 - más arriba */}
              <div className="flex flex-col items-center sm:items-start -mt-6 sm:mt-0">
                <Image
                  src="/photo-theam-ML.jpg"
                  alt="Lic. María Lourdes Mazzola Vernengo"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <div className="mt-2 text-center sm:text-left">
                  <h3 className="font-semibold text-primary-900">
                    Lic. María Lourdes Mazzola Vernengo
                  </h3>
                  <p className="text-sm text-secondary-800">
                    Directiva Responsable de DC
                  </p>
                </div>
              </div>

              {/* Imagen 2 - más abajo */}
              <div className="flex flex-col items-center sm:items-start mt-6 sm:mt-12">
                <Image
                  src="/photo-theam-MA.jpg"
                  alt="Lic. Marcela Alegre"
                  width={200}
                  height={200}
                  className="rounded-md"
                />
                <div className="mt-2 text-center sm:text-left">
                  <h3 className="font-semibold text-primary-900">
                    Lic. Marcela Alegre
                  </h3>
                  <p className="text-sm text-secondary-800">
                    Directiva Responsable de DC
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
