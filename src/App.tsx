import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  getPortalContent,
  PortalContent,
  remoteDatabaseEnabled,
  submitVisitRequest,
} from "./lib/api";

type IconName =
  | "arrow"
  | "calendar"
  | "camera"
  | "cube"
  | "location"
  | "mail"
  | "menu"
  | "mic"
  | "pause"
  | "play"
  | "quote"
  | "spark"
  | "trophy"
  | "users"
  | "x";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    camera: (
      <>
        <path d="M14.5 5 13 3H8L6.5 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
        <circle cx="10.5" cy="12.5" r="3.5" />
      </>
    ),
    cube: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 7 9 5v10l-9-5V7ZM21 7l-9 5v10l9-5V7Z" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    mic: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" />
      </>
    ),
    pause: (
      <>
        <path d="M9 6v12M15 6v12" />
      </>
    ),
    play: <path d="m9 6 9 6-9 6V6Z" />,
    quote: <path d="M9 11H5a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4M20 11h-4a4 4 0 0 1 4-4v8a4 4 0 0 1-4 4" />,
    spark: (
      <>
        <path d="m12 2 1.5 5.3L19 9l-5.5 1.7L12 16l-1.5-5.3L5 9l5.5-1.7L12 2Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4ZM12 12v5M8 21h8M9 17h6" />
        <path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 4 4.9V20" />
      </>
    ),
    x: <path d="M6 6l12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  );
}

const navItems = [
  ["#proyecto", "El proyecto"],
  ["#museo", "Museo virtual"],
  ["#voces", "Voces"],
  ["#salidas", "Salidas"],
  ["#visitas", "Visitas y eventos"],
  ["#contacto", "Contacto"],
];

function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Restauradores de la Memoria, ir al inicio">
      <span className="brand-mark" aria-hidden="true">
        <span>R</span>
      </span>
      <span className="brand-copy">
        <strong>Restauradores</strong>
        <small>de la Memoria</small>
      </span>
    </a>
  );
}

