# run-weather.ps1
# Go to your project folder
Set-Location "C:\Users\colem\weatherapp\weather-classic"

# Install dependencies (safe to run every time; skips if already installed)
npm install

# Start the development server
npm run dev
