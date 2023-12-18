/* Validations */

//Validate if process start with I, F or T
function validStartEnd(process) {
  let inicio = 0
  let final = process.length - 1
  if (
    process[inicio] === 'I' ||
    process[inicio] === 'F' ||
    process[inicio] === 'T'
  ) {
    return false
  } else if (process[final] === 'T' || process[final] === 'I') {
    return false
  } else {
    return true
  }
}

//Validate if process finish with F and no have more characters
function validEnd(process) {
  let final = process.length - 1
  if (process[final] === 'F') {
    return true
  } else {
    return false
  }
}

function isAllowedLetter(letter) {
  const l = ['T', 'F', 'I']
  return l.includes(letter)
}

//Validete that the process only contains numbers or letters T, F, I
function validProcess(process) {
  let i = 0
  let valid = true
  while (i < process.length && valid) {
    if (isNaN(process[i]) && !isAllowedLetter(process[i])) {
      valid = false
    }
    i++
  }
  return valid
}

function correctSeq(infoProcess) {
  for (let i = 0; i < infoProcess.length; i++) {
    if (
      (infoProcess[i] === 'I' || infoProcess[i] === 'T') &&
      infoProcess[i + 1] === 'F'
    ) {
      return false //No es válido porque luego de una I o T, no puede haber una F
    }
  }
  return true
}

const globalSet = new Set() // Esto lo hice para tener un conjunto general, para que se pueda consultar si ya existe
//El número, por lo que lo dejé para que lo vieras.

function noRepetitionMemory(infoProcess) {
  //validate that the process characters are not in the set
  for (const p of infoProcess) {
    if (!isNaN(p)) {
      if (globalSet.has(p)) {
        return false //Ya existe el número en el conjunto, por lo que no se puede repetir
      }
      globalSet.add(p)
    }
  }
  return true //No se repite ningún número
}

function correctSeqNumbers(infoProcess) {
  let last = null
  for (const p of infoProcess) {
    if (!isNaN(p)) {
      pNumber = parseInt(p)
      if (last !== null && pNumber !== last + 1) {
        return false //No es consecuente el número, no sigue la secuencia. Las direcciones de memoria no están seguidas.
      }
      last = pNumber
    }
  }
  return true //Todos los números están en una correc
}

// Global data
const labels = ['I', 'F', 'T']

const states = {
  running: '🟩',
  ready: '⬜️',
  block: '🟥',
  finish: '🟨'
}

const processesInfo = {
  dispatcher: {
    currentState: 'ready',
    instructions: [],
    executionTime: 0
  }
}

let processInsideSystem = ['dispatcher']

const dispatchInfo = {
  readyQueue: [],
  blockQueue: [],
  running: ''
}

const results = {
  dispatcher: []
}

const traceProcessorResult = []
let time = 1
let countIterations = 1

let flagBlocked = false
let cyclesInterrupts
let cyclesDispatcher

// Functions
function algorithmExecution() {
  if (dispatchInfo.running === undefined || processInsideSystem.length === 1) {
    return
  }

  processesInfo[dispatchInfo.running].currentState = 'running'

  const instruction = processesInfo[dispatchInfo.running].trace.shift()
  addTraceProcessor(instruction, dispatchInfo.running)

  if (
    countIterations % cyclesInterrupts == 0 &&
    !labels.includes(instruction)
  ) {
    addTraceProcessor('Td', dispatchInfo.running)
    /*if(processesInfo[dispatchInfo.running].trace[0] === "T"){
            processesInfo[dispatchInfo.running].trace.shift()
        }*/
    paintProcesses(dispatchInfo.running)
    results[dispatchInfo.running].push(
      states[processesInfo[dispatchInfo.running].currentState]
    )
    processesInfo[dispatchInfo.running].currentState = 'ready'
    dispatchInfo.readyQueue.push(dispatchInfo.running)
    time = dispatcherExecution(processesInfo, states, results, time)
    time++
    return
  }

  if (instruction === 'I') {
    results[dispatchInfo.running].push('🟥')
    processesInfo[dispatchInfo.running].currentState = 'block'
    dispatchInfo.blockQueue.push(dispatchInfo.running)
    paintProcesses(dispatchInfo.running)
    time = dispatcherExecution() + 1
    flagBlocked = true
  } else if (instruction === 'F') {
    results[dispatchInfo.running].push('🟨')
    processesInfo[dispatchInfo.running].currentState = 'finish'
    processesInfo[dispatchInfo.running].executionTime = time
    paintProcesses(dispatchInfo.running)
    processInsideSystem = processInsideSystem.filter(
      (p) => p !== dispatchInfo.running
    )
    time = dispatcherExecution() + 1
  } else if (instruction === 'T') {
    paintProcesses('')
    processesInfo[dispatchInfo.running].currentState = 'ready'
    dispatchInfo.readyQueue.push(dispatchInfo.running)
    time = dispatcherExecution() + 1
  } else {
    countIterations++
    results[dispatchInfo.running].push(
      states[processesInfo[dispatchInfo.running].currentState]
    )
    paintProcesses(dispatchInfo.running)
    time++
  }
}

