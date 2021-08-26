import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//käyttäjän token lähettämiseen pyynnön mukana
import { setContext } from 'apollo-link-context'

import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'

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
//Luodaan client olio, jolla kommunikoidaan palvelimelle ja voidaan
//hakea mm. kaikki Authorsit
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
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