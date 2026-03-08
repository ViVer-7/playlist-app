## Welcome!
Onze passie ligt niet alleen bij de techniek maar ook bij muziek. De hele
dag door klinkt er heerlijke muziek door de speakers. Om iedereen tevreden te
houden willen wij een Spotify-achtige app laten maken waarbij er een afspeellijst
kan worden samengesteld met muzieknummers. Zo kunnen we iedereen binnen
het bedrijf tevreden houden.

Onze stagiair Angelo is gestart met het project, maar heeft het helaas niet kunnen
afronden. We verwachten van jou dat je het project afmaakt en productie-waardig
oplevert.

## Required Functionality

Make sure the application meets the following core requirements:
- [ ] Login met email en wachtwoord
- [ ] Tonen van een lijst van beschikbare nummers
- [ ] Voeg een nummer toe aan de afspeellijst
- [ ] Verwijder een nummer van de afspeellijst
- [ ] Zoek functionaliteit in beide lijsten

Zou je deze onderdelen kunnen nalopen om te controleren of ze correct werken?
Daarnaast willen we graag een extra feature toevoegen:
- [ ] De API levert aanvullende informatie over de nummers. We zouden graag zien dat deze informatie ook zichtbaar wordt voor de gebruiker, bijvoorbeeld via een pop-up of een aparte detailpagina. Dit mag je naar eigen inzicht vormgeven.

Verder verwachten we het volgende:
- [ ] De software is geschreven in Typescript met gebruik van Angular.
- [ ] Besteed niet meer dan 8 uur aan de opdracht. Als er daarna nog werk te doen is, noteer dit dan in de README, zodat we het kunnen bespreken
- [ ] Dat je de opdracht 1 dag vóór je sollicitatiegesprek zo goed als afgerond hebt, zodat wij deze alvast kunnen bekijken

## Run the application
From the frontend directory, install both the FE and BE packages:

```bash
npm run install-all-packages
```

Run the frontend development server from the frontend directory:

```bash
npm run start-fe
```

Run the backend development server from the frontend directory:

```bash
npm run start-be
```

If you want to run the backend without the delay (See assessment PDF) for easier development:

```bash
npm run start-be-without-delay
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the frontend.\
The backend api runs at [http://localhost:4000](http://localhost:4000)

### Login credentials

**email**: test@test.com
**password**: test


### Api documentation
In the root of the project, you will find **API-docs.yaml**. This will specify how to use the api for this project.\
For easy reading, you can import the file in the [swagger editor](https://editor.swagger.io/)