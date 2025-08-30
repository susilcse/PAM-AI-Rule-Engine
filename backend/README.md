# PAM AI Rule Engine - Backend

Simple FastAPI backend for processing PDF contracts and generating rules using OpenAI API.

## Quick Setup (5 minutes)

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Get OpenAI API key:**
   - Go to [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key

3. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Run the backend:**
   ```bash
   python main.py
   ```

5. **Test the API:**
   - Backend runs on http://localhost:8000
   - API docs: http://localhost:8000/docs

## API Endpoints

- `POST /upload-contract` - Upload and process PDF contracts
- `POST /parse-rule` - Parse natural language rules using AI
- `POST /chat` - Chat with AI about rules and contracts

## Cost Estimate

- **GPT-3.5-turbo**: ~$0.001 per request
- **For 100 requests**: ~$0.10
- **For 1000 requests**: ~$1.00

Much cheaper than running local models!
