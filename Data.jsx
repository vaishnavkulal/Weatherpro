import React, { useState } from "react";
import axios from "axios";
import redis from "./client";

/**
 * Weather lookup component
 * - Enter a city and press Enter or click Fetch
 * - Shows name, temp (°C), description, icon, humidity, wind
 * - Handles loading & errors, prevents blank queries
 */
export default function Data() {
  const [data, setData] = useState(null); // holds response.data from backend
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const kelvinToCelsius = (k) => Math.round(k - 273.15);

  async function fetchData() {
    if (!location.trim()) {
      setError("Please enter a location.");
      setData(null);
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.get(
        `http://localhost:6969/weather/${encodeURIComponent(location.trim())}`
      );
      // backend returns OpenWeather object (we assume you changed it to res.json(data))
      setData(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      // try to show helpful error message
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Could not fetch weather. Check city name or server.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") fetchData();
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Weather Finder</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder="Enter city (e.g. London)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="location"
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className={`px-4 py-2 rounded-md font-medium ${
            loading ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white"
          }`}
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {data ? (
        <div className="text-center">
          {/* City name and country */}
          <h3 className="text-xl font-bold">
            {data.name}{data.sys?.country ? `, ${data.sys.country}` : ""}
          </h3>

          {/* Weather row */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {/* icon */}
            {data.weather?.[0]?.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt={data.weather[0].description}
                className="w-20 h-20"
              />
            )}

            <div className="text-left">
              <div className="text-3xl font-semibold">
                {typeof data.main?.temp === "number"
                  ? `${kelvinToCelsius(data.main.temp)}°C`
                  : "—"}
              </div>
              <div className="capitalize text-sm text-gray-600">
                {data.weather?.[0]?.description ?? "No description"}
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">Humidity</div>
              <div>{data.main?.humidity ?? "—"}%</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">Wind</div>
              <div>{data.wind?.speed ? `${data.wind.speed} m/s` : "—"}</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">Feels like</div>
              <div>
                {typeof data.main?.feels_like === "number"
                  ? `${kelvinToCelsius(data.main.feels_like)}°C`
                  : "—"}
              </div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-medium">Pressure</div>
              <div>{data.main?.pressure ? `${data.main.pressure} hPa` : "—"}</div>
            </div>
          </div>
        </div>
      ) : (
        !loading && !error && (
          <div className="text-center text-gray-500">Enter a city and press Fetch.</div>
        )
      )}
    </div>
  );
}
