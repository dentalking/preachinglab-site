import type { Landing } from './types';

/**
 * 포르투갈어 랜딩. `site/pt/index.html` 에서 한 글자도 바꾸지 않고 옮겼습니다.
 *
 * 중남미 때문에 늘린 말이고 **브라질이 큰 자리**입니다 — `og:locale` 이
 * `pt_BR` 인 것도 그래서입니다. 방침·약관은 아직 없습니다(`HAS_PAGE`).
 */
export const pt: Landing = {
  meta: {
    title: 'Preaching Lab — Como soou o meu sermão?',
    description:
      'Como soou o meu sermão? Envie um link ou uma gravação. Colocamos seu sermão em texto e mostramos como soaram a estrutura, o trato com o texto, a comunicação e a aplicação — cada ponto citado do que você realmente disse. Não precisa de câmera. É uma reflexão, não uma avaliação, e só o pregador vê.',
    ogTitle: 'Preaching Lab',
    ogDescription: 'Como soou o meu sermão? Um relatório de reflexão para o pregador que quer pregar melhor.',
    ogImageAlt: 'Como soou o sermão do domingo passado? — Preaching Lab',
  },
  nav: { langLabel: 'Idioma', mine: 'Meus relatórios' },
  hero: {
    eyebrow: 'Para o pregador que quer pregar melhor',
    h1: (
      <>
        Como soou
        <br />o <em>meu sermão</em>?
      </>
    ),
    lede: 'Você se pergunta isso toda semana ao descer do púlpito. Envie um link ou uma gravação e desta vez vem uma resposta — com suas próprias palavras ao lado de cada ponto.',
    ledeNote: 'Ninguém está lhe dando nota e nada é enviado a lugar nenhum. Não precisa de câmera, e só você vê o relatório.',
    ctaPrimary: 'Experimente com um sermão',
    ctaSecondary: 'Ver antes um relatório real ↓',
    specimenLabel: 'Do sermão',
    specimenQuote:
      '“Por isso devemos permanecer sempre humildes. O lugar onde ontem fui abençoado pode ser o lugar onde hoje sou provado.”',
    anHead: 'Dê a esta ideia uma ação para se firmar',
    anWhy:
      'A humildade é um estado do coração, então não sobra nada a fazer no momento em que saem do templo. É a ideia mais aguda do sermão e é a que fecha de forma mais vaga.',
    anFixLabel: 'Experimente assim',
    anFix:
      '“Faça uma só coisa esta semana. Escreva aquilo em que você acredita ser melhor que os outros. É ali que você vai tropeçar.”',
  },
  problem: {
    h2: (
      <>
        Você pode pregar vinte anos
        <br />e nunca receber um retorno
      </>
    ),
    paras: [
      'O que as pessoas dizem depois do culto costuma parar em “fui abençoado”. É gentil, e não diz nada sobre o que fazer diferente na semana que vem.',
      'Perguntar a um colega não é mais fácil. Em nenhum presbitério ou associação existe um espaço onde se pesem os púlpitos uns dos outros.',
      <>
        Então a maioria dos pregadores revê a própria pregação <b>só pela memória</b>. A memória guarda o que deu certo.
      </>,
    ],
  },
  flow: {
    h2: 'Você só envia o sermão',
    steps: [
      {
        h3: 'Envie um vídeo ou uma gravação pelo aplicativo',
        p: 'Um link do YouTube serve, ou você pode gravar ali mesmo no aplicativo. Pode enviar o culto inteiro — nós encontramos o sermão dentro dele. Cadastre o canal do YouTube da sua igreja e o aplicativo encontra os sermões novos e pergunta a você primeiro.',
      },
      {
        h3: 'Colocamos o sermão em texto',
        p: 'Cadastre o nome da sua igreja, o seu nome e os nomes bíblicos que você usa com frequência, e haverá menos a ser lido errado.',
      },
      {
        h3: 'O aplicativo avisa antes da manhã seguinte',
        p: (
          <>
            Avaliações, o esboço do sermão, comentários aspecto por aspecto e algo em que trabalhar para o próximo. Em
            papel, leve como um <b>arquivo A4 com números de página</b>; também dá para ler na tela maior de um
            computador.
          </>
        ),
      },
    ],
  },
  sample: {
    eyebrow: 'De um relatório real',
    h2: 'É isto que chega',
    note: (
      <>
        Retirado de um relatório real de um pastor que usa o Preaching Lab, e <b>traduzido do coreano</b> — o culto, a
        igreja e o pregador são de língua coreana. Igreja, nome, título do sermão e passagem estão ocultos.
      </>
    ),
    reportMeta: 'Uma reunião de oração de quarta · 47 min',
    reportTitle: 'Título do sermão',
    reportTitleMasked: 'reservado',
    scores: [
      { label: 'A estrutura e o fio do argumento', n: 4, verdict: 'Um ponto forte' },
      { label: 'A fidelidade ao texto bíblico', n: 3, verdict: 'Transmitido com fidelidade' },
      { label: 'A comunicação e o uso da linguagem', n: 3, verdict: 'Transmitido com fidelidade' },
      { label: 'Quão concreta é a aplicação', n: 2, verdict: 'Para trabalhar primeiro' },
      { label: 'Imagens e empatia', n: 4, verdict: 'Um ponto forte' },
    ],
    scoresNote: (
      <>
        Não são notas. São um jeito de escolher onde colocar o esforço no próximo sermão.{' '}
        <b>O quinto aspecto foi o próprio pastor que escolheu.</b>
      </>
    ),
    findingHead: 'Deixe uma imagem ao descer do púlpito',
    findingWhy:
      'Antes você deu à congregação várias cenas que eles podiam ver com os olhos, mas a conclusão termina em abstrações. As pessoas levam o que ouviram por último.',
    findingQuote:
      '“Minha experiência, meu testemunho — não são a medida da minha vida. Creio que é a palavra de Deus a rocha que nos edifica.”',
    findingFixLabel: 'Experimente assim',
    findingFix:
      'traga de volta uma das imagens que você já usou. Não precisa de uma imagem nova. Basta devolver à conclusão uma das cenas que você já mostrou a eles.',
    tail: (
      <>
        Cada ponto vem com <b>uma citação do próprio sermão</b>. Não escrevemos nada que não possamos fundamentar. E o
        que sugerimos no lugar é <b>uma frase que você poderia usar do púlpito do jeito que está</b>.
      </>
    ),
  },
  trend: {
    h2: 'O que um sermão sozinho não mostra',
    lede: 'Quando os relatórios começam a se acumular, aparecem coisas que um sermão sozinho nunca revela. É para isso que isto serve de verdade.',
    cards: [
      {
        label: 'Avaliações ao longo do tempo',
        line: (
          <>
            <span>Quão concreta é a aplicação</span> <span className="t-vals">2 → 3 → 4</span>
          </>
        ),
        sub: 'O que mudou ao longo de oito semanas',
      },
      {
        label: 'Uma observação que volta',
        line: (
          <>
            <b>Três seguidas</b> — a conclusão termina em abstrações
          </>
        ),
        sub: 'O que você já corrigiu, separado do que ainda está lá',
      },
      {
        label: 'Medidas da fala',
        line: (
          <>
            “agora” <span className="t-vals">32 → 11</span>
          </>
        ),
        sub: 'Contado, não julgado',
      },
    ],
  },
  assure: {
    h2: 'Coisas que vale dizer antes',
    faq: [
      {
        q: 'Quem pode ver este relatório?',
        a: (
          <>
            <b>Só o pregador.</b> Nem a igreja, nem o conselho, nem nós. Mesmo quando a igreja tem o contrato, foi feito
            de modo que um pastor titular ou um administrador não consiga abrir o relatório de outro ministro. Mostrar a
            alguém só acontece se o pregador o fizer.
          </>
        ),
      },
      {
        q: 'Fico incomodado com uma IA avaliando um sermão.',
        a: 'É uma reflexão, não uma avaliação. Não fazemos juízos teológicos. Onde as tradições divergem não declaramos um lado correto; apenas mostramos com que firmeza o ponto se apoia no texto. O discernimento final é sempre de quem está no púlpito.',
      },
      {
        q: 'O que acontece com a transcrição do meu sermão?',
        a: 'Não é usada para treinamento. Você decide por quanto tempo fica guardada, e apagamos na hora se você pedir. Consideramos que um sermão é obra do próprio pregador.',
      },
      {
        q: 'Nossa igreja não filma o culto.',
        a: (
          <>
            <b>Uma gravação basta.</b> Um áudio do celular serve. Só que onde você grava decide o resultado. Uma saída da
            mesa de som, ou um gravador perto do púlpito, é o mais preciso; um celular deixado no fundo capta a
            reverberação e o ruído da congregação, e o reconhecimento fica embaçado. Sentar perto da frente já basta.
          </>
        ),
      },
      {
        q: 'É preciso?',
        a: 'É reconhecimento de fala, então haverá erros no texto. Por isso foi feito para não culpar o pregador por um erro de reconhecimento, e por isso cada ponto traz uma citação que você mesmo pode conferir. Um único ponto errado e o relatório inteiro deixa de ser confiável.',
      },
    ],
  },
  pricing: {
    h2: 'Preço',
    kind: 'note',
    note: 'Este é um período de teste, então é grátis. Se começarmos a cobrar avisamos antes, e até lá nada é cobrado.',
  },
  apply: {
    eyebrow: 'Experimente com um sermão',
    h2: 'Vamos olhar um dos seus?',
    ledes: [
      'Diga para onde escrever e enviamos o que você precisa para instalar o aplicativo. O primeiro relatório é por nossa conta.',
      <>
        Hoje funciona no <b>Android</b>. Ainda não está pronto para iPhone; se você deixar seu e-mail, avisamos assim que
        estiver.
      </>,
    ],
    form: {
      name: 'Seu nome',
      namePlaceholder: 'Pastora Ana Silva',
      church: 'Igreja',
      churchPlaceholder: 'Igreja Comunidade da Graça',
      contact: 'E-mail',
      contactPlaceholder: 'pastor@example.com',
      contactHint: 'Enviamos as instruções do aplicativo para este endereço. Os relatórios você lê no aplicativo.',
      link: 'Link do vídeo ou da gravação do sermão',
      linkPlaceholder: 'https://youtu.be/… ou um link compartilhado',
      linkHint:
        'Se houver um sermão pelo qual você quer que a gente comece, coloque aqui. Um endereço do YouTube basta. Também pode deixar vazio — instale o aplicativo e envie um por lá.',
      goal: 'A pregação que você busca, se tiver em palavras',
      goalPlaceholder: 'ex.: clara para qualquer um acompanhar, sem rigidez e fácil de imaginar',
      goalHint: 'Escreva aqui e acrescentamos ao relatório como um aspecto próprio.',
      optional: 'opcional',
      trapLabel: 'Site',
      submit: 'Me envie as instruções',
      fillMarked: 'Preencha os campos marcados.',
      needEmail: 'Escreva o e-mail onde vai receber o relatório.',
      sending: 'Enviando…',
      received: 'Recebemos seu pedido. Respondemos dentro de um dia.',
      checkInput: 'Confira o que você escreveu.',
      humanFailed: 'A verificação não passou. Espere um instante e clique de novo.',
      mailFallback: 'Não deu para enviar, então abrimos seu aplicativo de e-mail.',
      mailSubject: '[Pedido] {name}',
      mailName: 'Nome',
      mailChurch: 'Igreja',
      mailEmail: 'E-mail',
      mailLink: 'Vídeo do sermão',
      mailGoal: 'A pregação que busca',
    },
    statusNote: (
      <>
        Ao clicar, envia direto para nós. Nenhum aplicativo de e-mail vai abrir. Se preferir escrever direto para nós,{' '}
        <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>.
      </>
    ),
  },
  foot: {
    desc: 'Ajudamos você a colocar um sermão em texto e a olhar de novo para ele. Não damos nota.',
    fine: (
      <>
        Um relatório é uma opinião de referência produzida por reconhecimento de fala e análise de IA. É um ponto de
        partida para conversar, não uma base para julgar. ·{' '}
        <a href="mailto:hello@preachinglab.cloud">hello@preachinglab.cloud</a>
      </>
    ),
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
  },
};
