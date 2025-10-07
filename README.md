# Flood Help - Udham Singh Nagar

A React-based web application for flood monitoring, prediction, and community reporting in Udham Singh Nagar district.

## Features

- **Real-time Weather Alerts**: Live weather updates from Open-Meteo API
- **Flood Inundation Maps**: Interactive maps showing flood-prone areas
- **Flood Prediction Model**: Advanced geospatial analysis using Earth Engine data
- **Community Reporting**: Residents can report flood situations
- **Emergency Information**: Important helplines and safety guidelines

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YASH-ai-bit/flood-help.git
cd flood-help
```

2. Install dependencies:

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create an optimized production build:

```bash
npm run build
```

## Project Structure

```
floodhelp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── HomePage.js
│   │   ├── HomePage.css
│   │   ├── FloodPredictionPage.js
│   │   └── FloodPredictionPage.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- React.js
- React Router
- Leaflet & React-Leaflet (for mapping)
- Open-Meteo API (for weather data)
- Google Earth Engine (for geospatial analysis)

## Pages

- **Home Page** (`/`): Main dashboard with weather alerts, safety guidelines, helplines, and community reporting
- **Flood Prediction** (`/flood_prediction`): Advanced mapping interface with multiple data layers (elevation, slope, flood occurrence, inundation)

## Original HTML Files

The original HTML files (`complete.html` and `flood_prediction.html`) are preserved in the project root for reference.

## License

This project is built for community safety and disaster management.

## Contact

For questions or support, please contact the District Disaster Management Authority: 05944-250719
