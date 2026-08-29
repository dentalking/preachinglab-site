import type { Landing } from './types';

/**
 * 스페인어 랜딩. `site/es/index.html` 에서 한 글자도 바꾸지 않고 옮겼습니다.
 *
 * **방침·약관이 아직 스페인어로 없습니다.** 푸터가 영어 문서를 가리키고
 * 라벨도 영어로 두는 것은 옛 페이지가 하던 그대로입니다 — 자기 말이 아닌
 * 곳으로 간다는 것이 눈에 보여야 하기 때문입니다. `routes.ts` 의 `HAS_PAGE`
 * 를 보십시오.
 */
export const es: Landing = {
  meta: {
    title: 'Preaching Lab — ¿Cómo se escuchó mi sermón?',
    description:
      '¿Cómo se escuchó mi sermón? Envíe un enlace o una grabación. Ponemos su sermón en texto y le mostramos cómo se escucharon su estructura, su manejo del texto, su comunicación y su aplicación — cada punto citado de lo que usted realmente dijo. No hace falta cámara. Es una reflexión, no una evaluación, y solo lo ve el predicador.',
    ogTitle: 'Preaching Lab',
    ogDescription:
      '¿Cómo se escuchó mi sermón? Un informe de reflexión para el predicador que quiere predicar mejor.',
    ogImageAlt: '¿Cómo se escuchó el sermón del domingo pasado? — Preaching Lab',
  },
  nav: { langLabel: 'Idioma' },
  hero: {
    eyebrow: 'Para el predicador que quiere predicar mejor',
    h1: (
      <>
        ¿Cómo se escuchó
        <br />
        <em>mi sermón</em>?
      </>
    ),
    lede: 'Usted se lo pregunta cada domingo al bajar del púlpito. Envíenos un enlace o una grabación y esta vez le llega una respuesta — con sus propias palabras al lado de cada punto.',
    ledeNote: 'Nadie lo califica y nada se envía a ninguna parte. No hace falta cámara, y el informe solo lo ve usted.',
    ctaPrimary: 'Pruébelo con un sermón',
    ctaSecondary: 'Ver primero un informe real ↓',
    specimenLabel: 'Del sermón',
    specimenQuote:
      '“Por eso siempre debemos permanecer humildes. El lugar donde ayer fui bendecido puede ser el lugar donde hoy soy probado.”',
    anHead: 'Dele a esta idea una acción sobre la cual pararse',
    anWhy:
      'La humildad es un estado del corazón, así que no queda nada por hacer en el momento en que salen del templo. Es la idea más aguda del sermón y es la que cierra de forma más vaga.',
    anFixLabel: 'Pruébelo así',
    anFix:
      '“Haga una sola cosa esta semana. Escriba aquello en lo que usted cree ser mejor que los demás. Ahí es donde va a tropezar.”',
  },
  problem: {
    h2: (
      <>
        Puede predicar veinte años
        <br />y nunca recibir una devolución
      </>
    ),
    paras: [
      'Lo que la gente dice al salir suele detenerse en “fui bendecido”. Es amable, y no le dice nada sobre qué hacer distinto la semana que viene.',
      'Preguntarle a un colega no es más fácil. En ningún presbiterio ni asociación hay un espacio donde se pesen los púlpitos unos a otros.',
      <>
        Así que la mayoría de los predicadores revisan su propia predicación <b>solo con la memoria</b>. La memoria
        guarda lo que salió bien.
      </>,
    ],
  },
  flow: {
    h2: 'Usted solo envía el sermón',
    steps: [
      {
        h3: 'Envíe un video o una grabación desde la aplicación',
        p: 'Sirve un enlace de YouTube, o puede grabar ahí mismo en la aplicación. Puede enviar el culto completo — nosotros encontramos el sermón dentro. Registre el canal de YouTube de su iglesia y la aplicación detectará los sermones nuevos y le preguntará primero.',
      },
      {
        h3: 'Ponemos el sermón en texto',
        p: 'Registre el nombre de su iglesia, su propio nombre y los nombres bíblicos que usa a menudo, y habrá menos que malinterpretar.',
      },
      {
        h3: 'La aplicación le avisa antes de la mañana siguiente',
        p: (
          <>
            Valoraciones, el esquema del sermón, comentarios aspecto por aspecto y algo en qué trabajar para el próximo.
            En papel, tómelo como un <b>archivo A4 con números de página</b>; también puede leerlo en la pantalla más
            grande de una computadora.
          </>
        ),
      },
    ],
  },
  sample: {
    eyebrow: 'De un informe real',
    h2: 'Esto es lo que llega',
    note: (
      <>
        Tomado de un informe real de un pastor que usa Preaching Lab, y <b>traducido del coreano</b> — el culto, la
        iglesia y el predicador son de habla coreana. La iglesia, el nombre, el título del sermón y el pasaje están
        ocultos.
      </>
    ),
    reportMeta: 'Una reunión de oración de miércoles · 47 min',
    reportTitle: 'Título del sermón',
    reportTitleMasked: 'reservado',
    scores: [
      { label: 'La estructura y el hilo del argumento', n: 4, verdict: 'Un punto fuerte' },
      { label: 'La fidelidad al texto bíblico', n: 3, verdict: 'Transmitido con fidelidad' },
      { label: 'La comunicación y el uso del lenguaje', n: 3, verdict: 'Transmitido con fidelidad' },
      { label: 'Cuán concreta es la aplicación', n: 2, verdict: 'Para trabajar primero' },
      { label: 'Imágenes y empatía', n: 4, verdict: 'Un punto fuerte' },
    ],
    scoresNote: (
      <>
        No son calificaciones. Son una manera de elegir dónde poner el esfuerzo en el próximo sermón.{' '}
        <b>El quinto aspecto lo eligió este mismo pastor.</b>
      </>
    ),
    findingHead: 'Déjeles una imagen al bajar del púlpito',
    findingWhy:
      'Antes le dio a la congregación varias escenas que podían ver con los ojos, pero la conclusión termina en abstracciones. La gente se lleva lo último que escuchó.',
    findingQuote:
      '“Mi experiencia, mi testimonio — no son la norma de mi vida. Creo que es la palabra de Dios la roca que nos edifica.”',
    findingFixLabel: 'Pruébelo así',
    findingFix:
      'traiga de vuelta una de las imágenes que ya usó. No necesita una imagen nueva. Basta con devolver a la conclusión una de las escenas que ya les mostró.',
    tail: (
      <>
        Cada punto viene con <b>una cita del sermón mismo</b>. No escribimos nada que no podamos fundamentar. Y lo que
        proponemos en su lugar es <b>una frase que usted podría usar desde el púlpito tal como está</b>.
      </>
    ),
  },
  trend: {
    h2: 'Lo que un solo sermón no puede mostrar',
    lede: 'Cuando los informes se van acumulando, aparecen cosas que un solo sermón nunca revela. Para eso sirve esto de verdad.',
    cards: [
      {
        label: 'Valoraciones con el tiempo',
        line: (
          <>
            <span>Cuán concreta es la aplicación</span> <span className="t-vals">2 → 3 → 4</span>
          </>
        ),
        sub: 'Qué cambió a lo largo de ocho semanas',
      },
      {
        label: 'Una observación que vuelve',
        line: (
          <>
            <b>Tres seguidas</b> — la conclusión termina en abstracciones
          </>
        ),
        sub: 'Lo que ya corrigió, separado de lo que sigue ahí',
      },
      {
        label: 'Medidas del habla',
        line: (
          <>
            “ahora” <span className="t-vals">32 → 11</span>
          </>
        ),
        sub: 'Contado, no juzgado',
      },
    ],
  },
  assure: {
    h2: 'Cosas que conviene decir primero',
    faq: [
      {
        q: '¿Quién puede ver este informe?',
        a: (
          <>
            <b>Solo el predicador.</b> Ni la iglesia, ni el consejo, ni nosotros. Aun cuando la iglesia tenga el
            contrato, está hecho de modo que un pastor principal o un administrador no pueda abrir el informe de otro
            ministro. Mostrárselo a alguien ocurre solo si el predicador lo hace.
          </>
        ),
      },
      {
        q: 'Me inquieta que una IA evalúe un sermón.',
        a: 'Es una reflexión, no una evaluación. No emitimos juicios teológicos. Donde las tradiciones difieren no declaramos correcta a una parte; solo mostramos con cuánta firmeza el punto se apoya en el texto. El discernimiento final es siempre de quien está en el púlpito.',
      },
      {
        q: '¿Qué pasa con la transcripción de mi sermón?',
        a: 'No se usa para entrenamiento. Usted decide cuánto tiempo se guarda, y la borramos de inmediato si lo pide. Consideramos que un sermón es obra propia del predicador.',
      },
      {
        q: 'Nuestra iglesia no filma el culto.',
        a: (
          <>
            <b>Basta con una grabación.</b> Sirve una nota de voz del teléfono. Eso sí, dónde grabe decide el resultado.
            Una salida de la consola de sonido, o una grabadora cerca del púlpito, es lo más preciso; un teléfono dejado
            al fondo recoge la reverberación y el ruido de la congregación, y el reconocimiento se vuelve borroso. Basta
            con sentarse cerca del frente.
          </>
        ),
      },
      {
        q: '¿Es preciso?',
        a: 'Es reconocimiento de voz, así que habrá errores en el texto. Por eso está hecho para no reprocharle al predicador un error de reconocimiento, y por eso cada punto lleva una cita que usted mismo puede verificar. Un solo punto equivocado y todo el informe deja de ser creíble.',
      },
    ],
  },
  pricing: {
    h2: 'Precio',
    kind: 'note',
    note: 'Este es un período de prueba, así que es gratis. Si empezamos a cobrar se lo diremos antes, y hasta entonces no se cobra nada.',
  },
  apply: {
    eyebrow: 'Pruébelo con un sermón',
    h2: '¿Miramos uno de los suyos?',
    ledes: [
      'Díganos a dónde escribirle y le enviaremos lo necesario para instalar la aplicación. El primer informe corre por nuestra cuenta.',
      <>
        Hoy funciona en <b>Android</b>. Todavía no está listo para iPhone; si nos deja su correo, le avisamos apenas lo
        esté.
      </>,
    ],
    form: {
      name: 'Su nombre',
      namePlaceholder: 'Pastora Ana Díaz',
      church: 'Iglesia',
      churchPlaceholder: 'Iglesia Comunidad de Gracia',
      contact: 'Correo',
      contactPlaceholder: 'pastor@example.com',
      contactHint:
        'Enviamos las instrucciones de la aplicación a esta dirección. Los informes se leen en la aplicación.',
      link: 'Enlace a un video o grabación del sermón',
      linkPlaceholder: 'https://youtu.be/… o un enlace compartido',
      linkHint:
        'Si hay un sermón con el que quiere que empecemos, póngalo aquí. Basta una dirección de YouTube. También puede dejarlo vacío — instale la aplicación y envíe uno desde ahí.',
      goal: 'La predicación a la que apunta, si la tiene en palabras',
      goalPlaceholder: 'p. ej. clara para cualquiera, sin rigidez y fácil de imaginar',
      goalHint: 'Escríbala aquí y la añadimos al informe como un aspecto propio.',
      optional: 'opcional',
      trapLabel: 'Sitio web',
      submit: 'Envíenme la información',
      fillMarked: 'Complete los campos señalados.',
      needEmail: 'Escriba el correo donde recibirá el informe.',
      sending: 'Enviando…',
      received: 'Recibimos su solicitud. Le respondemos dentro de un día.',
      checkInput: 'Revise lo que escribió.',
      humanFailed: 'No pasó la verificación. Espere un momento y vuelva a pulsar.',
      mailFallback: 'No se pudo enviar, así que abrimos su aplicación de correo.',
      mailSubject: '[Solicitud] {name}',
      mailName: 'Nombre',
      mailChurch: 'Iglesia',
      mailEmail: 'Correo',
      mailLink: 'Video del sermón',
      mailGoal: 'La predicación a la que apunta',
    },
    statusNote: (
      <>
        Al pulsar se envía directamente a nosotros. No se abrirá ninguna aplicación de correo. Si prefiere escribirnos
        directamente, <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>.
      </>
    ),
  },
  foot: {
    desc: 'Le ayudamos a poner un sermón en texto y a mirarlo de nuevo. No lo calificamos.',
    fine: (
      <>
        Un informe es una opinión de referencia producida por reconocimiento de voz y análisis de IA. Es un punto de
        partida para conversar, no una base para juzgar. ·{' '}
        <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>
      </>
    ),
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
};
