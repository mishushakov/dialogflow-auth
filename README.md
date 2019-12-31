# dialogflow-auth

The repo demonstrates Dialogflow 2FA authentication and Intent protection

## Structure

![](https://i.imgur.com/rfYWhiI.png)

- Entrypoint, where the login happens
- Auth are protected Intents, that can only be accessed within auth context

### Entrypoint

![](https://i.imgur.com/8FO2Xld.png)

Slots:

- "email" (email) representing e-mail
- "key" (number sequence) representing one-time key

Output context:

- "auth" for authenticated context

### Protected Endpoints

Input context:

- "auth" for authenticated context

![](https://i.imgur.com/hmTXWTK.png)
![](https://i.imgur.com/ZqgD1ez.png)

## Preparation

Restore Agent from [Agent.zip](./Agent.zip)

![](https://i.imgur.com/Cft3CtA.png)

Install 2FA auth NodeJS library:

```sh
npm i speakeasy
```

Start node interactive shell:

```sh
node
```

Generate a secret for a user:

```js
const speakeasy = require('speakeasy')
speakeasy.generateSecret()
```

```sh
{
    ...
    base32: 'KNEEI3CMIJQWESDYPETDKNKQGZPEMWBBHE4UO626ERPHUVCGIZ4Q'
    ...
}
```

Add the secret to your 2FA app (Google Authenticator) to generate codes:

![](https://i.imgur.com/1XI8PEH.png)
![](https://i.imgur.com/ZKJQysX.jpg)

Add a mock user to [index.js](https://github.com/mishushakov/dialogflow-auth/blob/b6242939c8ee38576210afbd21ea9d0f39e98fd3/index.js#L6-L10)

```js
const users = [{
    name: 'Some User',
    email: 'your@email.com',
    secret: 'KNEEI3CMIJQWESDYPETDKNKQGZPEMWBBHE4UO626ERPHUVCGIZ4Q'
}]
```

Deploy [index.js](./index.js) to firebase

```sh
firebase deploy
```

## Testing

Invalid user:

![](https://i.imgur.com/IH4olg5.png)

Invalid key:

![](https://i.imgur.com/xeE5IbY.png)

Sign in and greeting:

![](https://i.imgur.com/8tvjV4w.png)

Protected Intent:

![](https://i.imgur.com/bEDxV7a.png)

Clearing "auth" context:

![](https://i.imgur.com/I0JEjQS.png)

Protected Intent (unauthenticated):

![](https://i.imgur.com/wV5UWvC.png)