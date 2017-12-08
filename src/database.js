import _ from 'lodash'

const MongoClient = require('mongodb').MongoClient

export default class Database {

  constructor (uri) {
    this.uri = uri
    this.db = {}
    return this
  }

  connect () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.uri, (err, db) => {
        if (err) return reject(err)
        this.db = db
        return resolve(this)
      })
    })
  }

  listDomains (owner = null) {
    return new Promise((resolve, reject) => {
      const query = {}
      if (owner) query.owner = owner
      const cursor = this.db.collection('domains').find(query).sort( { createdAt: -1 } )
      cursor.toArray((err, result) => {
        if (err) return reject(err)
        const domains = result.map(r => {
          return {
            name: r.domainName,
            date: new Date(r.createdAt)
          }
        })
        return resolve(domains)
      })
    })
  }

  listUsers () {
    return new Promise((resolve, reject) => {
      const cursor = this.db.collection('users').find({}).sort( { createdAt: -1 } )
      cursor.toArray((err, result) => {
        if (err) return reject(err)
        const users = result.map(user => {
          return {
            name: user.emails[0].address,
            date: new Date(user.createdAt)
          }
        })
        return resolve(users)
      })
    })
  }

  close () {
    this.db.close()
  }
}