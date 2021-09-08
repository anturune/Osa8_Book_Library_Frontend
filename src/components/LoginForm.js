import React, { useState, useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
//import { LOGIN } from '../queries'

//Backendiin kysely loggautumiseen
//HUOM! username ja password muuttujina kun $-merkit
//HUOM! BACKENDISSÄ ON KOVAKOODATTUNA SALASANA "secret"
const LOGIN = gql`
  mutation 
  login($username: String!, $password: String!) {
    login(
      username: $username, 
      password: $password)  
      {
      value
    }
  }
`

const LoginForm = ({ props, setToken }) => {

  //console.log('TULEEKO LOGINFORMILLE')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [token, setToken] = useState(null)

  //Loggautuminen backendiin
  const [login, result] = useMutation(LOGIN)

  //Effect hooki käsittelemään tokenia
  //efektihookki, jonka avulla asetetaan tokenin arvo komponentin App tilaan 
  //sekä local storageen siinä vaiheessa kun palvelin on vastannut mutaatioon
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      //Annetaan local storageen nimitys tokenille
      localStorage.setItem('library-user-token', token)
    }
    //Pitää lisätä "//eslint-disable-line", jos halutaan ettei
    //linttausherjaa tule
  }, [result.data]) // eslint-disable-line

  /*
  if (!props.show) {
    return null
  }
*/

  //Usernamen ja passwordin lähettäminen backendiin
  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    //Tyhjätään kentät
    setUsername('')
    setPassword('')
  }


  return (
    <div>
      <h2>Loggauduhan</h2>
      <h3>Password "secret" kovakoodattuna</h3>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )

}
export default LoginForm