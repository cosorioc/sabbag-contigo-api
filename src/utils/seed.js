import "dotenv/config";

import { db } from "../config/firebase.js";

const challenges = [
    {
        id: 1,
        title: "El detalle dulce",
        description:
            "Regálale un dulce o chocolate a alguien de tu equipo y comparte una foto del momento.",
        evidence: "Foto del dulce.",
        requiresEvidence: true,
        active: true,
        order: 1,
    },

    {
        id: 2,
        title: "Carta express",
        description:
            "Escribe a mano una pequeña nota de cariño o agradecimiento para alguien especial.",
        evidence: "Foto de la nota.",
        requiresEvidence: true,
        active: true,
        order: 2,
    },

    {
        id: 3,
        title: "Tu mejor sonrisa",
        description:
            "Regálanos tu mejor sonrisa. Tómate una selfie y comparte toda esa buena energía.",
        evidence: "La selfie.",
        requiresEvidence: true,
        active: true,
        order: 3,
    },

    {
        id: 4,
        title: "El color del amor",
        description:
            "Encuentra un objeto rojo o rosado a tu alrededor y captura una foto llena de color.",
        evidence: "Foto del objeto.",
        requiresEvidence: true,
        active: true,
        order: 4,
    },

    {
        id: 5,
        title: "Tu lugar feliz",
        description:
            "Busca ese lugar de tu trabajo donde te sientes a gusto y comparte una foto del espacio.",
        evidence: "Foto del lugar sin personas.",
        requiresEvidence: true,
        active: true,
        order: 5,
    },

    {
        id: 6,
        title: "El cielo de hoy",
        description:
            "Haz una pausa, mira al cielo y captura una foto del atardecer desde tu oficina o al salir de ella.",
        evidence: "Foto del atardecer.",
        requiresEvidence: true,
        active: true,
        order: 6,
    },

    {
        id: 7,
        title: "Tu bebida favorita",
        description:
            "Disfruta tu café, té o bebida favorita de hoy y comparte una foto de ese pequeño momento.",
        evidence: "Foto de tu bebida.",
        requiresEvidence: true,
        active: true,
        order: 7,
    },

    {
        id: 8,
        title: "Repartiendo ánimo",
        description:
            'Regala un poquito de cariño: dale "me gusta" a 4 fotos de retos que hayan compartido otras personas del grupo.',
        evidence: "No requiere evidencia adicional.",
        requiresEvidence: false,
        active: true,
        order: 8,
    },
];

async function seedChallenges() {
    const batch = db.batch();

    for (const challenge of challenges) {
        const ref = db.collection("challenges").doc(String(challenge.id));

        batch.set(
            ref,
            {
                ...challenge,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                merge: true,
            },
        );
    }

    await batch.commit();

    console.log("8 retos cargados correctamente");

    process.exit(0);
}

seedChallenges().catch((error) => {
    console.error("Error cargando retos:", error);

    process.exit(1);
});