function dispatcherExecution() {
  dispatchInfo.running = 'dispatcher'
  processesInfo[dispatchInfo.running].currentState = 'running'
  let d
  let i = 0
  const upperLimit = parseInt(time) + parseInt(cyclesDispatcher) - 1
  for (d = time; d <= upperLimit; d++) {
    addTraceProcessor(
      processesInfo[dispatchInfo.running].instructions[i++],
      'dispatcher'
    )
    paintProcesses('')
  }

  processesInfo['dispatcher'].currentState = 'ready'
  dispatchInfo.running = dispatchInfo.readyQueue.shift()

  countIterations = 1
  console.log('D value', d)
  return d
}

function paintProcesses(excludeProcess) {
  processInsideSystem.forEach((p) => {
    if (p !== excludeProcess)
      results[p].push(states[processesInfo[p].currentState])
  })
}

function addTraceProcessor(instruction, process) {
  switch (instruction) {
    case 'Td':
      traceProcessorResult.push('-- TIME-OUT from Dispatcher --')
      break
    case 'T':
      traceProcessorResult.push(`-- TIME-OUT from Process ${process} --`)
      break
    case 'I':
      traceProcessorResult.push(`I/O request from ${process}`)
      break
    case 'F':
      traceProcessorResult.push(`End of process ${process}`)
      break
    default:
      traceProcessorResult.push(`${instruction} - ${process}`)
      break
  }
}

function clean() {
  while (tableResults.firstChild) {
    tableResults.removeChild(tableResults.firstChild)
  }

  while (traceProcessor.firstChild) {
    traceProcessor.removeChild(traceProcessor.firstChild)
  }

  while (tableProcesses.firstChild) {
    tableProcesses.removeChild(tableProcesses.firstChild)
  }

  document.querySelector('#ready').textContent = ''
  document.querySelector('#block').textContent = ''

  //clean wakeup buttons
  const wakeUpContainer = document.querySelector('#wakeup-container')
  while (wakeUpContainer.firstChild) {
    wakeUpContainer.removeChild(wakeUpContainer.firstChild)
  }

  //clean next instruction button
  const nextInstruction = document.querySelector('#next-instruction-container')
  while (nextInstruction.firstChild) {
    nextInstruction.removeChild(nextInstruction.firstChild)
  }
}

function wakeUpBlockProcess(process) {
  if (!processesInfo[process].trace[0]) {
    dispatchInfo.blockQueue.push(process)
  } else {
    dispatchInfo.blockQueue = dispatchInfo.blockQueue.filter(
      (p) => p !== process
    )
    processesInfo[process].currentState = 'ready'
    dispatchInfo.readyQueue.push(process)
  }
}

function paintResult() {
  const trn = document.createElement('tr')
  const empty = document.createElement('td')
  trn.appendChild(empty)
  for (let i = 1; i < time; i++) {
    const td = document.createElement('td')
    td.textContent = i
    trn.appendChild(td)
  }
  tableResults.appendChild(trn)

  if (flagBlocked || processInsideSystem.length > 1) {
    const nextInstruction = document.querySelector(
      '#next-instruction-container'
    )
    const nextInstructionButton = document.createElement('button')
    nextInstructionButton.innerHTML = '<i class="fa-solid fa-forward"></i>'
    nextInstructionButton.classList.add('btn-next')
    nextInstructionButton.addEventListener('click', (e) => {
      e.preventDefault()
      clean()
      algorithmExecution()
      paintResult()
      if (
        dispatchInfo.readyQueue.length === 0 &&
        dispatchInfo.blockQueue.length === 0
      ) {
        //nextInstruction.removeChild(nextInstructionButton)
      }
    })
    nextInstruction.appendChild(nextInstructionButton)
  }

  Object.keys(results).forEach((processName) => {
    const tr = document.createElement('tr')
    const processId = document.createElement('td')
    processId.textContent = processName
    tr.appendChild(processId)

    results[processName].forEach((trace) => {
      const td = document.createElement('td')
      td.textContent = trace
      tr.appendChild(td)
    })

    tableResults.appendChild(tr)
  })

  const wakeUpContainer = document.querySelector('#wakeup-container')
  dispatchInfo.blockQueue.forEach((p) => {
    const wakeUpbutton = document.createElement('button')
    wakeUpbutton.textContent = `Wake up ${p}`
    wakeUpbutton.classList.add('wakeup-button')
    wakeUpbutton.addEventListener('click', (e) => {
      e.preventDefault()
      wakeUpBlockProcess(p)
      clean()
      if (dispatchInfo.running === undefined)
        dispatchInfo.running = dispatchInfo.readyQueue.shift()
      algorithmExecution()
      paintResult()
      //wakeUpContainer.removeChild(wakeUpbutton)
    })
    wakeUpContainer.appendChild(wakeUpbutton)
  })

  let i = 1
  traceProcessorResult.forEach((trace) => {
    const tr = document.createElement('tr')
    const td = document.createElement('td')

    if (trace.includes('-- TIME-OUT from Dispatcher --')) {
      td.textContent = trace
    } else {
      td.textContent = `${i++} - ${trace}`
      if (trace.includes('I/O')) {
        td.style.backgroundColor = '#ff0000'
      } else if (trace.includes('End')) {
        td.style.backgroundColor = 'yellow'
      }
    }

    let getTrace = trace.split(' ')[0]
    if (getTrace >= 100 && getTrace < 100 + parseInt(cyclesDispatcher))
      td.style.backgroundColor = '#8ade52'

    tr.appendChild(td)
    traceProcessor.appendChild(tr)
  })

  document.querySelector('#running').textContent = dispatchInfo.running
  document.querySelector('#ready').textContent =
    '[' + dispatchInfo.readyQueue.join(', ') + ']'
  document.querySelector('#block').textContent =
    '[' + dispatchInfo.blockQueue.join(', ') + ']'

  const processTimes = Object.keys(processesInfo).filter(
    (p) => p !== 'dispatcher'
  )

  const tableProcesses = document.querySelector('#tableProcesses')
  const thead = document.createElement('thead')
  const tr = document.createElement('tr')

  const th1 = document.createElement('th')
  th1.textContent = 'Process ID'
  const th2 = document.createElement('th')
  th2.textContent = 'Execution Time'
  const th3 = document.createElement('th')
  th3.textContent = 'State final'

  tr.appendChild(th1)
  tr.appendChild(th2)
  tr.appendChild(th3)
  thead.appendChild(tr)
  tableProcesses.appendChild(thead)

  processTimes.forEach((p) => {
    const tr = document.createElement('tr')

    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')

    td1.textContent = p
    td2.textContent = processesInfo[p].executionTime
    td3.textContent =
      processesInfo[p].currentState +
      ' ' +
      states[processesInfo[p].currentState]

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)

    tableProcesses.appendChild(tr)
  })
}

