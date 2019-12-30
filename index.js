const functions = require('firebase-functions')
const {WebhookClient} = require('dialogflow-fulfillment')
const speakeasy = require('speakeasy')

// Mock user database
const users = [{
    name: 'Mish',
    email: 'mish@ushakov.co',
    secret: 'KNEEI3CMIJQWESDYPETDKNKQGZPEMWBBHE4UO626ERPHUVCGIZ4Q'
}]

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({request, response})

    // "Welcome" handler
    const welcome = (agent) => {
        // Slots
        // agent.parameters.email - Slot representing e-mail
        // agent.parameters.key - Slot representing the one-time key

        // Check whether the user exists
        const user = users.find(user => user.email == agent.parameters.email)
        if (!user){
            agent.add('Sorry, the user was not found :(')
        }

        else {
            // Compare and verify the one-time key
            const verified = speakeasy.totp.verify({
                secret: user.secret,
                encoding: 'base32',
                token: agent.parameters.key
            })

            if (verified){
                // Set context and greet
                agent.context.set({name: 'auth', lifespan: 999, parameters: {user}})
                agent.add(`Hey, ${user.name}!`)
            }
    
            else {
                agent.add(`The key didn't worked. Try again later!`)
            }
        }
    }

    // "Protected" handler
    const protected = (agent) => {
        // Echo user
        const user = agent.context.get('auth').parameters.user
        agent.add(`${user.name} said: ${agent.query}`)
    }

    // "Logout" handler
    const logout = (agent) => {
        agent.context.delete('auth')
        agent.add('Logged out!')
    }

    // Map intent handlers to intents
    let intentMap = new Map()
    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Protected', protected)
    intentMap.set('Logout', logout)
    agent.handleRequest(intentMap)
})