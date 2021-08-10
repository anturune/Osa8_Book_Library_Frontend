import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
//Apollo client määtitellään "index.js" -sivulla
import { gql, useQuery, useLazyQuery } from '@apollo/client'

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


const App = () => {
  const [page, setPage] = useState('authors')
  //const [getLazyAuthors, result] = useLazyQuery(ALL_AUTHORS)
  //const [getAuthors, result] = useQuery(ALL_AUTHORS)

/*
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


  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
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

    </div>
  )

}

export default App