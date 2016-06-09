import React from 'react'
import Quiz from './quiz'
import { level } from '../levels'

function reportResult(...props) {
  console.log(...props) // eslint-disable-line no-console
}

export const Main = () => (
  <Quiz level={level} onReport={reportResult} />
)
