import fs from 'fs'
import dotenv from 'dotenv'
import Database from './database'

dotenv.config()

const db = new Database(process.env.DB_URI)

db.connect()
  .then(() => db.listUsers())
  .then(users => {
    // 1. All users
    // 2. Users registered one week ago
    // 3. Users with one domain and registered since at least 1 year
    // 4. Users with more than one domain

    console.log(`${users.length} users retrieved.`)
    console.log('First -', users[0])
    console.log('Last -', users[users.length - 1])
  })
  .catch(console.log)
  .finally(() => db.close())