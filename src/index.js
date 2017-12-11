import fs from 'fs'
import dotenv from 'dotenv'
import moment from 'moment'
import Database from './database'

dotenv.config()

const db = new Database(process.env.DB_URI)

const exportToCSV = (array, filename) =>
  new Promise((resolve, reject) => {
    const content = array.join('\n')
    fs.writeFile(filename, content, err => {
      if (err) return reject(err)
      resolve(filename)
    })
  })

// 1. All users
const exportAllUsers = users => {
  const emails = users.map(u => u.email)
  return exportToCSV(emails, 'output/all-users.csv')
}

// 2. Users registered two weeks ago
const exportUserRegisteredTwoWeekAgo = users => {
  const weekAgo = moment().subtract(14, 'd')
  const filteredUsers = users.filter(u => moment(u.createdAt) > weekAgo)
  const emails = filteredUsers.map(u => u.email)
  return exportToCSV(emails, 'output/two-weeks-ago.csv')
}

// 3. Users with one domain and registered since at least 1 year.
const exportUserRegisteredOneYearAgoWithOneDomain = users => {
  const muxumuxu = users.find(u => u.email === 'hello@muxumuxu.com')
  const yearAgo = moment().subtract(1, 'y')
  const filteredUsers = users.filter(u => moment(u.createdAt) < yearAgo && u.domains.length > 0)
  const emails = filteredUsers.map(u => u.email)
  return exportToCSV(emails, 'output/year-ago-with-one-domain.csv')
}

// 4. Users with more than one domain
const exportUserWithMoreThanOneDomain = users => {
  const filteredUsers = users.filter(u => u.domains.length > 1)
  const emails = filteredUsers.map(u => u.email)
  return exportToCSV(emails, 'output/more-than-one-domain.csv')
}

db.connect()
  .then(() => db.getUsers())
  .then(users =>
    Promise.all([
      exportAllUsers(users),
      exportUserRegisteredTwoWeekAgo(users),
      exportUserRegisteredOneYearAgoWithOneDomain(users),
      exportUserWithMoreThanOneDomain(users)
    ])
  )
  .catch(console.log)
  .finally(() => db.close())
