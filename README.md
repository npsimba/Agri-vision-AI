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

Backend needs a `.env` file (in `backend/`, gitignored) with one or both:
```
GOOGLE_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
```
`GOOGLE_API_KEY` (https://aistudio.google.com/apikey) is used for fertilizer recommendations, and also for pest image analysis if set (Gemini vision -- not limited to a fixed pest list, can recognize plant diseases too, unlike the local model).

`NVIDIA_API_KEY` (https://build.nvidia.com) is an alternative vision provider for pest image analysis, used if `GOOGLE_API_KEY` isn't set.

If neither is set, pest image analysis falls back to the local MobileNetV2 model (132 fixed insect/mite classes only, no disease detection). Yield prediction doesn't need any key.