/**
 * @file matrixPrinter.example.js
 * Example demonstrating how to use MatrixPrinter with DumpToScreen
 */
import DumpToScreen from './dumpToScreen.js';
import MatrixPrinter from './matrixPrinter.js';

// Example 1: Using DumpToScreen with default MatrixPrinter
function example1() {
  const logger = new DumpToScreen('message-panel');

  // Regular logging (instant)
  logger.log('Regular message appears instantly');

  // Animated logging (character by character)
  logger.logAnimated('This appears one character at a time!');
}

// Example 2: Custom MatrixPrinter with faster animation
function example2() {
  const fastPrinter = new MatrixPrinter(30); // 30ms delay between characters
  const logger = new DumpToScreen('message-panel', 4, fastPrinter);

  logger.logAnimated('Call trans opt: received. 24/01/15 14:30:45 REC:Log>');
}

// Example 3: Custom MatrixPrinter with slower animation
function example3() {
  const slowPrinter = new MatrixPrinter(100); // 100ms delay between characters
  const logger = new DumpToScreen('message-panel', 4, slowPrinter);

  logger.logAnimated('S...l...o...w... animation...');
}

// Example 4: Dynamically changing animation speed
function example4() {
  const printer = new MatrixPrinter(50);
  const logger = new DumpToScreen('message-panel', 4, printer);

  logger.logAnimated('Medium speed message');

  setTimeout(() => {
    printer.setDelay(20); // Speed up
    logger.logAnimated('Fast message after delay');
  }, 3000);
}

// Example 5: Canceling animation
function example5() {
  const printer = new MatrixPrinter(50);
  const logger = new DumpToScreen('message-panel', 4, printer);

  logger.logAnimated('This message will be interrupted...');

  setTimeout(() => {
    // New animation cancels the previous one
    logger.logAnimated('New message takes over!');
  }, 500);
}

// Example 6: Using MatrixPrinter directly (without DumpToScreen)
function example6() {
  const printer = new MatrixPrinter(40);
  const outputElement = document.getElementById('custom-output');

  printer.print('Direct matrix effect!', (accumulated) => {
    outputElement.textContent = accumulated;
  }).then((finalMessage) => {
    console.log('Animation complete:', finalMessage);
  });
}

// Example 7: Integration with screenLogger (production use)
import createScreenLogger from './screenLogger.js';

function example7() {
  // The screenLogger automatically uses logAnimated for matrix messages
  createScreenLogger(DumpToScreen, 'message-panel');

  // Now when console.log is called with allowed strings,
  // regular messages appear instantly
  console.log('fetched: data.json');

  // And matrix messages (20% random) appear character-by-character
  // console.log will randomly trigger: "Call trans opt: received..."
}

export {
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7
};
