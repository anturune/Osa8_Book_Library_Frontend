import React, { useState } from 'react'
import { gql, useQuery, useMutation, useLazyQuery } from '@apollo/client'

/*
//Tämä vain alkutestausta varten, kun testasin frontin ja backendin kommunikointia
const Authors = ({ authors }) => {
  return (
    <div>
      <h2>Authors</h2>
      {authors.map(a =>
        <div key={a.name}>
          {a.name} {a.phone}
        </div>
      )}
    </div>
  )
}
*/
const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`
//Syntymävuoden muokkaukseen/lisäykseen
const UPDATE_BIRTHYEAR = gql`
mutation updateBirthYear ($name: String!, $born: Int!){
  editAuthor(
    name: $name, 
    setBornTo: $born) {
      name
      born
  }
}
`


//const result = useQuery(ALL_AUTHORS)
const Authors = (props) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  //console.log('TULIKO AUTHORS COMPONENTTIIN')
  //Pollaus 2sek välein eli hakee Authorit kannasta joka 2. sekunti
  //Päivittää siis näkymää 2 sek välein, jotta kaikki muutokset
  //näkyvät reaaliajassa ilman sivun refreshausta
  const authors = useQuery(ALL_AUTHORS, { pollInterval: 2000 })


  const [updateBirthYear] = useMutation(UPDATE_BIRTHYEAR)
  //Ilman pollausta
  //const authors = useQuery(ALL_AUTHORS)


  //Kun painetaan muuta kuin "authors" -nappia, niin propsina
  //tulee null ja silloin Authorseja ei renderöidä
  if (!props.show) {
    return null
  }

  //Tämä oli alkuperäisessä koodissa, jotta renderöinti
  //onnistui tyhjällä arraylla ennen kyselyn lisäämistä koodiin ks. alla
  //const authors = []


  //Tämä tarvitaan, jos vastausta ei saatu palvelimelta
  //näyttäisi, että tarvitaan aina, koska muuten ei renderöinyt HTML sivulle
  if (authors.loading) {
    return <div>loading...</div>
  }
  //console.log('AUTHORS ARRAYN KOKO', authors.data)

  //Tämä koodi syntymävuoden päivittämiseen
  const submit = async (event) => {
    event.preventDefault()
    console.log('NAME', name)
    console.log('BORN', born)
    //HUOM! variabelit pitää olla samat kuin muuttuja "gql:ssä"
    //"mutation updateBirthYear ($name: String!, $born: Int!)"
    updateBirthYear({ variables: { name, born } })

    setName('')
    setBorn('')
  }


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>


      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>

        <div>
          born <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(target.valueAsNumber)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors