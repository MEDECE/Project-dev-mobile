import React, { useEffect, useState } from "react";
import {
  MapContainer,
  GeoJSON,
  Tooltip as LeafletTooltip,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import api from "../../services/api";
import "./WorldMapWidget.css";

// Fix for default Leaflet icon issues in React
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: null,
  iconUrl: null,
  shadowUrl: null,
});

const geoUrl =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

const WorldMapWidget = () => {
  const [geoData, setGeoData] = useState(null);
  const [countryStats, setCountryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch GeoJSON and Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch GeoJSON from external source
        const geoRes = await axios.get(geoUrl);
        // Fetch Analysis from OUR Backend
        const analysisRes = await api.get("/analysis");

        setGeoData(geoRes.data);
        setCountryStats(analysisRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to find pollution data for a country
  const getPollutionValue = (countryName) => {
    const countryData = countryStats.find(
      (c) => c.country.toLowerCase() === countryName.toLowerCase()
    );

    if (!countryData) return 0;

    // Find airPollution specific metric
    const pollutionMetric = countryData.averages.find(
      (m) => m.type.toLowerCase() === "airpollution"
    );
    return pollutionMetric ? pollutionMetric.avg : 0;
  };

  const getColor = (countryName) => {
    const value = getPollutionValue(countryName);

    // Gradient based on Pollution High -> Low
    // High pollution = Dark/Red? Or just maintain the violet theme?
    // Let's stick to the violet theme: Darker = More Data/Pollution
    if (value > 100) return "#4A3DBB";
    if (value > 50) return "#6C5DD3";
    if (value > 0) return "#A0D7E7";
    return "#EAEAEC";
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.name;
    const value = getPollutionValue(countryName);

    if (value > 0) {
      layer.bindTooltip(`${countryName}: ${value.toFixed(1)} AQI`, {
        permanent: false,
        direction: "center",
        className: "country-tooltip",
      });
    }

    // Hover effects
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "#FF754C", // Orange on hover
          fillOpacity: 0.9,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        geoJSONStyle(country); // Reset
        layer.setStyle({
          fillColor: getColor(countryName),
          fillOpacity: 1,
        });
      },
    });
  };

  const geoJSONStyle = (feature) => {
    return {
      fillColor: getColor(feature.properties.name),
      weight: 0.5,
      opacity: 1,
      color: "white",
      fillOpacity: 1,
    };
  };

  return (
    <div className="widget map-widget">
      <h3>Global Air Pollution Levels</h3>
      <p className="widget-subtitle">Average AQI per Country</p>

      <div className="map-container custom-leaflet-container">
        {loading ? (
          <p>Loading Map...</p>
        ) : (
          geoData && (
            <MapContainer
              center={[20, 0]}
              zoom={1.5}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", background: "#F4F5F9" }}
              zoomControl={false}
            >
              <ZoomControl position="bottomright" />
              <GeoJSON
                data={geoData}
                style={geoJSONStyle}
                onEachFeature={onEachCountry}
              />
            </MapContainer>
          )
        )}
      </div>

      <div className="map-legend">
        <span className="dot" style={{ background: "#4A3DBB" }}></span> High
        (&gt;100)
        <span className="dot" style={{ background: "#6C5DD3" }}></span> Med
        (50-100)
        <span className="dot" style={{ background: "#A0D7E7" }}></span> Low
        (0-50)
        <span className="dot" style={{ background: "#EAEAEC" }}></span> No Data
      </div>
    </div>
  );
};

export default WorldMapWidget;
