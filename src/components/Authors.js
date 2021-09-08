import React, { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
//React-select ominaisuuden käyttöönotto
//Mahdollistaa alasvetovalikon, jossa vain haluttu sisältö
//Eikä tarvitse erikseen kirjoittaa vapaaseen kenttään
//Tässä hyödynnetty henkilön syntymävuoden päivittämiseen
import Select from 'react-select'

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
//Kaikkien authoreiden hakemiseen
const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
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
      id
  }
}
`
const Authors = (props) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  //console.log('TULIKO AUTHORS COMPONENTTIIN')
  //Pollaus 2sek välein eli hakee Authorit kannasta joka 2. sekunti
  //Päivittää siis näkymää 2 sek välein, jotta kaikki muutokset
  //näkyvät reaaliajassa ilman sivun refreshausta
  const authors = useQuery(ALL_AUTHORS, { pollInterval: 2000 })

  //console.log('ALL AUTHORS', authors.data.allAuthors)
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
    //console.log('NAME', name)
    //console.log('BORN', born)
    //HUOM! variabelit pitää olla samat kuin muuttuja "gql:ssä"
    //"mutation updateBirthYear ($name: String!, $born: Int!)"
    updateBirthYear({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  //console.log('NAME', name)

  //Tämä koodi kun valintalista
  //HUOM! Jotta valintalistaan jää valinnan jälkeen valittu nimi
  //näkyviin, niin pitää "label":iin palauttaa "name" useStatesta
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
          <Select
            options={authors.data.allAuthors.map(author => ({ label: author.name, value: author.id }))}
            onChange={({ label }) => setName(label)}
            label={name}>
          </Select>
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

/*
//Tämä koodi kun käsin syötettävä kenttä
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
*/
export default Authors