import React, { useState, useEffect } from 'react'
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
      genres
  }
}
`
//Haetaan genren kirjat
const ALL_BOOKS_BY_FAVORITE_TAG = gql`
query allBooksByTag($genre:String!){
  allBooks (genre:$genre){ 
      title
      author{name}
      published
      genres
  }
}
`
//Haetaan kirjautunut käyttäjä joka sisältää
//suosikkigenren
const ME = gql`
query {
  me{
    username,
    favoriteGenre
    }
}
`
const FavoriteBooks = (props) => {

    //Tehdään haku backendiin
    //PollInterval päivittää välimuistit 2sek välein
    const books = useQuery(ALL_BOOKS, { pollInterval: 20 })

    //Jos ei halua pollausta, niin näin
    //const books = useQuery(ALL_BOOKS)

    //Käytetään "useLazyQuery", koska halutaan tehdä haku vain kun
    //"useEffect" hook ajetaan
    const [getBooksByTags, result] = useLazyQuery(ALL_BOOKS_BY_FAVORITE_TAG)
    const [genreBooks, setBooks] = useState(null)

    //Haetaan loggautunut käyttäjä
    const loggedInUser = useQuery(ME)
    //Tila suosikki genrelle, joka on kerrottu käyttäjälle käyttäjän luonnin yhteydessä
    const [favoriteGenre, setFavoriteGenre] = useState(null)


    //Asetetaan favoriteGenreen käyttäjän tietokannassa oleva data
    //ajetaan kun loggedInUser:ssa tapahtuu muutos -->määritellään lopussa hakasuluissa "[loggedInUser]"
    useEffect(() => {
        if (loggedInUser.data) {
            setFavoriteGenre(loggedInUser.data)
        }
    }, [loggedInUser])
    //Jos favoriteGenre saatavilla, niin ajetaan hook aina kun
    //"favoriteGenressä" tapahtuu muutos, muuten ei ajeta.-->tämä uudelleen ajo
    //määritellään lopussa hakasuluissa "[favoriteGenre]"
    useEffect(() => {
        //console.log('USEEFFECTEKA getBooksByTags', result.data)
        if (favoriteGenre) {
            getBooksByTags({ variables: { genre: favoriteGenre.me.favoriteGenre } })
        }
    }, [favoriteGenre])  // eslint-disable-line

    //Kyselyn vastaus tulee muuttujaan result, ja sen arvo sijoitetaan komponentin tilan muuttujaan "genreBooks". 
    //Sijoitus tehdään useEffect-hookissa
    //Tämä hook ajetaan aina kun result:ssa tapahtuu muutos-->määritellään lopussa hakasuluissa "[result]"
    useEffect(() => {
        //console.log('USEEFFECTOKA setBooks', result.data)
        if (result.data) {
            setBooks(result.data.allBooks)
        }
    }, [result])

    //Kun painetaan muuta kuin "recommend" -nappia, niin propsina
    //tulee null ja silloin käyttäjän suosikkigenren kirjoja ei renderöidä
    if (!props.show) {
        return null
    }

    //console.log('GENREBOOKS', genreBooks)

    //Tämä tarvitaan, jos vastausta ei saatu palvelimelta
    //näyttäisi, että tarvitaan aina, koska muuten ei renderöinyt HTML sivulle
    if (books.loading || loggedInUser.loading) {
        return <div>loading...</div>
    }
    
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
            </div>
        )
    }

}


export default FavoriteBooks