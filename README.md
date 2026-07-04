# AgroVision AI

Crop pest identification, yield prediction, and fertilizer guidance.

## Run it

### Frontend

```sh
npm i
npm run dev
```

Opens at http://localhost:8080. Talks to the backend at http://localhost:5000 (hardcoded in the fetch calls).

### Backend (Python 3.10.7)

```sh
cd backend
py -3.10 -m venv venv
venv/Scripts/activate      # Windows. On Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

Runs at http://localhost:5000.

## Environment variables

Create `backend/.env` (gitignored, never commit it) with one or both:

```
GOOGLE_API_KEY=your_gemini_api_key_here
NVIDIA_API_KEY=your_nvidia_api_key_here
```

| Key | Used for | Get one at |
|---|---|---|
| `GOOGLE_API_KEY` | Fertilizer recommendations. Also pest image analysis if set (Gemini vision -- preferred over NVIDIA if both are set) | https://aistudio.google.com/apikey |
| `NVIDIA_API_KEY` | Pest image analysis, only used if `GOOGLE_API_KEY` isn't set | https://build.nvidia.com |

Neither key is required to run the app:
- No key set -> pest image analysis falls back to the local MobileNetV2 model (132 fixed insect/mite classes, no disease detection).
- With a key set -> pest image analysis goes through Gemini or NVIDIA vision instead -- not limited to a fixed class list, can recognize plant diseases too (e.g. yellow rust), not just insects.
- Fertilizer recommendations need `GOOGLE_API_KEY` specifically; without it that endpoint returns a clear error instead of crashing the server.
- Yield prediction never needs a key.

## Testing it

**Quickest check -- the UI itself:** run both servers above, open http://localhost:8080, upload a pest photo on the "Image upload" tab. You should see a result card with pest name, severity badge, confidence bar, and pesticide suggestions. Try the "Manual input" and "Yield prediction" tabs too.

**Backend endpoints directly (curl), from `backend/` with the server running:**

```sh
# Pest image analysis
curl http://localhost:5000/api/analyze -X POST -F "image=@/path/to/photo.jpg"

# Yield prediction
curl http://localhost:5000/api/predict-yield -X POST -H "Content-Type: application/json" -d '{
  "Crop": "Rice", "Crop_Year": 2024, "Season": "Kharif", "State": "Punjab",
  "Area": 100, "Annual_Rainfall": 1200, "Fertilizer": 50, "Pesticide": 10
}'

# Fertilizer recommendations (needs GOOGLE_API_KEY set)
curl http://localhost:5000/api/recommend-fertilizer -X POST -H "Content-Type: application/json" -d '{
  "crop_name": "rice", "temperature": 28, "humidity": 65, "moisture": 40,
  "soil_type": "loamy", "nitrogen": 50, "phosphorus": 30, "potassium": 40
}'
```

A working response looks like JSON with a 200 status. If a model failed to load (e.g. missing file, incompatible library version), you get a clear `{"error": "..."}` with a 503/500 instead of the whole server crashing -- check the terminal running `python app.py` for a `Failed to initialize <name>: ...` line telling you which one and why.

**Frontend build/lint check** (also runs automatically as a pre-push git hook):

```sh
npm run build
npm run lint
```

## Notes

- `backend/split_dataset.py`, `train_model.py`, `ip102_loader.py`, `train_ip102.py` are an in-progress attempt at retraining the pest classifier on the IP102 dataset for broader class coverage. Not finished -- no new model file is committed yet.
- `docs/screenshot/` has reference screenshots of the working UI (valid analysis, invalid/error state, other tabs).
