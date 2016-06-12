export const commonVerbs = [
  'ákveða',
  'bera',
  'biðja',
  'birta',
  'bíða',
  'bjóða',
  'bregða',
  'breyta',
  'brosa',
  'búa',
  'byrja',
  'bæta',
  'detta',
  'draga',
  'eiga',
  'falla',
  'fara',
  'fá',
  'fela',
  'finna',
  'flytja',
  'fylgja',
  'færa',
  'ganga',
  'gefa',
  'gera',
  'geta',
  'gleyma',
  'grípa',
  'hafa',
  'halda',
  'hefja',
  'heita',
  'heyra',
  'hlaupa',
  'hljóta',
  'hlæja',
  'horfa',
  'hugsa',
  'hverfa',
  'hætta',
  'kalla',
  'kaupa',
  'kenna',
  'koma',
  'kunna',
  'láta',
  'leggja',
  'leiða',
  'leita',
  'lesa',
  'lifa',
  'liggja',
  'líða',
  'líta',
  'ljúka',
  'lýsa',
  'læra',
  'mega',
  'minna',
  'muna',
  'munu',
  'ná',
  'nefna',
  'nota',
  'opna',
  'ráða',
  'reka',
  'renna',
  'reyna',
  'ræða',
  'segja',
  'senda',
  'setja',
  'sitja',
  'sjá',
  'skilja',
  'skipta',
  'skrifa',
  'skulu',
  'snúa',
  'spyrja',
  'standa',
  'svara',
  'sýna',
  'sækja',
  'taka',
  'tala',
  'telja',
  'veita',
  'vera',
  'verða',
  'vilja',
  'vinna',
  'virða',
  'vita',
  'þekkja',
  'þurfa',
  'þykja',
  'ætla',
]

export const level = {
  name: 'Past tense',
  words: commonVerbs,
  prompts: {
    'GM-FH-ÞT-1P-ET': ['ég'],
    'GM-FH-ÞT-2P-ET': ['þú'],
    'GM-FH-ÞT-3P-ET': ['hann', 'hún', 'það'],
    // 'GM-FH-ÞT-1P-FT': ['við'],
    // 'GM-FH-ÞT-2P-FT': ['þið'],
    // 'GM-FH-ÞT-3P-FT': ['þeir', 'þær', 'þau'],
  },
}

export const otherLevel = {
  name: 'Past participles',
  words: ['tala', 'fara', 'vera', 'vilja', 'koma'],
  prompts: {
    'GM-SAGNB': ['ég hef', 'ég get', 'hann getur', 'hún hefur'],
  },
}
