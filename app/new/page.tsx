"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

const texts: Record<string, string[]> = {
  German: [
    "Guten Tag, ich habe am Freitag bestellt und mit Karte bezahlt. Die Sendungsverfolgung steht noch auf Vorbereitung. Ich brauche das Paket vor Dienstag, weil ich verreise. Bitte sagen Sie mir, ob es das Lager verlassen hat.",
    "Hallo, ich habe die falsche Größe bekommen und der Rücksendeaufkleber funktioniert nicht. Ich habe schon zweimal geschrieben. Bitte schicken Sie mir ein bezahltes Rücksendelabel und einen Ersatz.",
    "Guten Morgen, mein Paket wurde gestern als zugestellt markiert, aber an der Tür war nichts. Der Nachbar hat es nicht angenommen. Bitte prüfen Sie die Lieferung und sagen Sie mir, wie lange eine Erstattung dauert.",
  ],
  French: [
    "Bonjour, j'ai commandé vendredi et payé par carte. Le suivi indique encore en préparation. J'ai besoin du colis avant mardi car je voyage. Pouvez-vous me dire s'il a quitté l'entrepôt ?",
    "Bonjour, j'ai reçu la mauvaise taille et l'étiquette de retour ne fonctionne pas. J'ai déjà écrit deux fois. Merci d'envoyer une étiquette prépayée et un remplacement.",
    "Bonjour, mon colis est marqué livré hier, mais il n'y avait rien à la porte. Le voisin ne l'a pas pris. Merci d'ouvrir une enquête et de me dire quand le remboursement arrive.",
  ],
  Italian: [
    "Buongiorno, ho ordinato venerdì e pagato con carta. Il tracking dice ancora in preparazione. Mi serve il pacco prima di martedì perché parto. Potete dirmi se ha lasciato il magazzino?",
    "Salve, ho ricevuto la taglia sbagliata e l'etichetta di reso non funziona. Ho già scritto due volte. Mandate un reso prepagato e un ricambio.",
    "Buongiorno, il pacco risulta consegnato ieri ma alla porta non c'era nulla. Il vicino non l'ha preso. Aprite un controllo e ditemi quanto serve per il rimborso.",
  ],
  Spanish: [
    "Buenos días, pedí el viernes y pagué con tarjeta. El seguimiento sigue en preparación. Necesito el paquete antes del martes porque viajo. ¿Pueden decirme si ya salió del almacén?",
    "Hola, recibí la talla equivocada y la etiqueta de devolución no funciona. Ya escribí dos veces. Envíen una etiqueta pagada y un reemplazo.",
    "Buenos días, el paquete figura entregado ayer, pero no había nada en la puerta. El vecino no lo recogió. Abran una revisión y díganme cuánto tarda el reembolso.",
  ],
  Greek: [
    "Καλημέρα, παρήγγειλα την Παρασκευή και πλήρωσα με κάρτα. Η παρακολούθηση λέει ακόμη προετοιμασία. Χρειάζομαι το δέμα πριν την Τρίτη γιατί ταξιδεύω. Πείτε μου αν έφυγε από την αποθήκη.",
    "Γεια σας, έλαβα λάθος μέγεθος και η ετικέτα επιστροφής δεν δουλεύει. Έχω γράψει ήδη δύο φορές. Στείλτε ετικέτα πληρωμένη και αντικατάσταση.",
    "Καλημέρα, το δέμα φαίνεται παραδομένο χθες, αλλά στην πόρτα δεν υπήρχε τίποτα. Ο γείτονας δεν το πήρε. Ελέγξτε την παράδοση και πείτε μου πόσο θα πάρει η επιστροφή χρημάτων.",
  ],
};

const englishNotes = [
  "Please write to the customer that we checked the order. A new label will be sent today. If the parcel is not scanned in 48 hours, we will refund the payment.",
  "Please apologise for the delay and explain that the item is back in stock. Offer a prepaid return and a replacement, and ask them to confirm the delivery address.",
  "Please tell the customer we opened a delivery investigation. They will get an update within one working day. They should not order the same item again until then.",
];

function pick(list: string[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function NewAssessment() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("German");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [minutes, setMinutes] = useState("12");
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState("");
  const [candidateLink, setCandidateLink] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [error, setError] = useState("");

  async function createLink() {
    const id = Math.random().toString(36).slice(2, 10);
    const { error: saveError } = await supabase.from("assessments").insert({
      id,
      company,
      position,
      language,
      minutes,
      source1: text1,
      source2: text2,
    });

    if (saveError) {
      setError(saveError.message);
      return;
    }

    const origin = window.location.origin;
    setCandidateLink(origin + "/welcome?id=" + id);
    setReportLink(origin + "/report?id=" + id);
    setReady(true);
    setCopied("");
    setError("");
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
  }

  function generateTexts() {
    setText1(pick(texts[language] || texts.German));
    setText2(pick(englishNotes));
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-semibold text-black">New assessment</h1>

        <label className="mt-8 block text-sm text-black">Company</label>
        <input
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">Position</label>
        <input
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">Language to assess</label>
        <select
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option>German</option>
          <option>French</option>
          <option>Italian</option>
          <option>Spanish</option>
          <option>Greek</option>
        </select>

        <label className="mt-6 block text-sm text-black">Minutes per task</label>
        <select
          className="mt-2 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={minutes}
          onChange={(event) => setMinutes(event.target.value)}
        >
          <option value="8">8</option>
          <option value="12">12</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <button
          onClick={generateTexts}
          className="mt-8 rounded-full border border-black px-6 py-3 text-black"
        >
          Generate texts
        </button>

        <label className="mt-6 block text-sm text-black">
          Text 1, in the selected language, translate into English
        </label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text1}
          onChange={(event) => setText1(event.target.value)}
        />

        <label className="mt-6 block text-sm text-black">
          Text 2, in English, translate into the selected language
        </label>
        <textarea
          className="mt-2 h-28 w-full rounded-xl border border-gray-300 p-3 text-black"
          value={text2}
          onChange={(event) => setText2(event.target.value)}
        />

        <button
          onClick={createLink}
          className="mt-8 rounded-full bg-black px-6 py-3 text-white"
        >
          Create link
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {ready && (
          <div className="mt-6 text-black">
            <p>Candidate link</p>
            <p className="break-all">{candidateLink}</p>
            <button
              onClick={() => copy(candidateLink, "candidate")}
              className="mt-2 text-sm underline"
            >
              {copied === "candidate" ? "Copied" : "Copy candidate link"}
            </button>
            <p className="mt-6">Company report</p>
            <p className="break-all">{reportLink}</p>
            <button
              onClick={() => copy(reportLink, "report")}
              className="mt-2 text-sm underline"
            >
              {copied === "report" ? "Copied" : "Copy report link"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}