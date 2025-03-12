
## OpenAI-ChatBot--ReactVite

![Screenshot 2024-09-27 at 15 19 41](https://github.com/user-attachments/assets/3a858fd0-4a58-4151-84da-49e20efc0c13) ![Screenshot 2024-09-27 at 15 20 39](https://github.com/user-attachments/assets/ea510f08-384c-4244-b5cc-ac2daaa60183) ![Screenshot 2024-09-27 at 15 20 56](https://github.com/user-attachments/assets/e7223e1b-799c-4ffe-b41b-0ecbf960b5c7)

AI-Chat-Bot is a complete project example with OpenAI ChatGPT and React-Vite, using OpenAI API, Emoji-Mart, Uuid, and have a Chat History, New Chat Creation features, and deploy on Vercel.

*Please note that at the time you are attempting to access this URL, the free trial OpenAI API key (VITE_OPENAI_API_KEY) has expired. However, during the development of this project, both the project and all associated code were functioning seamlessly. You may use the project folder as it is—simply generate a new VITE_OPENAI_API_KEY from the OpenAI developer site, copy the OPENAI_API_KEY into the .env file, and the project should work as expected.*

**Online-Live:** https://ai-chat-bot-arnob.vercel.app/

## To Install Dependences

Before launching this web application, be sure to install all required dependencies, which are listed in the package.json file.

To install all dependences, run this command from your project folder: `npm install`

## To Run Project

Make sure you have NodeJS installed in your machine first, The installation instructions are here: https://nodejs.org/en/

Run your project: `npm run dev`

Run on your browser Local: `http://localhost:5173/`

## Project Dependencies Package Installation Command

`npm i openai`

`npm i @emoji-mart/data`

`npm i @emoji-mart/react`

`npm i uuid`

## To Setup .env File

you must create an .env file in your project folder and save your API key or other sensetive info.

Example: 

```
VITE_OPENAI_API_KEY=
```

## For More Information About OpenAI, Emoji-Mart, Uuid

For More Information About OpenAI Documentation, Emoji-Mart, Uuid, please visit

### OpenAI Documentation:

> https://www.npmjs.com/package/openai

After creating an account with OpenAI, you must use https://platform.openai.com/docs/api-reference/authentication to generate an API key.

Then apply this API key in your project's `.env` file.

> https://platform.openai.com/docs/api-reference/models/list

> https://platform.openai.com/docs/api-reference/completions/create

### Emoji-Mart:

About @emoji-mart/data: https://www.npmjs.com/package/@emoji-mart/data

About @emoji-mart/react: https://www.npmjs.com/package/@emoji-mart/react

### UUID:

About Uuid (Unique ID Generator): https://www.npmjs.com/package/uuid
