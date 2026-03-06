// Optional: configure or set up a testing framework before each test.
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Next.js needs these web standard APIs available
const { ReadableStream, TransformStream } = require('stream/web');
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.MessagePort = require('worker_threads').MessagePort;
global.MessageChannel = require('worker_threads').MessageChannel;

const { Request, Response, Headers } = require('undici');
global.Request = Request;
global.Response = Response;
global.Headers = Headers;
