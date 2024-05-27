import { map } from './map.js';

document.addEventListener("DOMContentLoaded", function() {
  const masterButton = document.getElementById("master-button");
  const refreshButton = document.getElementById("refresh-button");
  const checkButton = document.getElementById("check-button");
  const gridButtons = document.querySelectorAll(".grid-button");
  const mapContainer = document.getElementById('map-container');

  // Define the colors to toggle between
  const mastercolors = ["red", "blue"];
  const gradientClasses = ["redagent", "blueagent", "bystander", "grey"];

  function getCurrentGradientClass(button) {
    return gradientClasses.find(cls => button.classList.contains(cls)) || "gradient1";
  }

  function getNextGradientClass(currentClass) {
    const currentIndex = gradientClasses.indexOf(currentClass);
    const nextIndex = (currentIndex + 1) % gradientClasses.length;
    return gradientClasses[nextIndex];
  }

  function updateButtonGradient(button, currentClass, nextClass) {
    button.classList.remove(currentClass);
    button.classList.add(nextClass);
  }

  // Function to get the next color
  function getNextMasterColor(currentColor) {
    let currentIndex = mastercolors.indexOf(currentColor);
    return mastercolors[(currentIndex + 1) % mastercolors.length];
  }

  // Change the color of the master button on click
  masterButton.addEventListener("click", function() {
    const currentColor = masterButton.classList.contains("red") ? "red" : "blue";
    const nextColor = getNextMasterColor(currentColor);
    masterButton.className = `button ${nextColor}`;
  });

  gridButtons.forEach(button => {
    button.addEventListener("click", function() {
      const currentClass = getCurrentGradientClass(button);
      const nextClass = getNextGradientClass(currentClass);
      updateButtonGradient(button, currentClass, nextClass);
    });
  });

  refreshButton.addEventListener("click", function() {
    location.reload();
  });

  checkButton.addEventListener("click", async function() {
    const currentMasterColor = masterButton.classList.contains("red") ? "red" : "blue";
    mapContainer.innerHTML = '';

    const mapFiles = await loadMapFiles();

    mapFiles.forEach((mapFile, index) => {
      map.values = mapFile.values;
      map.master = mapFile.master;

      const masterMatch = map.master === currentMasterColor;

      for (let rotation = 0; rotation < 4; rotation++) {
        if (map.equals(gridButtons)) {
          if (masterMatch) {
            const mapDiv = document.createElement('div');
            mapDiv.classList.add('map-match');
            mapDiv.innerHTML = `<div>Map ${index + 1} (Rotation: ${rotation * 90}°)</div>`;
            mapContainer.appendChild(mapDiv);
            map.print(rotation);
            break;
          }
        }
        map.pivotClockwise();
      }
    });

    if (mapContainer.innerHTML === '') {
      alert("No matching maps found.");
    }
  });

  // Load all map files from the 'maps' folder
  async function loadMapFiles() {
    const mapFiles = [];
    for (let i = 1; i <= 35; i++) { 
      const fileName = `maps/map${i}.json`;
      try {
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`Error loading map: ${response.statusText}`);
        const mapFile = await response.json();
        mapFiles.push(mapFile);
      } catch (error) {
        console.error(error);
      }
    }
    return mapFiles;
  }
});