function assignTimeExecution() {
  processInsideSystem.forEach((p) => {
    processesInfo[p].executionTime = time - 1
  })
}

const processInfo = document.getElementById('processInfo')
const submitProcess = document.getElementById('submit')
const showInfoProcess = document.getElementById('show-info-process')

const processes = []

// Show processes info in table
submitProcess.addEventListener('click', (e) => {
  e.preventDefault()

  //Separate processinfo by commas and remove spaces
  processInfo.value = processInfo.value.replace(/\s/g, '')
  const inputProcess = (processInfo.value = processInfo.value.split(','))

  //Make validations before add process

  //Validate that the process only contains numbers or letters T, F, I
  if (!validProcess(inputProcess)) {
    alert('The process must contain only numbers or letters T, F, I')
    return
  }

  //Validate if process not start with I, F or T
  if (!validStartEnd(inputProcess)) {
    alert(
      'The process must start with a letter different from I, F or T and end with a letter different from I or T'
    )
    return
  }

  //Validate if process finish with F and no have more characters
  if (!validEnd(inputProcess)) {
    alert(
      'The process must end with the letter F and cannot have more characters'
    )
    return
  }

  //Validate that the process does not have a sequence of I or T followed by F
  if (!correctSeq(inputProcess)) {
    alert('The process cannot have a sequence of I or T followed by F')
    return
  }

  //Validate that the process does not take up the same memory space as another process
  if (!noRepetitionMemory(inputProcess)) {
    alert('The process cannot take up the same memory space as another process')
    return
  }

  //Validate correct sequence of numbers in memory
  if (!correctSeqNumbers(inputProcess)) {
    alert('The process does not have a correct sequence of numbers in memory')
    return
  }

  processes.push(processInfo.value)
  const tr = document.createElement('tr')
  const processId = document.createElement('td')
  const processContent = document.createElement('td')
  processId.textContent = `process-${processes.length - 1}`
  processContent.textContent = processInfo.value
  tr.appendChild(processId)
  tr.appendChild(processContent)
  showInfoProcess.appendChild(tr)
  processInfo.value = ''
})

// Run algorithm after when user click "Dispatcher run" button
const renderButton = document.querySelector('#render')
const renderForm = document.querySelector('#render-form')

const tableResults = document.querySelector('#results')
const traceProcessor = document.querySelector('#traceProcessor')

renderForm.addEventListener('submit', (e) => {
  e.preventDefault()
  clean()

  cyclesDispatcher = document.querySelector('#dispatcher-cycles').value
  cyclesInterrupts = document.querySelector('#interrupts-cycles').value

  for (let i = 100; i < 100 + cyclesDispatcher; i++) {
    processesInfo['dispatcher'].instructions.push(i)
  }

  processes.forEach((p, index) => {
    const labelProcess = `p-${index}`
    processesInfo[labelProcess] = {
      trace: p.split(','),
      pointer: 0,
      currentState: 'ready',
      executionTime: 0
    }
    processInsideSystem.push(labelProcess)
    dispatchInfo.readyQueue.push(labelProcess)

    results[labelProcess] = []
  })

  dispatchInfo.running = dispatchInfo.readyQueue.shift()
  while (!flagBlocked) {
    algorithmExecution()
  }

  assignTimeExecution()

  paintResult()
})
