import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
    ApolloClient, ApolloProvider, HttpLink, InMemoryCache
} from '@apollo/client'

//Luodaan client olio, jolla kommunikoidaan palvelimelle ja voidaan
//hakea mm. kaikki Authorsit
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: 'http://localhost:4000',
    })
})
//kääritään komponentti App komponentin ApolloProvider lapseksi, jotta saadaan Client
//kaikkien komponenttien saataville
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)