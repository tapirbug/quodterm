
const quodyssey = require('./quodyssey')
const hostname = process.env.SERVER_HOSTNAME || 'quovadis.gienah.uberspace.de'
const port = process.env.SERVER_PORT || 80
const quiz = quodyssey(hostname, port)
let lastPrintedRound = -1

initUI()
initQuiz()

function initUI() {
  document.querySelector('#next-round-btn').addEventListener('click', advanceRound)
}

function showRound(question) {
  const round = question.round
  quiz.getNextQuestion().then(showRound)
  document.querySelector('#server-round').textContent = round

  setTimeout(function() {
    if(round > lastPrintedRound) {
      quiz.getResultForQuiz(round).then(function (result) {
        console.log("Result visible for quiz terminal:")
        console.log(result)

        const par = document.createElement('p')
        par.textContent = `Round ${round} result for quiz player: ${JSON.stringify(result)}`
        document.querySelector('body').appendChild(par)
      })
      quiz.getResultForNonQuiz(round).then(function (result) {
        console.log("Result visible for action player:")
        console.log(result)

        const par = document.createElement('p')
        par.textContent = `Round ${round} result for action player: ${JSON.stringify(result)}`
        document.querySelector('body').appendChild(par)
      })

      lastPrintedRound = round
    }
  }, Math.max(0, question.end.getTime() - (new Date()).getTime()) )
}

function initQuiz () {
  quiz.start().then(function(res) {
    document.querySelector('#roomcode-text').textContent = res.gameId
  })
}

function advanceRound () {
  quiz.nextRound()
  quiz.getQuestion().then(showRound)
}
