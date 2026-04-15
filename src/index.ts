import { Hono } from 'hono'
// import { serve } from '@hono/node-server'

const app = new Hono()
//in memory user store
type User = { id: string,  name: string, email: string, password: string  }

const users:User[] =[] // to store users 

// to generate unique id 
const generateID =() => crypto.randomUUID()

app.get('/users', (c) => {
  return c.text(users)

})
app.get('/users/:id', (c) =>{
const id = c.req.param('id')
const user = users.find((u) => u.id === id)
if(!user){
  return c.json({error: 'user not found'}, 404)
}
return c.json(user)

})
app.post('/signup', async (c) => {
  const body = await c.req.json()

  const {name, email, password} =body

  if(!name  !email !password){ //validate 
    return c.json({error: 'please fill out all fields'}, 400)

  }


  const userExist = users.find((u) => u.email === email) // to check if the email has been used before
  if(userExist){
    return c.json({error: 'Email already exist' }, 409)
  }

  const newUser: User ={id: generateID(), name, email, password,}  //creating new user (line 5 User)
  users.push(newUser) // storing the new user in our in memory users list 


  const withOutPassword ={ id: newUser.id, name: newUser.name, email: newUser.email}  //to return without including the password  
  return c.json(withOutPassword, 201)
   
})

app.post('/signin', async (c) => {
  const body = await c.req.json()

  const {email, password} = body 
  const user = users.find((u) =>u.email === email)

  if(!user){ //checking if the user exists 
    return c.json({error: 'user not found'}, 404)
  }

  if(user?.password !== password){  //comparing password (validating input)
    return c.json({error: 'incorrect password'}, 401)
  }
 // const withOutPassword ={email: users.email }
 const withOutPassword = {
   id: user.id,
   name: user.name, 
   email: user.email }
 return c.json({
  message: 'login successfuly', 
  user: withOutPassword,

 })

})

// serve({
//   fetch: app.fetch,
//   port: 3000,
// })
export default app