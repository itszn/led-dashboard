## Setup
Change the config location in `server/server.py` if needed. Make a backup of the config if needed.
```bash
cd server && pip install -r reqs.txt
python server.py
```

## Dev
Install node deps:
```bash
npm install
```

Change `window.URL` in src/index.js to be the url you will access the python server from.

Start dev server:
```bash
npm start # In one terminal
cd server && python server.py
```

Build with `npm run build`


