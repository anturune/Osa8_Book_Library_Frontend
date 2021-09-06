import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//käyttäjän token lähettämiseen pyynnön mukana
import { setContext } from 'apollo-link-context'
//"split" subscriptioneja varten
import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split
} from '@apollo/client'

//subscriptioneja varten
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

//client-olion muodostamisen yhteydessä oleva toinen parametri link määrittelee, 
//miten apollo on yhteydessä palvelimeen. Nyt normaalia httpLink-yhteyttä muokataan siten, 
//että pyyntöjen mukaan asetetaan headerille authorization arvoksi localStoragessa mahdollisesti oleva token
const authLink = setContext((_, { headers }) => {
    //Token tunnistetaan localStoragesta kuten nimetty "LoginForm.js":ssä
    //"library-user-token"
    const token = localStorage.getItem('library-user-token')
    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        }
    }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

//Subscriptioneja varten webSocket
//sovelluksella tulee nyt olla HTTP-yhteyden lisäksi websocket-yhteys GraphQL-palvelimelle
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true
    }
})
//Sovelluksella tulee nyt olla HTTP-yhteyden lisäksi websocket-yhteys GraphQL-palvelimelle
//"wsLink" ja "httpLink"
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    authLink.concat(httpLink),
)

//Luodaan client olio, jolla kommunikoidaan palvelimelle ja voidaan
//hakea mm. kaikki Authorsit
const client = new ApolloClient({
    cache: new InMemoryCache(),
    //link: authLink.concat(httpLink)
    //splitLink sisältää molemmat, http-linkin sekä websocket-linkin
    link: splitLink
    /*
    link: new HttpLink({
        uri: 'http://localhost:4000'
        */
})

//kääritään komponentti App komponentin ApolloProvider lapseksi, jotta saadaan Client
//kaikkien komponenttien saataville
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)