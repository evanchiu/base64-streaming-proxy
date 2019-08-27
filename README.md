# base64-streaming-proxy

Stream from remote content as a base64-encoded text files

Encode multiples of [3 bytes at a time](https://stackoverflow.com/questions/7920780/is-it-possible-to-base64-encode-a-file-in-chunks), which will become 4 base64 characters.

## Run as a server

```
npm install
npm run build
npm start
```
