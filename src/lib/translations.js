export const t = {
  en: {
    // HeroBanner
    agencyLine: 'David Padilla — State Farm',
    heroTitle: (name) => name ? `Hi ${name}! 👋` : 'Referral Rewards',
    heroSubtitle: 'Refer friends and family to get insurance quotes — and earn gift cards for every completed quote!',

    // TierProgressCard
    currentTier: 'Current Tier',
    totalEarned: 'Total Earned',
    perReferral: '/ referral',
    quotesToNext: (n) => `${n} more quote${n !== 1 ? 's' : ''} to reach`,
    toReach: 'to reach',
    tierNames: { Bronze: 'Bronze', Silver: 'Silver', Gold: 'Gold', Platinum: 'Platinum' },
    platinumMsg: "You've reached Platinum — the highest tier! You earn $30 per referral forever.",
    submitted: 'submitted',
    quoted: 'quoted',

    // ReferralHistoryTable
    yourReferrals: 'Your Referrals',
    noReferrals: 'No referrals yet',
    noReferralsSub: 'Submit your first referral below to start earning!',
    earned: 'earned',
    pendingQuote: 'Pending quote',

    // HowItWorks
    howItWorksTitle: 'How It Works',
    steps: [
      { icon: '📝', title: 'Submit a Referral', desc: "Fill out the form below with your friend's name and contact info." },
      { icon: '📞', title: 'We Reach Out',      desc: 'Our team contacts your friend to schedule a free insurance quote.' },
      { icon: '🎁', title: 'Earn a Gift Card',  desc: 'Once the quote is completed, a gift card is on its way to you!' },
    ],

    // TierBreakdownGrid
    rewardTiers: 'Reward Tiers',
    perReferralShort: 'per referral',
    youAreHere: '← You are here',
    tierRanges: ['1–3 referrals', '4–8 referrals', '9–20 referrals', '21+ referrals'],

    // ReferralForm
    referFriend: 'Refer a Friend',
    referFriendSub: "Fill in their details and we'll take it from there.",
    friendName: "Friend's Full Name *",
    friendPhone: "Friend's Phone Number *",
    friendEmail: "Friend's Email Address (optional)",
    insuranceInterest: 'Insurance Interest',
    insuranceOptional: '(optional)',
    submitBtn: (n) => n === 1 ? 'Submit Referral' : `Submit ${n} Referrals`,
    submittingBtn: 'Submitting…',
    insuranceOptions: ['Auto', 'Home', 'Life', 'Health', 'Business'],
    personLabel: (n) => `Referral ${n}`,
    addSecondPerson: 'Add a Second Person',
    addThirdPerson: 'Add a Third Person',
    optionalReferral: 'Optional referral',
    errName: 'Name is required',
    errPhone: 'Phone number is required',
    errEmail: 'Email address is required',
    errEmailInvalid: 'Enter a valid email',
    errSubmit: 'Something went wrong. Please try again.',
    giftCardDisclaimer: 'Gift cards are awarded only when a referred contact is reachable and completes a quote with our office.',

    // AgentContactCard
    agentTitle: 'State Farm Insurance Agent',

    // ThankYouPage
    thanksTitle: (name) => `Thanks, ${name}! 🎉`,
    thanksSub: 'Your referral has been submitted successfully.',
    referralReceived: 'Referral Received!',
    referralReceivedMsg: "We'll reach out to your friend soon to schedule a free insurance quote. Once the quote is completed, a gift card will be on its way to you!",
    questionsCall: 'Questions? Call David at',
    referAnother: 'Refer Another Friend',

    // ReferPage errors
    invalidLinkTitle: 'Invalid referral link',
    invalidLinkMsg: 'Please use the personalized link your agent sent you.',
    notFoundTitle: 'Customer not found',
    notFoundMsg: "We couldn't find your account. Please contact David directly.",
    questionsCallShort: 'Questions? Call',
  },

  es: {
    // HeroBanner
    agencyLine: 'David Padilla — State Farm',
    heroTitle: (name) => name ? `¡Hola ${name}! 👋` : 'Programa de Referencias',
    heroSubtitle: '¡Refiere a amigos y familiares para cotizar su seguro y gana una tarjeta de regalo por cada una completada!',

    // TierProgressCard
    currentTier: 'Nivel Actual',
    totalEarned: 'Total Ganado',
    perReferral: '/ referido',
    quotesToNext: (n) => `${n} cotización${n !== 1 ? 'es' : ''} más para llegar a`,
    toReach: 'para llegar a',
    tierNames: { Bronze: 'Bronce', Silver: 'Plata', Gold: 'Oro', Platinum: 'Diamante' },
    platinumMsg: '¡Alcanzaste el nivel Diamante — el más alto! Ganas $30 por cada referido para siempre.',
    submitted: 'enviados',
    quoted: 'cotizados',

    // ReferralHistoryTable
    yourReferrals: 'Tus Referidos',
    noReferrals: 'Aún no tienes referidos',
    noReferralsSub: '¡Envía tu primer referido abajo para empezar a ganar!',
    earned: 'ganado',
    pendingQuote: 'Cotización pendiente',

    // HowItWorks
    howItWorksTitle: 'Cómo Funciona',
    steps: [
      { icon: '📝', title: 'Envía un Referido',      desc: 'Completa el formulario con el nombre e información de contacto de tu amigo.' },
      { icon: '📞', title: 'Nosotros Contactamos',   desc: 'Nuestro equipo se comunica con tu amigo para programar una cotización de seguro gratis.' },
      { icon: '🎁', title: 'Gana una Tarjeta de Regalo', desc: '¡Una vez completada la cotización, tu tarjeta de regalo está en camino!' },
    ],

    // TierBreakdownGrid
    rewardTiers: 'Niveles de Recompensa',
    perReferralShort: 'por referido',
    youAreHere: '← Estás aquí',
    tierRanges: ['1–3 referidos', '4–8 referidos', '9–20 referidos', '21+ referidos'],

    // ReferralForm
    referFriend: 'Referir a un Amigo',
    referFriendSub: 'Completa sus datos y nosotros nos encargamos del resto.',
    friendName: 'Nombre Completo del Amigo *',
    friendPhone: 'Número de Teléfono del Amigo *',
    friendEmail: 'Correo Electrónico del Amigo (opcional)',
    insuranceInterest: 'Interés de Seguro',
    insuranceOptional: '(opcional)',
    submitBtn: (n) => n === 1 ? 'Enviar Referido' : `Enviar ${n} Referidos`,
    submittingBtn: 'Enviando…',
    insuranceOptions: ['Auto', 'Hogar', 'Vida', 'Salud', 'Negocio'],
    personLabel: (n) => `Referido ${n}`,
    addSecondPerson: 'Agregar Segunda Persona',
    addThirdPerson: 'Agregar Tercera Persona',
    optionalReferral: 'Referido opcional',
    errName: 'El nombre es requerido',
    errPhone: 'El número de teléfono es requerido',
    errEmail: 'El correo electrónico es requerido',
    errEmailInvalid: 'Ingresa un correo válido',
    errSubmit: 'Algo salió mal. Por favor intenta de nuevo.',
    giftCardDisclaimer: 'Las tarjetas de regalo se otorgan únicamente cuando el contacto referido es localizable y completa una cotización en nuestra oficina.',

    // AgentContactCard
    agentTitle: 'Agente de Seguros State Farm',

    // ThankYouPage
    thanksTitle: (name) => `¡Gracias, ${name}! 🎉`,
    thanksSub: 'Tu referido fue enviado exitosamente.',
    referralReceived: '¡Referido Recibido!',
    referralReceivedMsg: 'Pronto nos comunicaremos con tu amigo para programar una cotización de seguro gratis. ¡Una vez completada la cotización, tu tarjeta de regalo estará en camino!',
    questionsCall: '¿Preguntas? Llama a David al',
    referAnother: 'Referir a Otro Amigo',

    // ReferPage errors
    invalidLinkTitle: 'Enlace de referido inválido',
    invalidLinkMsg: 'Por favor usa el enlace personalizado que te envió tu agente.',
    notFoundTitle: 'Cliente no encontrado',
    notFoundMsg: 'No pudimos encontrar tu cuenta. Por favor contacta a David directamente.',
    questionsCallShort: '¿Preguntas? Llama al',
  },
}
