import React from 'react'
import { gql, useQuery, useLazyQuery } from '@apollo/client'

/*
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

//const result = useQuery(ALL_AUTHORS)
const Authors = (props) => {
  //console.log('TULIKO AUTHORS COMPONENTTIIN')
  const authors = useQuery(ALL_AUTHORS)
  
  
  //Kun painetaan muuta kuin "authors" -nappia, niin propsina
  //tulee null ja silloin Authorseja ei renderöidä
  if (!props.show) {
    return null
  }

  
  //Tämä oli alkuperäisessä koodissa, jotta renderöinti
  //onnistui tyhjällä arraylla ennen kyselyn lisäämistä koodiin ks. alla
  //const authors = []
 

    if (authors.loading) {
      return <div>loading...</div>
    }
    //console.log('AUTHORS ARRAYN KOKO', authors.data)

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

    </div>
  )
}

export default Authors