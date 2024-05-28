export const map = {
    pivotClockwise() {
      const n = this.values.length;
      const newValues = Array.from({ length: n }, () => Array(n).fill(null));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          newValues[j][n - 1 - i] = this.values[i][j];
        }
      }
      this.values = newValues;
    },
    equals(gridButtons) {
      const buttonColors = Array.from(gridButtons).map(button => {
        if (button.classList.contains("redagent")) return "red";
        if (button.classList.contains("blueagent")) return "blue";
        if (button.classList.contains("bystander")) return "tan";
        return "grey"; // Indicate unclicked buttons
      });
  
      const buttonGrid = [];
      while (buttonColors.length) buttonGrid.push(buttonColors.splice(0, 5));
  
      const checkMatch = (values) => {
        for (let i = 0; i < values.length; i++) {
          for (let j = 0; j < values[i].length; j++) {
            if (buttonGrid[i][j] === "grey") continue; // Ignore unclicked buttons
            if (values[i][j] === "black" || buttonGrid[i][j] === "black") return false;
            if (values[i][j] !== buttonGrid[i][j]) return false;
          }
        }
        return true;
      };
  
      for (let rotation = 0; rotation < 4; rotation++) {
        if (checkMatch(this.values)) return true;
        this.pivotClockwise();
      }
  
      return false;
    },
    print() {
        const mapContainer = document.getElementById('map-container');
      
        const mapDiv = document.createElement('div');
        mapDiv.classList.add('map-display');
      
        // Modified master color display
        const masterColorDiv = document.createElement('div');
        masterColorDiv.classList.add('master-color');
        const masterColorSpan = document.createElement('span');
        masterColorSpan.style.backgroundColor = this.master;
        masterColorDiv.appendChild(masterColorSpan);
        mapContainer.appendChild(masterColorDiv); // Append master color box to the container
      
        const valuesCopy = [...this.values]; // Create a copy to avoid modifying original
        for (let rotation = 0; rotation < 4; rotation++) {
            this.pivotClockwise();
        }
      
        valuesCopy.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('map-row');
            row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.classList.add('map-cell', cell);
                rowDiv.appendChild(cellDiv);
            });
            mapDiv.appendChild(rowDiv);
        });
    
        mapContainer.appendChild(mapDiv); // Append cells to the container
        mapContainer.appendChild(document.createElement('br')); // Insert line break
    }
  };  
