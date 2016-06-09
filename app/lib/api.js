import axios from 'axios'

const apiUrl = 'https://api.tala.is'

async function lookupWords(words) {
  const results = await Promise.all(words.map(word => axios.get(`${apiUrl}/find/${word}`)))
  return results.map(x => x.data)
}

export { lookupWords }
