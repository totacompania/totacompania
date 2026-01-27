import os
import glob

def fix_file(filepath):
    """Fix French text in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    original = content

    # Specific text replacements (displayed text only)
    replacements = [
        # Settings/Admin
        ("'Parametres'", "'Paramètres'"),
        ('"Parametres"', '"Paramètres"'),
        ("Parametres des couleurs", "Paramètres des couleurs"),
        ("Reinitialiser", "Réinitialiser"),
        ("Enregistre !", "Enregistré !"),
        ("visibles en temps reel", "visibles en temps réel"),
        ("foncee du rouge", "foncée du rouge"),
        ("foncee du violet", "foncée du violet"),
        ("Variante foncee", "Variante foncée"),
        ("Selectionner un media", "Sélectionner un média"),
        ("Selectionner des médias", "Sélectionner des médias"),
        ("Selectionner le fichier", "Sélectionner le fichier"),
        ("Selectionner l'image", "Sélectionner l'image"),
        ("Selectionner une image", "Sélectionner une image"),
        ("Telecharger depuis le PC", "Télécharger depuis le PC"),
        ("Telecharger la brochure", "Télécharger la brochure"),
        ("Inscription reussie", "Inscription réussie"),
        ("Site realise avec", "Site réalisé avec"),
        ("'Ateliers Theatre'", "'Ateliers Théâtre'"),
        ('"Ateliers Theatre"', '"Ateliers Théâtre"'),
        ("jeu theatral", "jeu théâtral"),
        ("l'espace scenique", "l'espace scénique"),
        ("quelques seances", "quelques séances"),
        ("sur l'annee", "sur l'année"),
        ("integrer le theatre", "intégrer le théâtre"),
        ("pratique pedagogique", "pratique pédagogique"),
        ("'Mediation culturelle'", "'Médiation culturelle'"),
        ('"Mediation culturelle"', '"Médiation culturelle"'),
        ("Preparation et accompagnement", "Préparation et accompagnement"),
        ("des eleves", "des élèves"),
        ("apres la representation", "après la représentation"),
        ("Le theatre a l'ecole", "Le théâtre à l'école"),
        ("un outil pedagogique", "un outil pédagogique"),
        ("etablissements scolaires", "établissements scolaires"),
        ("ecoles, colleges, lycees", "écoles, collèges, lycées"),
        ("ateliers de theatre adaptes", "ateliers de théâtre adaptés"),
        ("projets pedagogiques", "projets pédagogiques"),
        ("Notre equipe est a votre", "Notre équipe est à votre"),
        ("pour repondre a vos", "pour répondre à vos"),
        ("Respect du groupe et de l'equipe", "Respect du groupe et de l'équipe"),
        ("Plus de 100 amateurs encadres", "Plus de 100 amateurs encadrés"),
        ("par une equipe professionnelle", "par une équipe professionnelle"),
        ("Notre repertoire mele", "Notre répertoire mêle"),
        ("'Ecole de Theatre'", "'École de Théâtre'"),
        ('"Ecole de Theatre"', '"École de Théâtre"'),
        ("'Ecole de theatre'", "'École de théâtre'"),
        ('"Ecole de theatre"', '"École de théâtre"'),
        ("Decouvrir ", "Découvrir "),
        (">Decouvrir<", ">Découvrir<"),
        ("transmet sa passion du theatre", "transmet sa passion du théâtre"),
        ("a travers des ateliers adaptes", "à travers des ateliers adaptés"),
        ("a tous les ages", "à tous les âges"),
        ("dans sa decouverte", "dans sa découverte"),
        ("du jeu theatral", "du jeu théâtral"),
        ("de l expression corporelle", "de l'expression corporelle"),
        ("de la creation collective", "de la création collective"),
        ("a proposer une programmation", "à proposer une programmation"),
        ("de qualite dans", "de qualité dans"),
        ("un monde poétique et enchante", "un monde poétique et enchanté"),
        ("conte musical et ecologique", "conte musical et écologique"),
        ("destine aux plus jeunes", "destiné aux plus jeunes"),
        ("on decouvre les merveilles", "on découvre les merveilles"),
        ("les enfants decouvrent", "les enfants découvrent"),
        ("Editer le media", "Éditer le média"),
        ("Resume du spectacle", "Résumé du spectacle"),
        ("Selectionnez un sujet", "Sélectionnez un sujet"),
        ("label: 'Photos & Medias'", "label: 'Photos & Médias'"),
        ('label: "Photos & Medias"', 'label: "Photos & Médias"'),
        ("Nom / Details", "Nom / Détails"),
        ("Cette adresse email est deja inscrite", "Cette adresse email est déjà inscrite"),
        ("Vous etes deja desinscrit", "Vous êtes déjà désinscrit"),
        ("deja configures", "déjà configurés"),
        ("mis a jour", "mis à jour"),
        ("Logos mis a jour", "Logos mis à jour"),
        ("'Annees d\\'experience'", "'Années d\\'expérience'"),
        ('"Annees d\'experience"', '"Années d\'expérience"'),
        ("Annees d'experience", "Années d'expérience"),
        ("Spectacles en tournee", "Spectacles en tournée"),
        ("Representations/an", "Représentations/an"),
        ("Representations par an", "Représentations par an"),
        ("Amateurs formes", "Amateurs formés"),
        ("Gerez les contenus", "Gérez les contenus"),
        ("affichee sur la page", "affichée sur la page"),
        ("affiches sur la page", "affichés sur la page"),
        ("Citation affichee", "Citation affichée"),
        ("La citation affichee", "La citation affichée"),
        ("Ces chiffres sont affiches", "Ces chiffres sont affichés"),
        ("Modifications enregistrees", "Modifications enregistrées"),
        ("Couleurs reinitialises", "Couleurs réinitialisées"),
        ("Fichier PDF configure", "Fichier PDF configuré"),
        ("mediation culturelle", "médiation culturelle"),
        ("mediatheque ou festival", "médiathèque ou festival"),
        ("label: 'Equipe'", "label: 'Équipe'"),
        ('label: "Equipe"', 'label: "Équipe"'),
        ("'Theatre'", "'Théâtre'"),
        ('"Theatre"', '"Théâtre"'),
        (">Theatre<", ">Théâtre<"),
        ("Initiation au jeu theatral", "Initiation au jeu théâtral"),
        ("souhaitant integrer", "souhaitant intégrer"),
        ("dans leur pratique", "dans leur pratique"),
        ("la representation", "la représentation"),
        ("Ecole, stages enfants", "École, stages enfants"),
        ("Nos spectacles s'adaptent", "Nos spectacles s'adaptent"),
        # Admin pages
        ("label: 'Medias'", "label: 'Médias'"),
        ('label: "Medias"', 'label: "Médias"'),
        ("'Ajouter un groupe a l ecole'", "'Ajouter un groupe à l\\'école'"),
        ('"Ajouter un groupe à l école"', '"Ajouter un groupe à l\'école"'),
        ("Ajouter un groupe a l", "Ajouter un groupe à l'"),
        # More specific fixes
        ("placeholder=\"Ateliers Theatre\"", "placeholder=\"Ateliers Théâtre\""),
        ("placeholder='Ateliers Theatre'", "placeholder='Ateliers Théâtre'"),
        ("value=\"theatre\"", "value=\"theatre\""),  # Keep value unchanged
        (">Theatre</option>", ">Théâtre</option>"),
        # Footer/Navigation
        ("'École de Théâtre'", "'École de Théâtre'"),  # Already correct
        # Scolaires
        ("'Formation enseignants'", "'Formation enseignants'"),  # Already correct
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    # Find all tsx and ts files
    patterns = ['src/**/*.tsx', 'src/**/*.ts']
    fixed = []

    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            # Skip API route files to avoid breaking endpoints
            if '/api/' in filepath and filepath.endswith('route.ts'):
                continue
            if fix_file(filepath):
                fixed.append(filepath)

    print(f"Fixed {len(fixed)} files")
    for f in fixed:
        print(f"  {f}")

if __name__ == '__main__':
    main()
