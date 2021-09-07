
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import FavoriteBooks from './components/FavoriteBooks'
//Apollo client sekä Subscription myös määritellään "index.js" -sivulla
import { useApolloClient, useSubscription, gql } from '@apollo/client'

/*
//Tämä kysely luotu, jotta voidaan todeta, että kysely backendiin toimii
//Tarvitaan myös "if(result.loading)" ja siihen liittyvä renderöinti, jotta voidaan kokeilla
//ks. App -komponentin sisällä oleva koodi
const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`
*/
//Käytetään fragmenttia, jotta voidaan hyödyntää
//halutuissa kyselyissä
const BOOK_DETAILS = gql`
fragment BookDetails on Book{
  title
      author{name}
      published
      genres
  }
`
//Subscription kysely
const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`

//Loggautumista varten Notificaatio -komponentti
const Notify = ({ notifyMessage }) => {
  if (!notifyMessage) {
    return null
  }
  return (
    <div style={{ color: 'green' }}>
      {window.alert(notifyMessage)}
    </div>
  )
}




const App = () => {
  const [page, setPage] = useState('authors')
  //Kirjautumiseen liittyvä yksilöllinen Token
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [notifyMessage, setNotifyMessage] = useState(null)

  const tokenLocalStoragessa = localStorage.getItem('library-user-token')


  //console.log('TOKENI APP:ssa tokenLocalStoragessa', tokenLocalStoragessa)
  //console.log('TOKENI APP:ssa UseStatessa', token)
  /*
  //-----------------------BACKEND-FRONTEND KOMMUNIKOINTI-TESTAAMISTA VARTEN----------------------------
    //Backendin kommunikoinnin testaamiseen liittyvä koodi
    //Tarvitsee kyselyn, joka kommentoitu pois yllä
    const result = useQuery(ALL_AUTHORS)
    console.log('Result.data', result.data)
  
    //Tämä tarvitaan, jos vastausta ei saatu palvelimelta
    //näyttäisi, että tarvitaan aina, koska muuten ei renderöinyt HTML sivulle
    if (result.loading) {
      return <div>loading...</div>
    }
  */
  /*
  //Kun tulos on valmis, renderöidään Authorit. Tämä ekaa testausta varten ilman
  //että käytetään omaa Authors komponenttia
  return (
    <div>
      {result.data.allAuthors.map(a => a.name).join(', ')}
    </div>
  )
  */
  /*
  //Tässä jalostettu niin, että käyttää omaa eristettyä komponenttia
  //testattu eriytettyä Authors -komponenttia
   return (
     < Authors authors={result.data.allAuthors} />
   )
   */
  /*
    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
        </div>
  
        <Authors
          show={page === 'authors'}
        />
  
      </div>
    )
  */
  //-----------------------BACKEND-FRONTEND KOMMUNIKOINTI-TESTAAMISTA VARTEN----------------------------

  //Notifiacaatio 10 sek.
  const notify = (message) => {
    setNotifyMessage(message)
    setTimeout(() => {
      setNotifyMessage(null)
    }, 10000)
  }
  //Subscriptio eli aina kun uusi kirja lisätään tulee notificaatio
  //tässä hyödynnetään webSocketteja HTTP:n sijaan
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added`)
      console.log(subscriptionData)
      console.log('TULIKO SUBSCRIPTIONIIN??')

    }
  })

  //Logout napin toiminnot
  //Välimuistin nollaaminen tapahtuu Apollon client-objektin metodilla resetStore,
  //clientiin taas päästään käsiksi hookilla useApolloClient 
  const logout = () => {
    setToken(null)
    //poistetaan token local storagesta
    localStorage.clear()
    //Resetoidaan välimuisti
    client.resetStore()
  }

  //<LoginForm> lisätty, kun halutaan loggautuminen

  if (!token && !tokenLocalStoragessa) {
    return (
      <div>
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
        />
      </div>
    )
  }



  return (
    <div>
      <Notify notifyMessage={notifyMessage} />
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('favoriteBooks')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />
      <FavoriteBooks
        show={page === 'favoriteBooks'}
      />

    </div>
  )

}

export default App