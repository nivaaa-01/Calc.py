const currentOperandEl = document.getElementById('currentOperand');
const previousOperandEl = document.getElementById('previousOperand');

let currentOperand = '0';
let previousOperand = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  currentOperandEl.textContent = currentOperand;
  previousOperandEl.textContent = previousOperand
    ? `${previousOperand} ${getDisplayOperator(operator)}`
    : '';
}

function getDisplayOperator(op) {
  const symbols = { '/': '÷', '*': '×', '-': '−', '+': '+' };
  return symbols[op] || '';
}

function appendNumber(num) {
  if (shouldResetScreen) {
    currentOperand = '';
    shouldResetScreen = false;
  }
  if (currentOperand === '0' && num !== '.') {
    currentOperand = num;
  } else {
    currentOperand += num;
  }
  updateDisplay();
}

function addDecimal() {
  if (shouldResetScreen) {
    currentOperand = '0';
    shouldResetScreen = false;
  }
  if (!currentOperand.includes('.')) {
    currentOperand += '.';
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (operator && !shouldResetScreen) {
    calculate();
  }
  previousOperand = currentOperand;
  operator = op;
  shouldResetScreen = true;
  updateDisplay();
}

function calculate() {
  if (!operator || shouldResetScreen) return;
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = curr === 0 ? 'Error' : prev / curr; break;
  }

  currentOperand = result === 'Error' ? 'Error' : String(parseFloat(result.toFixed(10)));
  previousOperand = '';
  operator = null;
  shouldResetScreen = true;
  updateDisplay();
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operator = null;
  shouldResetScreen = false;
  updateDisplay();
}

function deleteLast() {
  if (shouldResetScreen) return;
  currentOperand = currentOperand.slice(0, -1) || '0';
  updateDisplay();
}

function applyPercent() {
  currentOperand = String(parseFloat(currentOperand) / 100);
  updateDisplay();
}

// Button clicks
document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value = btn.dataset.value;

  switch (action) {
    case 'number':   appendNumber(value); break;
    case 'decimal':  addDecimal(); break;
    case 'operator': chooseOperator(value); break;
    case 'equals':   calculate(); break;
    case 'clear':    clearAll(); break;
    case 'delete':   deleteLast(); break;
    case 'percent':  applyPercent(); break;
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  else if (e.key === '.') addDecimal();
  else if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === '%') applyPercent();
});
