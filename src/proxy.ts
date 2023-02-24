import * as express from 'express';
import { responseInterceptor } from 'http-proxy-middleware';
import axios from 'axios';
import * as xorCrypt from 'xor-cryptor';
import * as zlib from 'zlib';

import * as streamify from 'stream-array';
import * as HttpProxy from 'http-proxy';

const proxy = new HttpProxy();

const symmetricKey = 'abcdefghijk';

const app = express();

const PORT = 5000;
const GRAPHQL_URL = 'http://localhost:5001';

app.use((req, res, next) => {
  if (req.headers['content-type'] != 'xor') {
    proxy.web(
      req,
      res,
      {
        target: GRAPHQL_URL,
        changeOrigin: true,
        selfHandleResponse: true,
      },
      next,
    );
    return;
  }

  let rawHeader = '';
  req.on('data', (chunk: Buffer) => {
    rawHeader += chunk.toString();
  });
  req.on('end', () => {
    console.log(rawHeader);
    const decrypted = xorCrypt.decrypt(rawHeader, symmetricKey);
    console.log('decrypted', decrypted.decrypted);
    proxy.web(
      req,
      res,
      {
        target: GRAPHQL_URL,
        changeOrigin: true,
        selfHandleResponse: true,
        buffer: streamify([decrypted.decrypted]),
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': decrypted.decrypted.length.toString(),
        },
      },
      next,
    );
  });
});

proxy.on(
  'proxyRes',
  responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    let response: any = responseBuffer;
    if (req.headers.authorization) {
      const data = responseBuffer.toString('utf8'); // convert buffer to string
      const isUser = await axios
        .post(
          new URL(
            `auth/isuser/${req.headers.authorization}`,
            'http://localhost:5000',
          ).href,
        )
        .then((res) => res.data);
      console.log('isUser', isUser);
      if (isUser) {
        const encrypted = xorCrypt.encrypt(data, symmetricKey);
        res.setHeader('content-type', 'text/html; charset=utf-8');
        response = encrypted.encrypted;
      }
    }
    if (req.headers['x-compression'] == 'gzip') {
      const compressed = zlib.gzipSync(response);
      res.setHeader('content-encoding', 'gzip');
      return compressed;
    }
    return response;
  }),
);

app.listen(PORT, () => {
  console.log(`Starting proxy at ${PORT}`);
});
