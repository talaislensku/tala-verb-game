/* eslint-disable no-console */
import React from 'react'
import Quiz from './quiz'
import { level } from '../levels'
import PouchDB from 'pouchdb'

const db = new PouchDB('scores')

db.info().then(info => {
  console.log(info)
})

async function reportResult(result) {
  try {
    await db.post(result)

    const scoresByHeadWord = await db.query({
      map: (doc, emit) => emit(doc.headWord, doc.score),
      reduce: '_stats',
    }, {
      group: true,
    })

    const stats = scoresByHeadWord.rows.map(({ key, value }) => ({
      headWord: key,
      score: value.sum / value.count,
    }))
    console.log(stats)
  } catch (error) {
    console.log(error)
  }
}

export const Main = () => (
  <Quiz level={level} onReport={reportResult} />
)
