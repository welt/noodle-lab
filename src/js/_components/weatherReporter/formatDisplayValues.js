export default function formatDisplayValues(data) {
  return {
    cityDisplay: data.city || "Unknown location",
    latDisplay:
      typeof data.latitude === "number" ? data.latitude.toFixed(4) : "N/A",
    lonDisplay:
      typeof data.longitude === "number" ? data.longitude.toFixed(4) : "N/A",
    tempDisplay:
      data.temperature !== null && data.temperature !== undefined
        ? `${data.temperature}\u00b0C`
        : "N/A",
    conditionDisplay: data.condition || "Unknown",
  };
}
