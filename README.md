Frontend
```sh
npm i

npm run dev
```

Backend(Python version - 3.10.7)
```sh
cd backend

py -3.10 -m venv venv

venv/Scripts/activate

pip install -r requirements.txt

python app.py
```

Backend needs a `.env` file (in `backend/`, gitignored) with:
```
GOOGLE_API_KEY=your_gemini_api_key_here
```
Get a key at https://aistudio.google.com/apikey. Only the fertilizer-recommendation endpoint needs this; pest image analysis and yield prediction work without it.