from crewai import Task
from textwrap import dedent

class Tasks() :
    def filter_emails_task(agent,emails) : 
        return Task(
        description=dedent(f'''\
            Analyser un lot de courriels provenant d'étudiants demandant des documents administratifs (ex. : attestation scolaire).

            Étapes à suivre :
            1. Identifier le type de document demandé en fonction du contenu du courriel.
            2. Extraire les informations nécessaires du courriel (ex. : nom de l'étudiant, identifiant et tout autre détail requis).
            3. Générer la réponse appropriée avec le document en pièce jointe, si toutes les informations sont valides et suffisantes.

            Veiller à :
            - Ignorer les courriels non liés tels que le contenu promotionnel ou le spam.
            - Répondre uniquement aux demandes valides des étudiants.

            COURRIELS
            ------
            {emails}
        '''),
        agent=agent,
        expected_output="Une liste des courriels filtrés contenant les demandes valides avec les informations extraites."  # Exemple de sortie attendue

    )