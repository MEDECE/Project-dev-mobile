import React, { useEffect, useState } from "react";
import {
  MapContainer,
  GeoJSON,
  Tooltip as LeafletTooltip,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { scaleLinear } from "d3-scale"; // Re-use d3-scale if installed, or simple math
import "./WorldMapWidget.css";

// Fix for default Leaflet icon issues in React
import L from "leaflet";
// We don't need markers for this view, but good practice to fix for future
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
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch GeoJSON and Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [geoRes, statsRes] = await Promise.all([
          axios.get(geoUrl),
          axios.get("http://localhost:3000/api/stats/map"),
        ]);
        setGeoData(geoRes.data);
        setStatsData(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Simple sequential color scale logic since d3-scale might be uninstalled
  const getColor = (countryName) => {
    const countryStat = statsData.find(
      (s) => s.name.toLowerCase() === countryName.toLowerCase()
    );
    const value = countryStat ? countryStat.value : 0;

    // Gradient from #EAEAEC to #6C5DD3
    if (value > 10) return "#4A3DBB"; // Deep user base
    if (value > 5) return "#6C5DD3"; // High
    if (value > 0) return "#A0D7E7"; // Low
    return "#EAEAEC"; // None
  };

  const onEachCountry = (country, layer) => {
    const countryName = country.properties.name;
    const countryStat = statsData.find(
      (s) => s.name.toLowerCase() === countryName.toLowerCase()
    );
    const value = countryStat ? countryStat.value : 0;

    layer.bindTooltip(`${countryName}: ${value} users`, {
      permanent: false,
      direction: "center",
      className: "country-tooltip",
    });

    // Hover effects
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillColor: "#FF754C", // Accent on hover
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
      color: "white", // Border color
      fillOpacity: 1,
    };
  };

  return (
    <div className="widget map-widget">
      <h3>Demographic Audience</h3>
      <p className="widget-subtitle">Interactive Leaflet Map</p>

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
              zoomControl={false} // Custom position
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

      {/* Legend built manually */}
      <div className="map-legend">
        <span className="dot" style={{ background: "#4A3DBB" }}></span> &gt; 10
        <span className="dot" style={{ background: "#6C5DD3" }}></span> 5-10
        <span className="dot" style={{ background: "#A0D7E7" }}></span> 1-5
        <span className="dot" style={{ background: "#EAEAEC" }}></span> 0
      </div>
    </div>
  );
};

export default WorldMapWidget;
