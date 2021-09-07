
import React, { useState, useEffect } from 'react'
import { gql, useQuery, useLazyQuery} from '@apollo/client'

//Fragmentti, jota voidaan hyödyntää kaikissa
//kyselyissä
const BOOK_DETAILS = gql`
fragment BookDetails on Book{
  title
      author{name}
      published
      genres
  }
`

//Haku backendiin "library-backend-Osa8"
//author-kohtaa muutettu kun backendin skeema
//muutettu siten, että Book -olion author kenttä on "author:Author!"
//ja Book oliossa viitataan Authoriin vain ID:llä (ks. backend ja Book author: resolveri)
/*
const ALL_BOOKS = gql`
query {
  allBooks { 
      title
      author{name}
      published
      genres
  }
}`
*/
/*
const ALL_BOOKS_BY_TAG = gql`
query allBooksByTag($genre:String!){
  allBooks (genre:$genre){ 
      title
      author{name}
      published
      genres
  }
}
`
*/
//All books -haku yksinkertaistuu fragmentin avulla
const ALL_BOOKS = gql`
  {
    allBooks { 
      ...BookDetails
  }
}
  ${BOOK_DETAILS}  
`
//All books by tag -haku yksinkertaistuu fragmentin avulla
const ALL_BOOKS_BY_TAG = gql`
query allBooksByTag($genre:String!){
  allBooks (genre:$genre){ 
      ...BookDetails
  }
}
${BOOK_DETAILS}
`



const Books = (props) => {

  //Tehdään haku backendiin
  //PollInterval päivittää välimuistit 2sek välein
  const books = useQuery(ALL_BOOKS, { pollInterval: 2000 })

  //Jos ei halua pollausta, niin näin
  //const books = useQuery(ALL_BOOKS)

  //Käytetään "useLazyQuery", koska halutaan tehdä haku vain kun tagia painetaan
  //frontendissä eikä joka kerta kun sivua ladataan
  //Nämä siis tageja varten, tagit ovat kirjojen genrejä
  const [getBooksByTags, result] = useLazyQuery(ALL_BOOKS_BY_TAG)
  const [genreBooks, setBooks] = useState(null)



  //Jos tag:a painetaan, suoritetaan klikkauksenkäsittelijä showBooks, 
  //joka tekee GraphQL-kyselyn tag:n perusteella
  //variaabeli "genre" asetetaan arvo "showBooks":a kutsuttaessa (tagia painettaessa)
  const showBooks = (likedGenre) => {
    //console.log('LIKEDGENRE', likedGenre)
    getBooksByTags({ variables: { genre: likedGenre } })
  }

  //Kyselyn vastaus tulee muuttujaan result, ja sen arvo sijoitetaan komponentin tilan muuttujaan "genreBooks". 
  //Sijoitus tehdään useEffect-hookissa
  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])


  //console.log('GENREBOOKS', genreBooks)


  //Kun painetaan muuta kuin "books" -nappia, niin propsina
  //tulee null ja silloin kirjoja ei renderöidä
  if (!props.show) {
    return null
  }



  //Tämä tarvitaan, jos vastausta ei saatu palvelimelta
  //näyttäisi, että tarvitaan aina, koska muuten ei renderöinyt HTML sivulle
  if (books.loading) {
    return <div>loading...</div>
  }
  //const tagsIt = books.data.allBooks.map(a => { a.genres.map(g => { console.log('TAG:', g) }) })
  //const tagsSecond = tags.map(a => a.genres)

  //Jos tag:a painettu, niin renderöidään tämä
  if (genreBooks) {
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
            {genreBooks.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
          </tbody>
        </table>
        <h4>Select tag</h4>
        <div>
          {books.data.allBooks.map(a => a.genres.map(g =>
            <button onClick={() => showBooks(g)} key={g}>{g}</button>))
          }
        </div>

      </div>
    )
  }

  //Jos tag:a ei ole painettu, renderöidään tämä
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
      <h4>Select tag</h4>
      <div>
        {books.data.allBooks.map(a => a.genres.map(g =>
          <button onClick={() => showBooks(g)} key={g}>{g}</button>))
        }
      </div>
    </div>
  )
}

export default Books