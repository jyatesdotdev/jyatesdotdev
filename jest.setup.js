// Optional: configure or set up a testing framework before each test.
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { MessageChannel, MessagePort, MessageEvent } = require('worker_threads');

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = require('stream/web').ReadableStream;
}

if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = MessageChannel;
}

if (typeof global.MessagePort === 'undefined') {
  global.MessagePort = MessagePort;
}

if (typeof global.MessageEvent === 'undefined') {
  global.MessageEvent = MessageEvent;
}

if (typeof global.Request === 'undefined') {
  global.Request = require('undici').Request;
}

if (typeof global.Response === 'undefined') {
  global.Response = require('undici').Response;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = require('undici').Headers;
}

if (typeof global.fetch === 'undefined') {
  global.fetch = require('undici').fetch;
}
