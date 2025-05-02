## Welcome!
Please see the  **Frontend Assessment.pdf** for all the information about your assessment.
Below is just a quick overview to get you up and running. Good luck!


## Required Functionality

Make sure the application meets the following core requirements:

- [ ] Log in with email and password (API is already available)
- [ ] Display a list of available songs
- [ ] Add songs to a “saved” list
- [ ] Remove songs from the “saved” list
- [ ] Search functionality in both lists
- [ ] Improve the excisting code to modern standards, make it production ready.

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

**email**: test@axxes.com
**password**: test


### Api documentation
In the root of the project, you will find **API-docs.yaml**. This will specify how to use the api for this project.\
For easy reading, you can import the file in the [swagger editor](https://editor.swagger.io/)