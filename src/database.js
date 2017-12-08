import _ from 'lodash'

const MongoClient = require('mongodb')

export default class Database {

  constructor (uri) {
    this.uri = uri
    this.db = {}
    return this
  }

  connect () {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.uri, (err, db) => {
        if (err) reject(err)
        this.db = db
        resolve(this)
      })
    })
  }

  listDomains () {
    return new Promise((resolve, reject) => {
      this.db.collection('domains').find({}).toArray((err, result) => {
        if (err) reject(err)
        const domains = result.map(r => ({
          name: r.domainName,
          date: new Date(r.createdAt)
        }))
        const sorted = domains.sort((a, b) => b.date - a.date)
        sorted.forEach(domain =>
          console.log(`${domain.name}`)
        )
        const grouped = _.groupBy(sorted, (item) =>
          grouped.date.toString().substring(0,4))
        console.log(grouped)
        resolve(result)
      })
    })
  }

  exportToCSV () {

  }
}