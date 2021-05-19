import { useState, useContext } from 'react'
import { AuthContext } from './auth'
import firebase from './firebase'
import './App.css'

const defaultStates = {
  email: '',
  password: '',
  displayName: '',
  isSubmitting: false,
  isNewUser: false
}
function App() {
  const { currentUser } = useContext(AuthContext)
  const [isSubmitting, setIsSubmitting] = useState(defaultStates.isSubmitting)
  const [email, setEmail] = useState(defaultStates.email)
  const [password, setPassword] = useState(defaultStates.password)
  const [displayName, setDisplayName] = useState(defaultStates.displayName)
  const [isNewUser, setIsNewUser] = useState(defaultStates.isNewUser)

  const resetInputFields = () => {
    setEmail(defaultStates.email)
    setPassword(defaultStates.password)
    setDisplayName(defaultStates.displayName)
  }

  const login = async event => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      resetInputFields()
    } catch {
      window.alert('Failed to log in!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const register = async event => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebase.auth().currentUser.updateProfile({
        displayName
      })
      resetInputFields()
      window.alert('You are now registered and logged in!')
    } catch {
      window.alert('Failed to register!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const logout = async () => {
    setIsSubmitting(true)
    try {
      await firebase.auth().signOut()
    } catch {
      window.alert('Failed to log out!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (event, setState) => {
    event.preventDefault()
    setState(event.target.value)
  }

  const renderLoginForm = () => {
    return (
      <form className='form' onSubmit={login}>
        <div className='form-body'>
          {isSubmitting ? (
            <h1>Submitting...</h1>
          ) : (
            <>
              <div className='form-control'>
                <h1>Log In</h1>
              </div>
              <div className='form-control'>
                <div>
                  <label htmlFor='firebase-email'>Email</label>
                </div>
                <div>
                  <input
                    required
                    type='text'
                    id='firebase-email'
                    value={email}
                    onChange={event => handleInputChange(event, setEmail)}
                  />
                </div>
              </div>

              <div className='form-control'>
                <div>
                  <label htmlFor='firebase-password'>Password</label>
                </div>
                <div>
                  <input
                    required
                    type='password'
                    id='firebase-password'
                    value={password}
                    onChange={event => handleInputChange(event, setPassword)}
                  />
                </div>
              </div>

              <div className='form-control submit'>
                <button type='submit'>Log in</button>
              </div>

              <div className='form-control new-user'>
                <div
                  className='new-user-content'
                  onClick={() => setIsNewUser(true)}
                >
                  New User?
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    )
  }

  const renderNewUserForm = () => {
    return (
      <form className='form' onSubmit={register}>
        <div className='form-body'>
          {isSubmitting ? (
            <h1>Creating new account...</h1>
          ) : (
            <>
              <div className='form-control'>
                <h1>Create Account</h1>
              </div>
              <div className='form-control'>
                <div>
                  <label htmlFor='firebase-display-name'>Display Name</label>
                </div>
                <div>
                  <input
                    required
                    type='text'
                    id='firebase-display-name'
                    value={displayName}
                    onChange={event => handleInputChange(event, setDisplayName)}
                  />
                </div>
              </div>
              <div className='form-control'>
                <div>
                  <label htmlFor='firebase-username'>Email</label>
                </div>
                <div>
                  <input
                    required
                    type='text'
                    id='firebase-username'
                    value={email}
                    onChange={event => handleInputChange(event, setEmail)}
                  />
                </div>
              </div>

              <div className='form-control'>
                <div>
                  <label htmlFor='firebase-password'>Password</label>
                </div>
                <div>
                  <input
                    required
                    type='password'
                    id='firebase-password'
                    value={password}
                    onChange={event => handleInputChange(event, setPassword)}
                  />
                </div>
              </div>

              <div className='form-control submit'>
                <button type='submit'>Register</button>
              </div>

              <div className='form-control new-user'>
                <div
                  className='new-user-content'
                  onClick={() => setIsNewUser(false)}
                >
                  Old User?
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    )
  }

  return (
    <div className='App'>
      {!!currentUser ? (
        <div>
          <h1>Hello, {currentUser.displayName}!</h1>
          <button onClick={logout}>Log out</button>
        </div>
      ) : (
        <div>{isNewUser ? renderNewUserForm() : renderLoginForm()}</div>
      )}
    </div>
  )
}

export default App
