## Dead by Daylight Shuffle

Pick a killer or survivor, or randomise one. Then randomise their perks. Can you win without the meta?

## 🛠 Installation

```bash
npm i
npm run dev
```

Next app will run on [http://localhost:3000](http://localhost:3000).

## 🛠 Setting Up Sanity (dbdshuffle)

This project uses Sanity as a backend to manage killers, survivors, and perks.

```bash
cd dbdshuffle
npm i --force
npm run dev
```

Sanity app will run on [http://localhost:3333](http://localhost:3333).
Note: You need to be logged in to Sanity and create a project. Note that while the project includes the schemas, you need access to my project to see the data, Alternatively you can fill in your own data. If you wish to contribute to this project and need access to the official Sanity project, please feel free to contact me.

## 🛠 Setting Up Form

The form is built using Node and is using the [Nodemailer Gmail SMTP](https://www.nodemailer.com/usage/using-gmail/)and [Google's reCAPTCHA](https://developers.google.com/recaptcha/intro). Follow the steps in these guides to fill in the environment variables and you are good to go.

## 🚀 Contributing

If you’d like to contribute, feel free to fork the repository, make changes, and submit a pull request. If you need access to the Sanity project, contact me.

## 📜 License

This project is licensed under the MIT License.