function ImagePlaceholder({
  label,
  className = "",
  number,
  src,
}: {
  label: string;
  className?: string;
  number?: string;
  src?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (src && !imageFailed) {
    return (
      <div className={`image-placeholder image-placeholder-loaded ${className}`} role="img" aria-label={label}>
        <img src={src} alt={label} loading="lazy" onError={() => setImageFailed(true)} />
        {number && <span className="placeholder-number">{number}</span>}
      </div>
    );
  }

  return (
    <div className={`image-placeholder image-text-fallback ${className}`} role="img" aria-label={label}>
      {number && <span className="placeholder-number">{number}</span>}
      <span className="image-text-kicker">Archivo visual</span>
      <strong>{label}</strong>
      <small>Contenido no disponible</small>
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{children}</p>;
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  light = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-heading ${light ? "section-heading-light" : ""}`}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <a className={`arrow-link ${light ? "arrow-link-light" : ""}`} href={href}>
      <span>{children}</span>
      <Icon name="arrow" size={18} />
    </a>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [activeInterview, setActiveInterview] = useState(0);
  const [activeAframeObject, setActiveAframeObject] = useState(0);
  const [portalContent, setPortalContent] = useState<PortalContent | null>(null);
  const [databaseStatus, setDatabaseStatus] = useState<"loading" | "connected" | "offline">("loading");

  const interviews = [
    {
      topic: "Cátedra de la Paz",
      quote: "El Guateque: especial Cátedra de la Paz",
      person: "Javeriana Estéreo 91.9 FM",
      meta: "Programa El Guateque · 12 de octubre de 2025",
      duration: "Audio en SoundCloud",
      image: "Imagen del especial Cátedra de la Paz",
      audioUrl:
        "https://soundcloud.com/javeriana919fm/el-guateque-12-de-octubre-de-2025-especial-catedra-de-la-paz",
      sourceUrl:
        "https://soundcloud.com/javeriana919fm/el-guateque-12-de-octubre-de-2025-especial-catedra-de-la-paz",
    },
    {
      topic: "Restauradores de la Memoria Histórica",
      quote: "El Guateque: proyectos Restauradores de la Memoria Histórica en escuelas",
      person: "Javeriana Estéreo 91.9 FM",
      meta: "Programa El Guateque · 23 de noviembre de 2025",
      duration: "Audio en SoundCloud",
      image: "Imagen del programa sobre Restauradores de la Memoria",
      audioUrl:
        "https://soundcloud.com/javeriana919fm/el-guateque-23-de-noviembre-de-2025-proyectos-restauradores-de-la-memoria-historica-en-escuelas",
      sourceUrl:
        "https://soundcloud.com/javeriana919fm/el-guateque-23-de-noviembre-de-2025-proyectos-restauradores-de-la-memoria-historica-en-escuelas",
    },
    {
      topic: "Museo Escolar",
      quote: "El Guateque: conversación sobre el museo",
      person: "Javeriana Estéreo 91.9 FM",
      meta: "Programa El Guateque · 22 de marzo de 2026",
      duration: "Audio en SoundCloud",
      image: "Imagen del programa sobre el Museo Escolar",
      audioUrl: "https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo",
      sourceUrl: "https://soundcloud.com/javeriana919fm/22-de-marzo-de-2026-museo",
    },
    {
      topic: "Archivo sonoro",
      quote: "Consulta más conversaciones y memorias en el archivo de El Guateque",
      person: "Javeriana Estéreo 91.9 FM",
      meta: "Archivo El Guateque · 2025",
      duration: "Colección externa",
      image: "Imagen del archivo El Guateque 2025",
      audioUrl: "",
      sourceUrl: "https://javerianaestereo.com/el-guateque/2025",
    },
  ];

  const changeInterview = (direction: number) => {
    setActiveInterview((current) => (current + direction + interviews.length) % interviews.length);
  };

  const aframeObjects = [
    {
      name: "[Nombre del objeto digital 1]",
      file: "/models/objeto-01.glb",
      color: "#df604b",
      description: "[Descripción del objeto, su origen, quién lo utilizó y qué memoria conserva.]",
      credits: "[Estudiantes responsables] · Luma AI · [Fecha]",
    },
    {
      name: "[Nombre del objeto digital 2]",
      file: "/models/objeto-02.glb",
      color: "#d9a63d",
      description: "[Descripción del objeto, su procedencia y su importancia para la comunidad.]",
      credits: "[Estudiantes responsables] · Fotogrametría · [Fecha]",
    },
  ];

  const catalogObjects = portalContent?.objetos_museo?.length
    ? portalContent.objetos_museo.slice(0, 2).map((object, index) => ({
        name: object.nombre,
        file: object.modelo_3d_url,
        color: index === 0 ? "#df604b" : "#d9a63d",
        description: object.descripcion,
        credits: object.creditos,
        category: object.categoria,
      }))
    : aframeObjects.map((object) => ({ ...object, category: "[Categoría]" }));

  useEffect(() => {
    let mounted = true;

    if (!remoteDatabaseEnabled) {
      setDatabaseStatus("offline");
      return () => {
        mounted = false;
      };
    }

    const connectDatabase = async () => {
      try {
        const content = await getPortalContent();
        if (!mounted) return;
        setPortalContent(content);
        setDatabaseStatus("connected");
      } catch {
        if (mounted) setDatabaseStatus("offline");
      }
    };

    void connectDatabase();

    return () => {
      mounted = false;
    };
  }, []);

  const aframePreview = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"><\/script>
    <style>body{margin:0;background:#101728} .hint{position:fixed;left:16px;bottom:14px;color:#c8d0df;font:11px Arial;z-index:2;background:rgba(16,23,40,.8);padding:8px 10px}</style>
  </head>
  <body>
    <div class="hint">Arrastra para mirar · Usa W A S D para moverte</div>
    <a-scene embedded renderer="colorManagement: true; antialias: true" background="color: #101728">
      <a-assets>
        <!-- Cuando tengas el archivo real:
        <a-asset-item id="modelo" src="${catalogObjects[activeAframeObject]?.file ?? ""}"></a-asset-item>
        -->
      </a-assets>
      <a-entity environment="preset: none"></a-entity>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="20" height="20" color="#202b42"></a-plane>
      <a-cylinder position="0 .28 -4" radius="1.15" height=".55" color="#27334c"></a-cylinder>
      <a-cylinder position="0 .58 -4" radius=".9" height=".08" color="#728dad"></a-cylinder>
      <a-entity position="0 1.65 -4" animation="property: rotation; to: 0 360 0; loop: true; dur: 14000; easing: linear">
        <!-- Sustituye la figura temporal por:
        <a-gltf-model src="#modelo" scale="1 1 1"></a-gltf-model>
        -->
        <a-entity geometry="primitive: dodecahedron; radius: .82" material="color: ${catalogObjects[activeAframeObject]?.color ?? "#df604b"}; metalness: .25; roughness: .45"></a-entity>
      </a-entity>
      <a-text value="OBJETO ${activeAframeObject + 1} - ESPACIO PARA MODELO GLB" align="center" color="#ffffff" width="5" position="0 2.95 -4"></a-text>
      <a-text value="${catalogObjects[activeAframeObject]?.file ?? ""}" align="center" color="#9ba6b9" width="3.5" position="0 .05 -2.65" rotation="-65 0 0"></a-text>
      <a-light type="ambient" color="#8ea3bd" intensity=".65"></a-light>
      <a-light type="point" color="${catalogObjects[activeAframeObject]?.color ?? "#df604b"}" intensity="1.2" position="2 4 0"></a-light>
      <a-sky color="#101728"></a-sky>
      <a-entity position="0 1.6 1.5">
        <a-camera wasd-controls="acceleration: 18" look-controls></a-camera>
      </a-entity>
    </a-scene>
  </body>
</html>`;

  const submitVisitorForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return;

    setFormState("submitting");
    try {
      await submitVisitRequest({
        institucion: String(data.get("institucion") ?? ""),
        correo_contacto: String(data.get("correo_contacto") ?? ""),
        tipo_visita: String(data.get("tipo_visita") ?? "") as "guiada" | "grupo_escolar" | "virtual",
        cantidad_personas: Number(data.get("cantidad_personas")),
        fecha_preferida: String(data.get("fecha_preferida") ?? ""),
        mensaje: String(data.get("mensaje") ?? ""),
      });
      form.reset();
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="site-header">
        <div className="institution-bar">
          <div>
            <img src="/images/institucional/logo-etitc.webp" alt="Escudo de la Escuela Tecnológica Instituto Técnico Central" />
            <span>
              <b>Escuela Tecnológica Instituto Técnico Central</b>
              Institución de formación del equipo RECO
            </span>
          </div>
          <p>Establecimiento Público de Educación Superior · Bogotá D. C.</p>
        </div>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navItems.map(([href, label]) => (
              <a href={href} key={href}>
                {label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#museo">
            Explorar museo
            <Icon name="arrow" size={17} />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "x" : "menu"} />
          </button>
        </div>
        <nav
          className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}
          id="mobile-navigation"
          aria-label="Navegación móvil"
        >
          {navItems.map(([href, label], index) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio">
          <div className="hero-grain" />
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-kicker">
                <span className="pulse-dot" />
                Desarrollado por equipo RECO · ETITC
              </div>
              <h1>
                Recordar es una forma de <em>volver a encontrarnos.</em>
              </h1>
              <p className="hero-intro">
                Un portal para preservar las historias, los objetos y las voces que construyen la memoria del Colegio
                Tom Adams IED.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#museo">
                  Recorrer el museo
                  <Icon name="arrow" />
                </a>
                <a className="button button-ghost" href="#proyecto">
                  Conocer el proyecto
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-label="Composición de imágenes del proyecto">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <ImagePlaceholder
                className="hero-image-main"
                label="Muestra del Museo Escolar de la Memoria"
                src="/images/visitas/museo-escolar-2022.png"
              />
              <ImagePlaceholder
                className="hero-image-small"
                label="Pieza artística de memoria corporal"
                src="/images/objetos/pieza-memoria-corporal.png"
              />
              <div className="hero-stamp">
                <Icon name="spark" />
                <span>Memoria<br />que vive</span>
              </div>
              <span className="hero-caption">Archivo visual · Colegio Tom Adams IED</span>
            </div>
          </div>
          <div className="hero-foot">
            <span>Historias</span><i />
            <span>Patrimonio</span><i />
            <span>Comunidad</span><i />
            <span>Futuro</span>
          </div>
        </section>

        <nav className="section-directory" aria-label="Todas las secciones del portal">
          {[
            ["#inicio", "Inicio"],
            ["#proyecto", "Qué es Restauradores"],
            ["#museo", "Museo Escolar"],
            ["#salidas", "Salidas pedagógicas"],
            ["#fechas", "Fechas conmemorativas"],
            ["#visitas", "Visitas y eventos"],
            ["#reconocimientos", "Reconocimientos"],
            ["#alianzas", "Alianzas"],
            ["#galeria", "Galería multimedia"],
            ["#contacto", "Contacto"],
          ].map(([href, label], index) => (
            <a href={href} key={href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>

        <section className="project section" id="proyecto">
          <div className="container">
            <div className="project-intro">
              <SectionHeading
                eyebrow="01 · Nuestro propósito"
                title="¿Qué es Restauradores de la Memoria?"
              />
              <div className="project-lead">
                <p>
                  Restauradores de la Memoria es una iniciativa del Colegio Tom Adams IED que conecta a estudiantes,
                  docentes y comunidad alrededor del cuidado del patrimonio y la construcción colectiva de memoria.
                </p>
                <p className="content-note">Contenido introductorio de muestra · Reemplazar con el documento institucional.</p>
              </div>
            </div>

            <div className="project-grid">
              <ImagePlaceholder
                className="project-image"
                label="Equipo del Museo Escolar de la Memoria"
                number="01"
                src="/images/visitas/equipo-museo-escolar.png"
              />
              <article className="value-card value-card-dark">
                <span className="value-icon"><Icon name="spark" /></span>
                <p className="value-number">01</p>
                <h3>Nuestra misión</h3>
                <p>[Agregar misión oficial del proyecto y su impacto en la comunidad educativa.]</p>
              </article>
              <article className="value-card value-card-coral">
                <span className="value-icon"><Icon name="users" /></span>
                <p className="value-number">02</p>
                <h3>Una visión compartida</h3>
                <p>[Agregar visión oficial, alcance futuro y objetivos de apropiación social.]</p>
              </article>
              <article className="value-card value-card-paper">
                <p className="value-number">03</p>
                <h3>Trayectoria</h3>
                <div className="timeline">
                  <span><b>[Año]</b> Nace el proyecto</span>
                  <span><b>[Año]</b> Primer museo escolar</span>
                  <span><b>[Año]</b> Experiencia virtual</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="museum section" id="museo">
          <div className="museum-glow" />
          <div className="container">
            <div className="museum-heading">
              <SectionHeading
                eyebrow="02 · Museo Escolar de la Memoria"
                title="Un museo sin paredes."
                intro="Recorre nuestro archivo desde cualquier lugar. Cada objeto guarda una historia; cada historia abre una conversación."
                light
              />
              <div className="museum-instructions">
                <span><b>01</b> Haz clic para entrar</span>
                <span><b>02</b> Usa W A S D para moverte</span>
                <span><b>03</b> Explora cada objeto</span>
              </div>
            </div>

            <div className="immersive-museum">
              <div className="immersive-toolbar">
                <div>
                  <span className="live-dot" />
                  <span>RECORRIDO VIRTUAL · DELIGHTEX</span>
                </div>
                <a href="https://edu.delightex.com/SRH-SUX" target="_blank" rel="noreferrer">
                  Abrir en pantalla completa <Icon name="arrow" size={16} />
                </a>
              </div>
              <iframe
                src="https://edu.delightex.com/SRH-SUX"
                title="Museo Virtual de Restauradores de la Memoria"
                loading="lazy"
                allow="fullscreen; autoplay; accelerometer; gyroscope; xr-spatial-tracking"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div className="immersive-fallback">
                <Icon name="cube" />
                <p>
                  Si el recorrido no carga dentro de la página, puedes
                  <a href="https://edu.delightex.com/SRH-SUX" target="_blank" rel="noreferrer"> abrirlo directamente aquí.</a>
                </p>
              </div>
            </div>

            <div className="aframe-lab">
              <div className="aframe-lab-heading">
                <div>
                  <Eyebrow light>Taller técnico · A‑Frame + Luma AI</Eyebrow>
                  <h3>Laboratorio de objetos digitales</h3>
                  <p>Una escena independiente para probar los modelos fotogramétricos antes de incorporarlos al recorrido completo.</p>
                </div>
                <div className="aframe-lab-badges">
                  <span className="aframe-version">A‑FRAME 1.4 · WEBXR</span>
                  <span className={`database-badge database-${databaseStatus}`}>
                    <i />
                    {databaseStatus === "connected" ? "SUPABASE CONECTADO" : databaseStatus === "loading" ? "CONECTANDO DATOS" : "MODO LOCAL"}
                  </span>
                </div>
              </div>

              <div className="aframe-lab-grid">
                <div className="aframe-preview">
                  <iframe
                    key={activeAframeObject}
                    srcDoc={aframePreview}
                    title={`Vista A-Frame del objeto ${activeAframeObject + 1}`}
                    loading="lazy"
                    sandbox="allow-scripts"
                    allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                  />
                  <span className="aframe-preview-status"><i /> ESCENA A‑FRAME ACTIVA</span>
                </div>

                <div className="aframe-object-panel">
                  <div className="aframe-tabs" role="tablist" aria-label="Objetos digitales">
                    {catalogObjects.map((object, index) => (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={activeAframeObject === index}
                        className={activeAframeObject === index ? "aframe-tab-active" : ""}
                        onClick={() => setActiveAframeObject(index)}
                        key={object.file}
                      >
                        0{index + 1}
                        <span>Objeto digital</span>
                      </button>
                    ))}
                  </div>
                  <div className="aframe-object-info">
                    <p>MODELO FOTOGRAMÉTRICO · GLB</p>
                    <h4>{catalogObjects[activeAframeObject]?.name}</h4>
                    <span>{catalogObjects[activeAframeObject]?.description}</span>
                    <dl>
                      <div><dt>Archivo</dt><dd>{catalogObjects[activeAframeObject]?.file}</dd></div>
                      <div><dt>Créditos</dt><dd>{catalogObjects[activeAframeObject]?.credits}</dd></div>
                    </dl>
                  </div>
                  <div className="aframe-steps">
                    <strong>Cómo añadir el modelo real</strong>
                    <ol>
                      <li>Exporta el objeto desde Luma AI en formato <b>.glb</b>.</li>
                      <li>Guárdalo en <b>public/models</b> o en Supabase Storage.</li>
                      <li>Reemplaza la ruta temporal y activa <b>a-gltf-model</b>.</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="aframe-project-slot">
                <div className="aframe-project-icon"><Icon name="cube" size={32} /></div>
                <div>
                  <p>ESPACIO RESERVADO · PROYECTO A‑PLACE / A‑FRAME</p>
                  <h4>Escena completa del Museo Escolar</h4>
                  <span>Reemplaza el archivo de plantilla ubicado en <b>public/aframe/index.html</b> por la escena final del equipo. La ruta queda separada para evitar conflictos con React y facilitar su publicación en GitHub.</span>
                </div>
                <a href="/aframe/index.html" target="_blank" rel="noreferrer">
                  Abrir plantilla <Icon name="arrow" size={17} />
                </a>
              </div>
            </div>

            <div className="objects-heading">
              <div>
                <Eyebrow light>Colección digital</Eyebrow>
                <h3>Objetos con memoria</h3>
              </div>
              <p>Modelos propios creados con fotogrametría. Completa cada ficha con información, imágenes y créditos.</p>
            </div>

            <div className="objects-grid">
              {catalogObjects.map((object, index) => (
                <article className="object-card" key={`${object.file}-${index}`}>
                  <div className="object-visual">
                    <span className="object-index">0{index + 1}</span>
                    <Icon name="cube" size={56} />
                    <span>Modelo 3D del objeto {index + 1}</span>
                    <small>{object.file}</small>
                  </div>
                  <div className="object-copy">
                    <p className="object-type">Colección · {object.category}</p>
                    <h4>{object.name}</h4>
                    <p>{object.description}</p>
                    <div className="object-thumbs">
                      <ImagePlaceholder
                        label={index === 0 ? "Pieza artística de memoria corporal" : "Foto 1"}
                        src={index === 0 ? "/images/objetos/pieza-memoria-corporal.png" : "/images/visitas/museo-escolar-2022.png"}
                      />
                      <ImagePlaceholder
                        label="Proceso de creación y memoria"
                        src={index === 0 ? "/images/talleres/taller-memorias-textiles.png" : "/images/galeria/exposicion-escolar.png"}
                      />
                      <ImagePlaceholder
                        label="Exhibición y apropiación comunitaria"
                        src={index === 0 ? "/images/galeria/exposicion-producciones-artisticas.png" : "/images/visitas/recorrido-guiado-estudiantes.png"}
                      />
                    </div>
                    <p className="credits">Créditos · {object.credits}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="voices section" id="voces">
          <div className="container">
            <div className="voices-heading">
              <SectionHeading
                eyebrow="03 · Archivo oral"
                title="Voces que también son memoria."
                intro="Las entrevistas conservan recuerdos que no aparecen en los libros. Aquí reunimos las voces de estudiantes, docentes, familias y habitantes de la comunidad."
              />
              <div className="voices-database-note">
                <Icon name="mic" />
                <span>
                  <strong>Archivo conectado</strong>
                  Cada audio conserva su fecha, tema, fuente, créditos y autorización de publicación.
                </span>
              </div>
            </div>

            <div className="interview-carousel">
              <button
                className="carousel-arrow carousel-arrow-left"
                type="button"
                aria-label="Ver entrevista anterior"
                onClick={() => changeInterview(-1)}
              >
                <Icon name="arrow" />
              </button>
              <div className="featured-interview" aria-live="polite">
              <div className="interview-cover-text">
                <span>0{activeInterview + 1}</span>
                <small>ARCHIVO SONORO</small>
                <strong>{interviews[activeInterview].topic}</strong>
                <p>Javeriana Estéreo<br />91.9 FM</p>
              </div>
              <div className="featured-interview-copy">
                <p className="interview-type">Entrevista {activeInterview + 1} de {interviews.length} · {interviews[activeInterview].topic}</p>
                <h3>{interviews[activeInterview].quote}</h3>
                <p><strong>{interviews[activeInterview].person}</strong> · {interviews[activeInterview].meta}</p>
                {interviews[activeInterview].audioUrl ? (
                  <div className="soundcloud-embed">
                    <iframe
                      title={`Audio de la entrevista ${activeInterview + 1}`}
                      width="100%"
                      height="120"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      loading="lazy"
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(interviews[activeInterview].audioUrl)}&color=%23df604b&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false`}
                    />
                    <a href={interviews[activeInterview].sourceUrl} target="_blank" rel="noreferrer">
                      Abrir audio en SoundCloud <Icon name="arrow" size={15} />
                    </a>
                  </div>
                ) : (
                  <a className="interview-source-card" href={interviews[activeInterview].sourceUrl} target="_blank" rel="noreferrer">
                    <span><Icon name="mic" /></span>
                    <div><small>ARCHIVO DE REFERENCIA</small><strong>Consultar El Guateque 2025 en Javeriana Estéreo</strong></div>
                    <Icon name="arrow" />
                  </a>
                )}
              </div>
              </div>
              <button
                className="carousel-arrow carousel-arrow-right"
                type="button"
                aria-label="Ver entrevista siguiente"
                onClick={() => changeInterview(1)}
              >
                <Icon name="arrow" />
              </button>
            </div>
            <div className="carousel-pagination" aria-label="Seleccionar entrevista">
              {interviews.map((interview, index) => (
                <button
                  className={activeInterview === index ? "carousel-dot-active" : ""}
                  type="button"
                  key={interview.sourceUrl}
                  aria-label={`Mostrar entrevista ${index + 1}`}
                  aria-current={activeInterview === index ? "true" : undefined}
                  onClick={() => {
                    setActiveInterview(index);
                  }}
                >
                  <span>0{index + 1}</span>
                  <i />
                </button>
              ))}
            </div>

            <div className="voices-consent">
              <strong>Publicación responsable</strong>
              <p>Antes de publicar cada entrevista, registra la autorización de uso, define si se mostrará el nombre real o un seudónimo y evita exponer datos sensibles, especialmente de menores de edad.</p>
            </div>
          </div>
        </section>

        <section className="experiences section" id="salidas">
          <div className="container">
            <div className="experiences-heading">
              <SectionHeading
                eyebrow="04 · Aprender recorriendo"
                title="Salidas pedagógicas: la memoria también se camina."
                intro="Encuentros con lugares, archivos y personas que transforman la historia en una experiencia cercana."
              />
              <ArrowLink href="#galeria">Ver toda la galería</ArrowLink>
            </div>

            <div className="trip-grid">
              {[
                {
                  title: "CMR · Centro Histórico de Bogotá",
                  place: "Centro Histórico · Bogotá",
                  meta: "2022 · Recorrido pedagógico",
                  image: "/images/salidas/cmr-centro-historico-2022.png",
                },
                {
                  title: "Visita a exposición de memoria",
                  place: "[Nombre del museo]",
                  meta: "[Fecha] · Visita guiada",
                  image: "/images/salidas/visita-museo.png",
                },
                {
                  title: "Recorrido por lugares de memoria",
                  place: "[Nombre del lugar]",
                  meta: "[Fecha] · Recorrido pedagógico",
                  image: "/images/salidas/recorrido-cementerio.png",
                },
              ].map((trip, index) => (
                <article className={`trip-card trip-${index + 1}`} key={`${trip.title}-${index}`}>
                  <ImagePlaceholder
                    label={`Fotografía de ${trip.title}`}
                    number={`0${index + 1}`}
                    src={trip.image}
                  />
                  <div className="trip-copy">
                    <p>{trip.place}</p>
                    <h3>{trip.title}</h3>
                    <span><Icon name="calendar" size={16} /> {trip.meta}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="commemorations" id="fechas">
          <div className="container commemorations-grid">
            <div className="commemorations-title">
              <Eyebrow>05 · Fechas conmemorativas</Eyebrow>
              <h2>Recordar<br />nos reúne.</h2>
              <p>Acciones artísticas y pedagógicas que permiten reconocer el cuerpo, la paz y la memoria como territorios de encuentro.</p>
            </div>
            <div className="dates-list">
              {[
                {
                  title: "Día de las Manos Rojas",
                  image: "/images/fechas/dia-manos-rojas.png",
                  imageLabel: "Registro de las actividades del Día de las Manos Rojas",
                  dates: [["28", "ABR"], ["31", "AGO"]],
                  copy: "Jornadas de sensibilización, creación colectiva y reflexión alrededor de la paz y las experiencias de la comunidad.",
                },
                {
                  title: "Memorias Corporales",
                  image: "/images/fechas/memorias-corporales.png",
                  imageLabel: "Registro de las actividades de Memorias Corporales",
                  dates: [["09", "ABR"], ["25", "MAY"]],
                  copy: "Acciones performativas para explorar el cuerpo como archivo vivo, territorio de memoria y forma de expresión.",
                },
              ].map((commemoration) => (
                <article className="commemorative-card" key={commemoration.title}>
                  <ImagePlaceholder
                    className="commemorative-image"
                    label={commemoration.imageLabel}
                    src={commemoration.image}
                  />
                  <div className="commemorative-copy">
                    <div className="commemorative-dates">
                      {commemoration.dates.map(([day, month]) => (
                        <span key={`${day}-${month}`}>
                          <strong>{day}</strong>
                          <small>{month}</small>
                        </span>
                      ))}
                    </div>
                    <div>
                      <h3>{commemoration.title}</h3>
                      <p>{commemoration.copy}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="visits-archive section" id="visitas">
          <div className="container">
            <div className="visits-heading">
              <SectionHeading
                eyebrow="06 · Visitas y eventos"
                title="Encuentros que dejan memoria."
                intro="Un registro visual de los colegios, grupos y comunidades que han recorrido el museo y participado en nuestras actividades."
              />
              <p className="placeholder-notice">Archivo visual de recorridos, encuentros y muestras realizadas por el proyecto.</p>
            </div>

            <div className="visit-stories">
              {[
                ["Feria del Museo Escolar de la Memoria", "Feria y encuentro comunitario", "[Fecha] · Evento escolar", "Una jornada para compartir objetos, relatos y procesos del museo.", "/images/visitas/feria-museo-escolar.png"],
                ["Festival de Arte de Kennedy", "Festival de Arte de Kennedy", "[Fecha] · Participación cultural", "Exposición de piezas y producciones artísticas elaboradas por estudiantes.", "/images/visitas/festival-arte-kennedy.png"],
                ["Equipo del Museo Escolar", "Encuentro con la comunidad", "[Fecha] · Museo Escolar de la Memoria", "El equipo comparte el trabajo del proyecto con visitantes y participantes.", "/images/visitas/equipo-museo-escolar.png"],
                ["Recorrido guiado con estudiantes", "Visita pedagógica al Museo Escolar", "[Fecha] · Recorrido guiado", "Estudiantes conocen el proceso y dialogan alrededor de las piezas de memoria.", "/images/visitas/recorrido-guiado-estudiantes.png"],
                ["Museo Escolar de la Memoria 2022", "Muestra escolar de memoria", "2022 · Exposición escolar", "Presentación de objetos, relatos y producciones elaboradas por la comunidad educativa.", "/images/visitas/museo-escolar-2022.png"],
              ].map(([image, title, meta, description, src], index) => (
                <article className={`visit-story-card visit-story-${index + 1}`} key={title + index}>
                  <ImagePlaceholder label={image} number={`0${index + 1}`} src={src || undefined} />
                  <div className="visit-story-copy">
                    <p>{meta}</p>
                    <h3>{title}</h3>
                    {description && <span>{description}</span>}
                  </div>
                </article>
              ))}
            </div>

            <div className="visit-archive-note">
              <Icon name="camera" />
              <div>
                <strong>Archivo de visitas y eventos</strong>
                <p>Esta sección puede obtener automáticamente imágenes, fechas, instituciones y descripciones desde las tablas Eventos, Actividades y Evidencias.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="recognition section" id="reconocimientos">
          <div className="container">
            <div className="recognition-grid">
            <div className="recognition-visual">
                <ImagePlaceholder
                  label="Diplomado en Memoria y Verdad del Centro Nacional de Memoria Histórica"
                  src="/images/reconocimientos/cualificacion-docente-2024.png"
                />
                <div className="recognition-seal"><Icon name="trophy" size={32} /><span>Logros que<br />nos inspiran</span></div>
              </div>
              <div className="recognition-copy">
                <SectionHeading eyebrow="07 · Reconocimientos" title="Una labor que deja huella." />
                <blockquote>
                  <Icon name="quote" size={28} />
                  “[Incluir aquí una frase, mención o testimonio que resuma el impacto del proyecto.]”
                </blockquote>
                <div className="awards">
                  {[
                    [
                      "2025",
                      "[Reconocimiento publicado por la Secretaría de Educación de Bogotá]",
                      "Educación Bogotá",
                      "https://x.com/Educacionbogota/status/1902046716477477112",
                    ],
                    [
                      "2025",
                      "[Reconocimiento publicado por Bogotá]",
                      "Bogotá",
                      "https://x.com/Bogota/status/1894407697602080927",
                    ],
                  ].map(([year, title, entity, url]) => (
                    <div className="award-row" key={title}>
                      <span>{year}</span>
                      <div>
                        <strong>{title}</strong>
                        <small>{entity}</small>
                        <a href={url} target="_blank" rel="noreferrer">
                          Ver publicación en X <Icon name="arrow" size={14} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="recognition-cards">
              {[
                ["Carta del Centro Nacional de Memoria Histórica", "Centro Nacional de Memoria Histórica", "/images/reconocimientos/carta-cnmh-01.png"],
                ["Reconocimiento institucional del CNMH", "Centro Nacional de Memoria Histórica", "/images/reconocimientos/carta-cnmh-02.png"],
                ["Entornos Escolares Inspiradores", "Reconocimiento institucional", "/images/reconocimientos/entornos-escolares-inspiradores.png"],
              ].map(([title, entity, image], index) => (
                <article key={`${title}-${index}`}>
                  <ImagePlaceholder
                    label={image ? title : "Diploma, premio o registro del reconocimiento pendiente"}
                    number={`0${index + 1}`}
                    src={image || undefined}
                  />
                  <p>{entity}</p>
                  <h3>{title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="partners section" id="alianzas">
          <div className="container">
            <SectionHeading
              eyebrow="08 · Alianzas institucionales"
              title="La memoria se construye en compañía."
              intro="Organizaciones que respaldan el aprendizaje, la cultura y la preservación de nuestro patrimonio."
            />
            <ImagePlaceholder
              className="alliances-overview"
              label="Composición de alianzas interinstitucionales del proyecto"
              src="/images/aliados/alianzas-interinstitucionales.png"
            />
            <div className="partner-grid">
              {[
                ["MNC", "Museo Nacional de Colombia", "Patrimonio y cultura"],
                ["CMPR", "Centro de Memoria, Paz y Reconciliación", "Memoria y ciudadanía"],
                ["CNMH", "Centro Nacional de Memoria Histórica", "Formación y acompañamiento"],
                ["SED", "Secretaría de Educación de Bogotá", "Educación pública"],
              ].map(([short, name, role]) => (
                <div className="partner-placeholder" key={short}>
                  <span>{short}</span>
                  <strong>{name}</strong>
                  <small>{role}</small>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="gallery section" id="galeria">
          <div className="container">
            <div className="gallery-heading">
              <SectionHeading eyebrow="09 · Archivo vivo" title="Galería multimedia" />
              <p>Imágenes, voces y momentos que cuentan nuestro proceso.</p>
            </div>
            <div className="gallery-grid">
              <ImagePlaceholder
                className="gallery-tall"
                label="Exposición de producciones artísticas de memoria"
                number="01"
                src="/images/galeria/exposicion-producciones-artisticas.png"
              />
              <ImagePlaceholder
                label="Taller de archivo y memoria"
                number="02"
                src="/images/talleres/taller-archivo-memoria.png"
              />
              <ImagePlaceholder
                label="Taller de memorias textiles"
                number="03"
                src="/images/talleres/taller-memorias-textiles.png"
              />
              <ImagePlaceholder
                label="Exposición escolar en las instalaciones del colegio"
                number="04"
                src="/images/galeria/exposicion-escolar.png"
              />
              <ImagePlaceholder
                label="Encuentro de la comunidad alrededor de la memoria"
                number="05"
                src="/images/galeria/encuentro-comunidad.png"
              />
              <div className="media-placeholder video-placeholder video-real">
                <video controls preload="metadata">
                  <source src="/aframe/assets/videos/historia-colombiana.mp4" type="video/mp4" />
                  Tu navegador no puede reproducir este video.
                </video>
                <div><small>VIDEO</small><strong>Historia colombiana</strong></div>
              </div>
              <a
                className="media-placeholder audio-placeholder"
                href="https://soundcloud.com/javeriana919fm/el-guateque-23-de-noviembre-de-2025-proyectos-restauradores-de-la-memoria-historica-en-escuelas"
                target="_blank"
                rel="noreferrer"
                aria-label="Escuchar especial de Restauradores de la Memoria en SoundCloud"
              >
                <div className="waveform">{Array.from({ length: 22 }, (_, i) => <i key={i} />)}</div>
                <div><small>AUDIO · JAVERIANA ESTÉREO</small><strong>Restauradores de la Memoria Histórica en escuelas</strong></div>
              </a>
            </div>
          </div>
        </section>

        <section className="institution section" id="institucion">
          <div className="container institution-grid">
            <div className="institution-visual">
              <ImagePlaceholder
                className="institution-campus"
                label="Sede histórica de la Escuela Tecnológica Instituto Técnico Central"
                src="/images/institucional/sede-itc.webp"
              />
              <ImagePlaceholder
                className="institution-students"
                label="Estudiantes del Instituto Técnico Central en una experiencia tecnológica"
                src="/images/institucional/estudiantes-itc.webp"
              />
              <div className="institution-year">
                <span>ETITC</span>
                <small>Formación<br />técnica y humana</small>
              </div>
            </div>

            <div className="institution-copy">
              <Eyebrow>10 · Identidad institucional</Eyebrow>
              <div className="institution-logo">
                <img src="/images/institucional/logo-etitc.webp" alt="Logo de la Escuela Tecnológica Instituto Técnico Central" />
                <span>
                  <strong>Escuela Tecnológica</strong>
                  Instituto Técnico Central
                </span>
              </div>
              <h2>La formación técnica también construye memoria.</h2>
              <p>
                Este portal es una propuesta desarrollada por el <strong>equipo RECO</strong>, conformado por estudiantes
                de la Escuela Tecnológica Instituto Técnico Central, como parte de su proceso de formación en sistemas,
                diseño digital y desarrollo web.
              </p>
              <p>
                Nuestra labor consiste en transformar los contenidos del proyecto <strong>Restauradores de la Memoria
                del Colegio Tom Adams IED</strong> en una experiencia digital accesible, interactiva e inmersiva.
              </p>
              <div className="institution-relationship">
                <div><span>01</span><strong>Institución formadora</strong><p>Escuela Tecnológica Instituto Técnico Central</p></div>
                <div><span>02</span><strong>Equipo desarrollador</strong><p>RECO · Restauradores de Experiencias, Comunidades y Orígenes</p></div>
                <div><span>03</span><strong>Proyecto de memoria</strong><p>Restauradores de la Memoria · Colegio Tom Adams IED</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="team section" id="equipo">
          <div className="container">
            <div className="team-heading">
              <SectionHeading
                eyebrow="11 · Equipo RECO"
                title="El equipo detrás de la experiencia."
                intro="RECO reúne gestión, diseño, creación multimedia y desarrollo web para convertir la memoria en una experiencia viva."
              />
              <span className="team-monogram">RECO<br /><small>EQUIPO</small></span>
            </div>
            <div className="reco-meaning">
              <span className="reco-name">R.E.C.O.</span>
              <p>
                <strong>R</strong>estauradores de <strong>E</strong>xperiencias, <strong>C</strong>omunidades y <strong>O</strong>rígenes
              </p>
              <small>RECO nace de “reconocimiento”: reconocer las historias, las personas y los orígenes que construyen nuestra memoria.</small>
            </div>
            <div className="team-grid">
              <article className="team-card team-card-lead">
                <div className="team-card-top">
                  <span>01</span>
                  <div className="team-avatar" aria-label="Joshua Walteros">
                    <b>JW</b>
                    <small>Gestión de proyecto</small>
                  </div>
                </div>
                <p className="team-role">Líder de proyecto</p>
                <h3>Joshua Walteros</h3>
                <p>Coordina el trabajo del equipo y consolida la propuesta para que cada entrega responda a los requisitos del proyecto Restauradores de la Memoria.</p>
                <div className="team-contributions">
                  <strong>Responsabilidades y aportes</strong>
                  <ul>
                    <li>Organizar el cronograma, las etapas de trabajo y las fechas de entrega.</li>
                    <li>Distribuir responsabilidades y hacer seguimiento al avance de cada integrante.</li>
                    <li>Consolidar la documentación técnica, académica y de presentación.</li>
                    <li>Verificar que el portal, la base de datos y el museo virtual mantengan una misma visión.</li>
                    <li>Coordinar las revisiones y asegurar el cumplimiento de los plazos.</li>
                  </ul>
                </div>
                <div className="team-skills"><span>Gestión</span><span>Cronograma</span><span>Documentación</span></div>
              </article>

              <article className="team-card team-card-design">
                <div className="team-card-top">
                  <span>02</span>
                  <div className="team-avatar" aria-label="Ontibon Reyes">
                    <b>OR</b>
                    <small>Diseño y multimedia</small>
                  </div>
                </div>
                <p className="team-role">Diseñador UX/UI y creador multimedia</p>
                <h3>Ontibon Reyes</h3>
                <p>Define cómo se ve, se organiza y se recorre la experiencia, tanto en el portal web como dentro del Museo Escolar de la Memoria.</p>
                <div className="team-contributions">
                  <strong>Responsabilidades y aportes</strong>
                  <ul>
                    <li>Diseñar la arquitectura de información y la navegación de todas las secciones.</li>
                    <li>Crear la guía de estilo visual: colores, tipografías, jerarquías y componentes.</li>
                    <li>Prototipar la experiencia para móviles, tabletas y computadores.</li>
                    <li>Preparar fotografías, entrevistas, audios, videos y demás material multimedia.</li>
                    <li>Diseñar la experiencia inmersiva y desarrollar la escena interactiva en A‑Frame.</li>
                    <li>Preparar e integrar las piezas 3D del museo y sus fichas visuales.</li>
                  </ul>
                </div>
                <div className="team-skills"><span>UX/UI</span><span>Multimedia</span><span>A‑Frame</span><span>3D</span></div>
              </article>

              <article className="team-card team-card-code">
                <div className="team-card-top">
                  <span>03</span>
                  <div className="team-avatar" aria-label="Martin Palomares">
                    <b>MP</b>
                    <small>Desarrollo Front-End</small>
                  </div>
                </div>
                <p className="team-role">Desarrollador Front-End Lead</p>
                <h3>Martin Palomares</h3>
                <p>Convierte los diseños y prototipos en un sitio funcional, fluido y adaptable, conectando la interfaz con las experiencias interactivas.</p>
                <div className="team-contributions">
                  <strong>Responsabilidades y aportes</strong>
                  <ul>
                    <li>Maquetar la estructura responsive del portal con HTML5 y CSS3.</li>
                    <li>Programar la lógica y las interacciones necesarias con JavaScript.</li>
                    <li>Desarrollar filtros, ventanas modales y validaciones de formularios.</li>
                    <li>Integrar técnicamente el visor 3D y la escena del museo en A‑Frame.</li>
                    <li>Conectar los objetos digitales, contenidos y controles de navegación.</li>
                    <li>Optimizar velocidad de carga, accesibilidad y funcionamiento en distintos dispositivos.</li>
                  </ul>
                </div>
                <div className="team-skills"><span>Front-End</span><span>JavaScript</span><span>Responsive</span><span>Accesibilidad</span></div>
              </article>
            </div>
            <div className="credits-note">
              <span>Créditos de contenido</span>
              <p>Los modelos 3D, fotografías, entrevistas, audios y documentos deberán acreditar individualmente a sus autores, estudiantes responsables, docentes, institución, herramienta utilizada y fecha de creación.</p>
            </div>
          </div>
        </section>

        <section className="contact section" id="contacto">
          <div className="container contact-grid">
            <div className="contact-copy">
              <Eyebrow light>12 · Contacto</Eyebrow>
              <h2>Sigamos construyendo memoria.</h2>
              <p>
                ¿Quieres visitar el museo, compartir una historia o conocer más del proyecto? Escríbenos.
              </p>
              <div className="contact-details">
                <span><Icon name="location" /><b>[Dirección del Colegio Tom Adams IED]</b></span>
                <span><Icon name="mail" /><b>[Correo institucional]</b></span>
              </div>
              <div className="data-note">
                <Icon name="cube" />
                <p>
                  <strong>
                    {databaseStatus === "connected" ? "Base de datos conectada" : databaseStatus === "loading" ? "Conectando con la base de datos" : "Contenido local disponible"}
                  </strong>
                  Visitantes · Eventos · Actividades · Objetos · Exposiciones · Evidencias · Aliados · Reconocimientos
                </p>
              </div>
            </div>
            <form className="contact-form" onSubmit={submitVisitorForm}>
              <div className="form-heading">
                <span>Solicita una visita</span>
                <small>Registro protegido en Supabase</small>
              </div>
              <label>
                <span>Institución o grupo</span>
                <input name="institucion" type="text" maxLength={150} placeholder="Nombre del colegio u organización" required />
              </label>
              <label>
                <span>Correo de contacto</span>
                <input name="correo_contacto" type="email" maxLength={200} placeholder="correo@institucion.edu.co" required />
              </label>
              <label>
                <span>Modalidad de visita</span>
                <select name="tipo_visita" defaultValue="" required>
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="guiada">Visita guiada</option>
                  <option value="grupo_escolar">Grupo escolar</option>
                  <option value="virtual">Recorrido virtual</option>
                </select>
              </label>
              <div className="form-row">
                <label>
                  <span>Número de asistentes</span>
                  <input name="cantidad_personas" type="number" min="1" max="200" placeholder="Ej. 25" required />
                </label>
                <label>
                  <span>Fecha preferida</span>
                  <input name="fecha_preferida" type="date" />
                </label>
              </div>
              <label>
                <span>Información adicional</span>
                <textarea name="mensaje" minLength={5} maxLength={1500} placeholder="Curso, objetivo de la visita y cualquier necesidad de accesibilidad" rows={4} required />
              </label>
              <label className="form-honeypot" aria-hidden="true">
                <span>Sitio web</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
              <button className="button button-coral" type="submit" disabled={formState === "submitting"}>
                {formState === "submitting" ? "Guardando solicitud…" : "Enviar solicitud"} <Icon name="arrow" />
              </button>
              {formState === "success" && (
                <p className="form-message form-message-success" role="status">
                  Solicitud guardada correctamente. El equipo podrá consultarla desde Supabase.
                </p>
              )}
              {formState === "error" && (
                <p className="form-message form-message-error" role="alert">
                  No fue posible guardar la solicitud. Comprueba que ejecutaste `supabase/visit-request-form.sql`.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-inner">
          <Brand />
          <p>
            Proyecto de memoria · Colegio Tom Adams IED<br />
            Desarrollo web · Equipo RECO, ETITC<br />
            Bogotá, Colombia · [Año]
          </p>
          <div className="footer-links">
            <a href="#proyecto">Proyecto</a>
            <a href="#museo">Museo virtual</a>
            <a href="#institucion">Identidad ETITC</a>
            <a href="#galeria">Galería</a>
            <a href="#equipo">Créditos</a>
            <a href="#inicio">Volver arriba ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© [Año] Restauradores de la Memoria</span>
          <span>Equipo RECO · Joshua Walteros · Ontibon Reyes · Martin Palomares</span>
        </div>
      </footer>
    </>
  );
}

export default App;
