import os
import glob

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False

    original = content

    replacements = [
        # Scolaires
        ("l'espace scenique", "l'espace scénique"),
        ("De quelques séances a un", "De quelques séances à un"),
        ("sur l'annee", "sur l'année"),
        ("adapte a vos eleves", "adapté à vos élèves"),
        ("a vos objectifs pedagogiques", "à vos objectifs pédagogiques"),
        # Ateliers
        ("Notre approche pedagogique", "Notre approche pédagogique"),
        # Festivals
        ("Des spectacles adaptes aux", "Des spectacles adaptés aux"),
        # Admin spectacles
        ("Selectionner le dossier PDF", "Sélectionner le dossier PDF"),
        # Admin page
        (">Medias<", ">Médias<"),
        ("mb-1\">Medias", "mb-1\">Médias"),
        # Admin equipe
        (">Editer le membre<", ">Éditer le membre<"),
        ("font-bold\">Editer le membre", "font-bold\">Éditer le membre"),
        # Admin events
        (">Editer l'événement<", ">Éditer l'événement<"),
        ("font-bold\">Editer l'événement", "font-bold\">Éditer l'événement"),
        ("Nouvel evenement", "Nouvel événement"),
        ("Nom de l'evenement", "Nom de l'événement"),
        ("Description de l'evenement", "Description de l'événement"),
        ("Type d'evenement", "Type d'événement"),
        ("Image de l'evenement", "Image de l'événement"),
        ("Publier cet evenement", "Publier cet événement"),
        # Admin partenaires
        (">Editer le partenaire<", ">Éditer le partenaire<"),
        ("font-bold\">Editer le partenaire", "font-bold\">Éditer le partenaire"),
        # Admin settings
        (">Parametres<", ">Paramètres<"),
        ("Settings className=\"w-7 h-7 text-[#844cfc]\" />\n            Parametres", "Settings className=\"w-7 h-7 text-[#844cfc]\" />\n            Paramètres"),
        ("Selectionnez ou uploadez", "Sélectionnez ou uploadez"),
        ("Un bouton de telechargement", "Un bouton de téléchargement"),
        ('title="Apercu"', 'title="Aperçu"'),
        (">Apercu<", ">Aperçu<"),
        # Admin messages
        ("Selectionnez un message", "Sélectionnez un message"),
        # Admin newsletter
        (">Apercu<", ">Aperçu<"),
        # MediaPicker
        ("'un media'", "'un média'"),
        ('"un media"', '"un média"'),
        # General
        ("Editer le", "Éditer le"),
        ("Editer l'", "Éditer l'"),
        ("Editer la", "Éditer la"),
    ]

    for old, new in replacements:
        content = content.replace(old, new)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    patterns = ['src/**/*.tsx', 'src/**/*.ts']
    fixed = []

    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            if '/api/' in filepath and filepath.endswith('route.ts'):
                continue
            if fix_file(filepath):
                fixed.append(filepath)

    print(f"Fixed {len(fixed)} files")
    for f in fixed:
        print(f"  {f}")

if __name__ == '__main__':
    main()
