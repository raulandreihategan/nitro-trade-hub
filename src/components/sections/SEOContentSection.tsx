
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const SEOContentSection: React.FC = () => {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* SEO Collapsible Content */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="seo-content" className="border rounded-lg overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold text-foreground hover:no-underline bg-muted/50">
              Plataforma Gaming Profesional — Más Información
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
              
              {/* H2 - Servicios */}
              <h2 className="text-xl font-bold text-foreground mt-4 mb-3">
                Servicios de Boosting y Coaching para LoL, Valorant y Fortnite en España
              </h2>
              <p className="mb-4">
                Nitrogames es la plataforma gaming profesional líder en España, ofreciendo servicios de boosting profesional, 
                coaching personalizado y duo queue para los juegos competitivos más populares. Nuestros jugadores verificados 
                y boosters certificados están especializados en League of Legends, Valorant, Fortnite, World of Warcraft, 
                Dota 2 y CS2, garantizando una subida de rango segura y eficiente en la Grieta del Invocador, el competitivo 
                de Valorant o el Arena Mode de Fortnite.
              </p>

              {/* H2 - ELO */}
              <h2 className="text-xl font-bold text-foreground mb-3">
                Mejora tu ELO hoy con Jugadores Profesionales Verificados de Alto Nivel
              </h2>
              <p className="mb-4">
                Cada booster de nuestra plataforma pasa por un riguroso proceso de verificación previa. Contamos con 
                profesionales de alto nivel — jugadores Challenger en LoL, Radiant en Valorant y campeones en Fortnite Arena — 
                que ofrecen un servicio de boost de rango transparente. Recibirás actualizaciones de progreso regulares y 
                puedes optar por la opción de stream para total transparencia durante el proceso de subida de nivel.
              </p>

              {/* H3 - Duo Queue */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Duo Queue y Coaching Online: Aprende las Estrategias de los Expertos
              </h3>
              <p className="mb-4">
                ¿Prefieres jugar con un profesional en lugar de compartir tu cuenta? Nuestro servicio de duo queue te 
                permite escalar posiciones mientras aprendes de primera mano las estrategias, el posicionamiento en mapa 
                y el manejo de agentes o campeones del meta actual. Combina duo play con coaching personalizado para una 
                mejora integral de tu nivel competitivo en cualquier juego.
              </p>

              {/* H3 - Boosting LoL */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Boosting LoL: Subida de Rango con Pros Challenger
              </h3>
              <p className="mb-4">
                League of Legends es uno de nuestros servicios más demandados. Ofrecemos boosting de divisiones, 
                placement matches, farm de maestría y coaching específico para cada rol. Nuestros boosters Challenger 
                utilizan seguridad VPN y modo invisible para proteger tu cuenta durante todo el proceso de ascenso 
                competitivo en la Grieta del Invocador.
              </p>

              {/* H2 - Plataforma Multijuego */}
              <h2 className="text-xl font-bold text-foreground mb-3">
                Plataforma Multijuego de Nitrogames: Tu Hub Seguro de Servicios Premium
              </h2>
              <p className="mb-4">
                A diferencia de otras plataformas que se especializan en un único juego, Nitrogames funciona como un 
                hub gaming integral. Desde un panel de control único puedes gestionar todos tus servicios: boosting en 
                League of Legends, coaching en Valorant, duo queue en Fortnite, Mythic+ en World of Warcraft, subida 
                de MMR en Dota 2 o matchmaking competitivo en CS2. Todo con gestión unificada, historial completo de 
                servicios y seguimiento en tiempo real.
              </p>

              {/* H2 - Seguridad */}
              <h2 className="text-xl font-bold text-foreground mb-3">
                Seguridad Garantizada con VPN y Protección de Cuenta Profesional 24/7
              </h2>
              <p className="mb-4">
                La seguridad de tu cuenta es nuestra prioridad absoluta. Todos nuestros boosters utilizan conexión VPN 
                dedicada, modo invisible y protocolos de protección de cuenta profesionales. Nuestro sistema de 
                prevalidación único confirma la disponibilidad del servicio antes del pago, evitando sorpresas. 
                Además, contamos con soporte 24/7, garantías de servicio y un sistema de reembolso que protege 
                tu inversión en cada momento.
              </p>

              {/* FAQ Section */}
              <h2 className="text-xl font-bold text-foreground mt-6 mb-4">
                Preguntas Frecuentes sobre la Plataforma Gaming Profesional
              </h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-sm font-medium text-foreground">
                    ¿Es seguro contratar un servicio de boosting en Nitrogames?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Sí, la seguridad es nuestra máxima prioridad. Todos nuestros boosters profesionales utilizan 
                    conexión VPN dedicada y modo invisible para proteger tu cuenta. Además, nuestro sistema de 
                    verificación previa garantiza que solo jugadores certificados de alto nivel realicen los servicios. 
                    Contamos con garantías de satisfacción y un sistema de reembolso transparente.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-sm font-medium text-foreground">
                    ¿En qué juegos ofrecéis servicios de coaching profesional?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Ofrecemos coaching profesional personalizado en League of Legends, Valorant, Fortnite, 
                    World of Warcraft, Dota 2 y CS2. Nuestros coaches son jugadores de alto nivel (Challenger, 
                    Radiant, campeones de Arena) que analizan tu gameplay y te ayudan a mejorar en posicionamiento, 
                    mecánicas, draft y estrategia según el meta actual de cada juego.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-sm font-medium text-foreground">
                    ¿Cómo funciona el proceso de pre-validación de disponibilidad?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Nuestro sistema de prevalidación único verifica la disponibilidad de boosters profesionales 
                    antes de que realices el pago. Esto garantiza que un jugador verificado estará disponible 
                    para iniciar tu servicio en el plazo estimado, evitando tiempos de espera innecesarios y 
                    asegurando una experiencia fluida desde el primer momento.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4">
                  <AccordionTrigger className="text-sm font-medium text-foreground">
                    ¿Puedo jugar con el profesional durante el boost?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    ¡Por supuesto! Ofrecemos la opción de duo queue en la mayoría de nuestros servicios. 
                    Jugarás directamente con un profesional verificado, lo que te permite subir de rango 
                    mientras aprendes estrategias avanzadas. También puedes optar por la opción de stream 
                    para ver el progreso en tiempo real con total transparencia.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5">
                  <AccordionTrigger className="text-sm font-medium text-foreground">
                    ¿Qué medidas de seguridad usáis en Valorant o League of Legends?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    Para cada servicio de boosting en Valorant y League of Legends utilizamos conexión VPN 
                    con IP de tu región, modo invisible/offline para evitar detección, horarios de juego 
                    naturales y protocolos anti-ban verificados. Nuestros boosters Challenger y Radiant 
                    conocen todas las medidas de seguridad específicas de cada juego para mantener tu cuenta 
                    completamente protegida durante el proceso de subida de rango.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default SEOContentSection;
