
import React from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

//Haku backendiin "library-backend-Osa8"
//author-kohtaa muutettu kun backendin skeema
//muutettu siten, että Book -olion author kenttä on "author:Author!"
//ja Book oliossa viitataan Authoriin vain ID:llä (ks. backend ja Book author: resolveri)
const ALL_BOOKS = gql`
query {
  allBooks { 
      title
      author{name}
      published 
  }
}
`
const Books = (props) => {

  //Tehdään haku backendiin
  //PollInterval päivittää välimuistit 2sek välein
  //const books = useQuery(ALL_BOOKS, { pollInterval: 2000 })
  //Jos ei halua pollausta, niin näin
  const books = useQuery(ALL_BOOKS)


  //Kun painetaan muuta kuin "books" -nappia, niin propsina
  //tulee null ja silloin kirjoja ei renderöidä
  if (!props.show) {
    return null
  }

  //const books = []

  //Tämä tarvitaan, jos vastausta ei saatu palvelimelta
  //näyttäisi, että tarvitaan aina, koska muuten ei renderöinyt HTML sivulle
  if (books.loading) {
    return <div>loading...</div>
  }

  //console.log('ALL BOOKS', books.data.allBooks)

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books