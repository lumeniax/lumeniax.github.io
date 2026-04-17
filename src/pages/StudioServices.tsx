import {
  ArrowRight,
  Calendar,
  CheckCircle,
  HeartHandshake,
  Lightbulb,
  Search,
  Settings,
  Zap,
} from "lucide-react";
import { Link } from "wouter";

const serviceCategories = [
  {
    id: "presence",
    title: "Présence Digitale",
    icon: "🌐",
    tagline: "Soyez visible là où sont vos clients",
    description:
      "Votre entreprise mérite une vitrine professionnelle. Nous créons des sites web modernes, rapides et optimisés pour convertir vos visiteurs en clients.",
    problem: "Invisible en ligne ou site non professionnel",
    result: "Visibilité 24h/24 et crédibilité renforcée",
    color: "border-blue-500",
    bgColor: "bg-blue-50",
    services: [
      "Sites web responsifs et modernes",
      "E-commerce & boutiques en ligne",
      "Digitalisation des églises & institutions",
      "Portails & plateformes web",
      "Intégrations API & outils tiers",
      "Maintenance & support technique",
      "Optimisation performance & vitesse",
    ],
  },
  {
    id: "contenu",
    title: "Contenu & Design",
    icon: "🎨",
    tagline: "Une image qui inspire confiance et désir",
    description:
      "Du logo au montage vidéo, en passant par la rédaction premium, nous créons les supports visuels et éditoriaux qui racontent votre histoire avec impact.",
    problem: "Communication sans cohérence ni impact visuel",
    result: "Marque forte et contenus qui convertissent",
    color: "border-yellow-500",
    bgColor: "bg-yellow-50",
    services: [
      "Logos & identité visuelle complète",
      "Flyers, brochures et bannières",
      "Présentations PowerPoint premium",
      "Montage vidéo professionnel",
      "Voix off IA multilingues",
      "Infographies & data visualisation",
      "CV optimisés IA & lettres de motivation",
    ],
  },
  {
    id: "redaction",
    title: "Rédaction & Stratégie",
    icon: "📝",
    tagline: "Des mots qui convainquent et des plans qui fonctionnent",
    description:
      "Rédaction professionnelle et stratégique pour vos projets : business plans, propositions, e-books et contenu copywriting orienté conversion.",
    problem: "Difficulté à convaincre partenaires ou clients à l'écrit",
    result: "Documents percutants qui débloquent projets et financements",
    color: "border-green-500",
    bgColor: "bg-green-50",
    services: [
      "Plans d'affaires détaillés",
      "Propositions de projets ONG",
      "E-books et guides professionnels",
      "Copywriting pour sites web",
      "Articles et blogs professionnels",
      "Discours et présentations orales",
      "Rapports & dossiers institutionnels",
    ],
  },
  {
    id: "ia",
    title: "IA & Automatisation",
    icon: "🤖",
    tagline: "Automatisez, optimisez, surpassez vos concurrents",
    description:
      "Exploitez la puissance de l'IA pour automatiser vos processus, améliorer votre visibilité sur Google et gérer vos clients plus efficacement.",
    problem: "Processus manuels lents et absence de visibilité SEO",
    result: "Gain de temps, plus de prospects qualifiés, meilleur ROI",
    color: "border-purple-500",
    bgColor: "bg-purple-50",
    services: [
      "Chatbots IA intelligents",
      "Optimisation SEO avancée",
      "Gestion CRM & relation client",
      "Automatisation des processus",
      "Analyse de données & reporting",
      "Intégration outils IA dans votre workflow",
      "Consulting stratégie digitale",
    ],
  },
  {
    id: "formation",
    title: "Formation & Accompagnement",
    icon: "🎓",
    tagline: "Montez en compétences, prenez votre indépendance",
    description:
      "Formations pratiques en IA, marketing digital et entrepreneuriat, conçues pour les réalités africaines. Du débutant au professionnel.",
    problem: "Équipes ou entrepreneurs non autonomes sur le digital",
    result: "Compétences opérationnelles et leadership digital acquis",
    color: "border-orange-500",
    bgColor: "bg-orange-50",
    services: [
      "Formation IA pratique",
      "Cours marketing digital",
      "Webinaires et ateliers thématiques",
      "Mentorat professionnel personnalisé",
      "Coaching entrepreneurial",
      "Programmes d'apprentissage sur mesure",
      "Certification digitale",
    ],
  },
  {
    id: "entreprises",
    title: "Solutions Entreprises",
    icon: "💼",
    tagline: "L'écosystème digital complet pour votre structure",
    description:
      "Pour les PME, institutions et grandes organisations qui ont besoin d'un partenaire digital de confiance sur le long terme.",
    problem: "Transformation digitale complexe et non coordonnée",
    result: "Écosystème digital unifié, performant et évolutif",
    color: "border-blue-900",
    bgColor: "bg-blue-50",
    services: [
      "Audit digital complet",
      "Stratégie de transformation digitale",
      "Déploiement d'outils collaboratifs",
      "Formation et conduite du changement",
      "Support technique dédié",
      "Partenariat long terme",
      "Reporting et optimisation continue",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    icon: Search,
    title: "Analyse de vos besoins",
    description:
      "Consultation gratuite pour comprendre vos objectifs, vos contraintes et les meilleures opportunités.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Proposition personnalisée",
    description:
      "Devis détaillé, planning clair et solution adaptée à votre budget et vos délais.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Réalisation par notre réseau",
    description:
      "Les experts du réseau Lumeniax exécutent votre projet avec rigueur et professionnalisme.",
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Révisions & livraison",
    description:
      "Ajustements, validations et livraison finale avec formation et support continu.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "À partir de",
    amount: "5 000",
    currency: "FCFA",
    description: "Pour les petits projets et besoins ponctuels",
    features: [
      "CV optimisé IA ou logo simple",
      "Vidéo courte ou flyer promotionnel",
      "Rédaction d'un document professionnel",
      "Support par WhatsApp",
      "1 révision incluse",
    ],
  },
  {
    name: "Professional",
    price: "À partir de",
    amount: "50 000",
    currency: "FCFA",
    description: "Pour les PME, entrepreneurs et porteurs de projets",
    badge: "Populaire",
    highlighted: true,
    features: [
      "Site web complet et responsive",
      "Design graphique & identité visuelle",
      "Vidéos promotionnelles professionnelles",
      "Business plan ou plan marketing",
      "Support prioritaire + formation incluse",
    ],
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    amount: "Personnalisé",
    currency: "",
    description: "Solutions complètes pour structures exigeantes",
    features: [
      "Écosystème digital complet",
      "Chatbots IA & automatisation",
      "Formation d'équipe sur mesure",
      "Partenariat et support dédié 24/7",
      "Consulting stratégique long terme",
    ],
  },
];

export default function StudioServices() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-900 to-black text-white pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl">
            <span className="mb-6 inline-block rounded-full bg-yellow-500/20 px-4 py-1.5 text-sm font-bold text-yellow-400">
              Nos services
            </span>
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Des solutions digitales complètes,{" "}
              <span className="text-yellow-400">orientées résultats</span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gray-200">
              Six pôles d'expertise complémentaires pour couvrir l'intégralité
              de votre transformation digitale, de la présence web à
              l'automatisation IA, en passant par la formation et la stratégie.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/studio/contact"
                className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-8 py-4 font-bold text-blue-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-yellow-400"
              >
                <Calendar className="h-5 w-5" />
                Réserver une consultation gratuite
              </Link>
              <a
                href="https://wa.me/22893392515"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-yellow-500/60 px-8 py-4 font-bold text-yellow-300 transition-all duration-200 hover:border-yellow-500 hover:text-yellow-400"
              >
                WhatsApp direct
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
              Nos 6 pôles d'expertise
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Chaque service est livré par des experts qualifiés de notre
              réseau, coordonnés pour garantir qualité et cohérence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className={`group rounded-2xl border-2 ${category.color} bg-white p-8 shadow-md transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="mb-4 text-5xl">{category.icon}</div>

                <h3 className="mb-1 text-xl font-bold text-blue-900">
                  {category.title}
                </h3>
                <p className="mb-4 text-sm font-semibold text-yellow-600">
                  {category.tagline}
                </p>

                <p className="mb-5 text-sm leading-relaxed text-gray-600">
                  {category.description}
                </p>

                <div className={`${category.bgColor} mb-5 space-y-2 rounded-xl p-4`}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-red-500">
                      AVANT
                    </span>
                    <span className="text-xs text-gray-600">
                      {category.problem}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-xs font-bold text-green-600">
                      APRÈS
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {category.result}
                    </span>
                  </div>
                </div>

                <ul className="mb-6 space-y-2">
                  {category.services.slice(0, 4).map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                      <span className="text-sm text-gray-700">{service}</span>
                    </li>
                  ))}
                  {category.services.length > 4 && (
                    <li className="pl-6 text-xs italic text-gray-400">
                      + {category.services.length - 4} services supplémentaires
                    </li>
                  )}
                </ul>

                <a
                  href="https://wa.me/22893392515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-yellow-600 transition-colors hover:text-yellow-500"
                >
                  Demander un devis <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-1 bg-gradient-to-r from-blue-900 via-yellow-500 to-blue-900" />

      <section className="bg-black py-20 text-white md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-500/20 px-4 py-1.5 text-sm font-bold text-yellow-400">
              Notre processus
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-5xl">
              Comment nous travaillons
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              Une méthode structurée et transparente pour garantir votre succès à
              chaque étape du projet.
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <div className="h-full rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-blue-900 to-blue-800 p-6 text-center transition-all duration-300 hover:border-yellow-500">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500">
                      <Icon className="h-7 w-7 text-blue-900" />
                    </div>
                    <div className="mb-1 text-sm font-bold text-yellow-400">
                      {step.number}
                    </div>
                    <h3 className="mb-3 text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-300">
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="absolute right-[-0.75rem] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-yellow-500 md:flex">
                      <ArrowRight className="h-3 w-3 text-blue-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-blue-900/50 p-6 text-center">
            <p className="text-gray-200">
              <Zap className="mr-2 inline h-4 w-4 text-yellow-400" />
              Réponse garantie sous{" "}
              <strong className="text-yellow-400">24 heures</strong> ·
              Consultation initiale{" "}
              <strong className="text-yellow-400">100% gratuite</strong> · Devis
              sans engagement
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-bold text-yellow-700">
              Tarification
            </span>
            <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-5xl">
              Des tarifs transparents et accessibles
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Adaptés à toutes les tailles de structure, sans frais cachés, avec
              un rapport qualité/prix optimisé.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "scale-105 border-2 border-yellow-500 bg-gradient-to-br from-blue-900 to-blue-800 text-white shadow-2xl"
                    : "border-2 border-gray-200 bg-white text-gray-900 hover:border-yellow-500 hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute left-1/2 top-[-0.75rem] -translate-x-1/2">
                    <span className="rounded-full bg-yellow-500 px-4 py-1 text-xs font-bold text-blue-900 shadow">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <h3
                  className={`mb-2 text-2xl font-bold ${
                    plan.highlighted ? "text-yellow-400" : "text-blue-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mb-5 text-sm ${
                    plan.highlighted ? "text-gray-200" : "text-gray-600"
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span
                    className={`text-xs ${
                      plan.highlighted ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <div className="mt-1 text-4xl font-bold">
                    {plan.amount}
                    {plan.currency && (
                      <span className="ml-2 text-base font-medium">
                        {plan.currency}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle
                        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                          plan.highlighted ? "text-yellow-400" : "text-yellow-500"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/22893392515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full rounded-lg px-4 py-3 text-center font-bold transition-all duration-200 hover:scale-105 ${
                    plan.highlighted
                      ? "bg-yellow-500 text-blue-900 hover:bg-yellow-400"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  Demander un devis
                </a>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border-2 border-blue-900 bg-blue-50 p-6 text-center">
            <p className="font-medium text-blue-900">
              <strong>Note :</strong> Tous nos services incluent une consultation
              gratuite et un devis personnalisé. Les prix sont indicatifs en
              FCFA et s'adaptent à votre contexte spécifique.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-900 to-black py-20 text-white md:py-28">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl">
            Quel est votre prochain projet ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-200">
            Peu importe votre besoin ou votre budget, nous avons une solution.
            Contactez-nous et obtenez une réponse concrète sous 24h.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/studio/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-yellow-500 px-8 py-4 font-bold text-blue-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-yellow-400"
            >
              <Calendar className="h-5 w-5" />
              Réserver un échange gratuit
            </Link>
            <a
              href="https://wa.me/22893392515"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-yellow-500/70 px-8 py-4 font-bold text-yellow-300 transition-all duration-200 hover:border-yellow-500 hover:text-yellow-400"
            >
              WhatsApp : +228 93 39 25 15
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
