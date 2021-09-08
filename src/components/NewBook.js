import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

//Backendkoodi/mutaatio, jolla hoidetaan kirjan luonti backendiin
//HUOM! nimetty mutaatio "createBook" ja siihen liittyvät muuttujat
//Tällöin pystytään syöttämään frontendistä mikä tahansa arvo
const ADD_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!,  $genres: [String]){
  addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
  ) {
      title,
      published,
      genres,
      author{name}
  }
}
`

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  /*
    console.log('Title', title)
    console.log('Author', author)
    console.log('Published', published)
    console.log('Genre', genre)
    console.log('Genres', genres)
  */
  //Mutaatioiden tekemiseen Hook-funktion "useMutation"
  //HUOM! Käytä hakasulkujen sisällä mutaation nimeä "createBook" eikä "addBook"
  //Hakasulkuihin siis mutaation nimi, koska syötettävät arvot ovat erejä ja graphQl
  //vaatii muuttujia käytettäessä nimeämisen frontendissä
  //Hook palauttaa kyselyfunktion taulukon ensimmäisenä alkiona
  const [createBook] = useMutation(ADD_BOOK)

  //console.log('PUBLISHED TYPE', published)


  if (!props.show) {
    return null
  }


  const submit = async (event) => {
    event.preventDefault()

    //Kyselyä tehtäessä määritellään kyselyn muuttujille arvot

    createBook({ variables: { title, published, author, genres } })

    console.log('add book...')
    console.log('CREATE BOOK', createBook)
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
    console.log('TULIKO LOPPUN ASTI')
   
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }
//HUOM! Formi palauttaa String -tyyppisenä numerokentän (tässä "Published")
//ellei käyttää pelkkää "target.value" eikä "target.valueAsNumber"
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.valueAsNumber)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook
