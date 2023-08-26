<template>
 <div class="bg container-fluid" >
    <div class="bg form-control">
       
      <div class="form-control shadow p-3">
          <h1>Coverage Overview</h1>
      </div>
      <!-- Filters section -->
      <div class="row form-comtrol mx-xxl-auto shadow m-4 pb-4 pt-3 container">
        <h4>Filters <i class="fas fa-filter"></i></h4>
      
        <!-- Chargers filter -->
          <div class="col">
            <label for="chargers">Chargers:</label>
              <div class="dropdown d-xl-inline-grid m-lg-4 w-75">
                <button class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="chargersDropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                    {{ selectedChargers.length ? selectedChargersText : 'Select Charger' }}
                  
                </button>
                <div class="dropdown-menu w-100 text-center" aria-labelledby="chargersDropdown">
                  <select class="dropdown-item text-uppercase pb-5"
                    v-model="selectedChargers"
                    multiple>
                    
                    <option class="p-2" v-for="charger in chargerOptions"
                      :value="charger"
                      :key="charger">
                      {{ charger }}
                    </option>
                  </select>
                </div>
      
              </div>
          </div>

        <!-- Installers filter -->   
          <div class="col">
            <label for="installers">Installers:</label>
            <div class="dropdown d-xl-inline-grid m-lg-4 w-75">
              <button class="btn btn-secondary dropdown-toggle"
                type="button"
                id="installersDropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false" 
                :value="selectedInstallers.length ? selectedInstallersText : 'Select Installers'"
                >
                {{ selectedInstallers.length ? selectedInstallersText : 'Select Installers' }}
              </button>
              <div class="dropdown-menu w-100 text-center" aria-labelledby="installersDropdown">
                <select class="dropdown-item text-uppercase pb-5 "
                  v-model="selectedInstallers"
                  multiple>
                  <option  class="p-2" v-for="(installer, index) in installerOptions"
                    :value="index"
                    :key="index">
                    {{ installer }}
                  </option>
                </select>
              </div>
            </div>
          </div>   
      </div>

   <!-- Postcode and Radius filters -->
    <div class="row p-4 mt-2" >
      
      <div class="col shadow mx-sm-3 input-group form-control">
              <input type="text" class="form-control" id="postcode" v-model="postcode" placeholder="Enter postcode" >
              
                <div class="input-group-append ">
                  <span class="input-group-text">
                    <i class="fas fa-street-view"></i>
                  </span>
                </div>
                
      </div>
      
      <div class="col shadow mx-sm-3 input-group form-control">
                <input type="number" class="form-control"  v-model="radius"  placeholder="Radius (in miles)">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                </div>
      </div>
        <button class="col-xxl-1 btn btn-outline-danger" @click="clearFilter()" >Clear Filter</button>
     </div>

     <!-- Rest of the Coverage Overview page content -->
     <div class="p-2 shadow-lg" >
         <gmap-map :center="mapCenter" :zoom="mapZoom" style="width: 100%; height:600px;">
            <gmap-marker 
              v-for="(m,index) in markers"
              :key="index"
              :position="getPosition(m.position)">
                <GmapInfoWindow :options="{ maxWidth: 200 }">
                  <div class="p-2">
                  <h6 class="text-uppercase">{{ m.installerName }}</h6>
                  <p class="fw-medium m-0">On going Installation</p>
                  <ul class="installation-list">
                    <li v-for="charger in m.chargers" :key="charger">{{ charger }}</li>
                  </ul>
                  <p class="text-danger fw-bold">Pending: {{ getCapacity(m.chargers) }}</p>
                </div>

              </GmapInfoWindow>
            </gmap-marker>
         </gmap-map>
       </div>
  
    </div>
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
 </div>
 
</template>
<script>
  import sampleData from '@/data/sample-data.json';
  
 // Helper function to calculate distance between two points
  function calculateDistance(point1, point2) {
  const latDiff = Math.abs(point1.lat - point2.lat);
  const lngDiff = Math.abs(point1.lng - point2.lng);
  const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2);

  return distance;
}
  export default {
    data() {
      return {
        selectedChargers: [], 
        selectedInstallers: [],
        postcode: '', 
        radius: '',
        markers:[],
        chargerOptions: [
          "Mini Pro3",
          "Easee One",
          "Ohme Home Pro",
          "Ohme Epod",
          "Indra Smart Pro",
          "Zappi 2.1",
          "Wallbox Pulsar Plus"
          ],
        installerOptions: [],
        installers:[],
        mapCenter: { lat: 51.5074, lng: -0.1278 }, 
        mapZoom: 10, 
        infoWindowPosition: null, 
        infoWindowOpened: false, 
        infoWindowTitle: '', 
        infoWindowChargers: [] 
       
      };
    },
    
    mounted() {
      this.populateInstallerOptions();  
    },

    computed: { 

        selectedChargersText() {   
          return this.selectedChargers.join(', '); 
        },

        selectedInstallersText() {
          return this.selectedInstallers.map(index => this.installerOptions[index]).join(', ');
        }
    },
    methods: {
       // This function return number of pending chargers to install
        getCapacity(chargers) {
        const maxCapacity = 3;
        const pending = chargers.length- maxCapacity;
        return pending.toString();
      },

      // Handles filtering of installers based on selected options
      handleFilterInstallers() {
        this.filterInstallers();
      },

       // Populates the installer options from the sample data
      populateInstallerOptions() {
        const installerObjects = sampleData.coverage.installers;
        this.installerOptions = installerObjects.map(installer => Object.keys(installer)[0]);
        
      },

    // Filters installers based on selected options
      async filterInstallers() { 
       
          const installers = sampleData.coverage.installers;
          const filteredInstallers = [];
    
          if (
          this.selectedInstallers.length === 0 && 
          this.selectedChargers.length === 0 && this.postcode === '' && 
          this.radius === ''
          ) {
              this.markers = filteredInstallers;
              return; 
            }
          
          for (const installer of installers) {
            const installerName = Object.keys(installer)[0];
            const installerData = installer[installerName];
            const selectedChargers = this.selectedChargers;
            const postcode = this.postcode;
            const radius = this.radius;
            const postcodeInRange  = postcode === '' ;
            const checkRadius = radius === '';
            this.markers = [];
           
            const selectedInstallers = this.selectedInstallers.map((index) => this.installerOptions[index]);
            const chargersMatch = selectedChargers.length === 0 || selectedChargers.every((charger) => installerData.chargers.includes(charger));
            const installerSelected = selectedInstallers.length === 0 || selectedInstallers.includes(installerName);
          
            if (installerSelected && chargersMatch && postcodeInRange && checkRadius) {
              const positions = await this.getInstallerCoordinates(installer);

              if (positions.length > 0) {
                positions.forEach((position) => {
                  filteredInstallers.push({
                    position: { lat: position.lat, lng: position.lng },
                    installerName,
                    chargers: installerData.chargers,
                  });
                });
              }
            } else if (postcode !== '') {
            const matchingPostcode = installerData.postcode.find((postcodeData) => postcodeData.code === postcode);

            if (matchingPostcode) {
               const positions = await this.geocodePostcode(postcode)
               if (positions && positions.lat && positions.lng) {
                    filteredInstallers.push({
                      position: { lat: positions.lat, lng: positions.lng },
                      installerName,
                      chargers: installerData.chargers,
                    });    
                }
               
              }else {
                
                let acc
                try{
                const positions = await this.geocodePostcode(postcode);
                acc = { lat: positions.lat, lng: positions.lng };
                }catch (error) {
         
          return ;
        }
        
    this.loading = true;  
    const postcodeData = await Promise.all(            
    sampleData.coverage.installers.map(async (installer) => {
      const installerName = Object.keys(installer)[0];
      const promises = installer[installerName].postcode.map(async (postcodeData) => {
        try {
          const positions = await this.geocodePostcode(postcodeData.code);
          return { code: postcodeData.code, lat: positions.lat, lng: positions.lng };
        } catch (error) {
          console.error(`Error geocoding ${postcodeData.code}:`, error);
          return null;
        } finally {
    this.loading = false; // Set loading back to false
    }
      });
      const positions = await Promise.all(promises);
      return positions;
    })
  );
    const flattenedPostcodeData = postcodeData.flat().reduce((acc, data) => {
    if (data !== null) {
      acc[data.code] = { lat: data.lat, lng: data.lng };
    }
    return acc;
  }, {})
    const maxDistance = 0.2
     let nearbyPostcodes =[]
    for (const code in flattenedPostcodeData) {
      const distance = calculateDistance(acc, flattenedPostcodeData[code]);
    if (distance <= maxDistance && code !== postcode) {
      nearbyPostcodes.push(code);
    
  }
  
             
                const positions = await this.geocodePostcode(nearbyPostcodes);

               if (positions && positions.lat && positions.lng) {
                    filteredInstallers.push({
                      position: { lat: positions.lat, lng: positions.lng },
                      installerName,
                      chargers: installerData.chargers,
                    });    
                }
                  }
              }
              
            
            } else if (radius != null ){
             const matchingradiuscode = installerData.postcode.find((radiusData) => radiusData.radius == radius);
             const postcode = installerData.postcode[0].code

             if (matchingradiuscode){
                const positions = await this.geocodePostcode(postcode);

               if (positions && positions.lat && positions.lng) {
                    filteredInstallers.push({
                      position: { lat: positions.lat, lng: positions.lng },
                      installerName,
                      chargers: installerData.chargers,
                    });    
                }
              }
          }
        }

          this.markers = filteredInstallers;
      },
    
       // Retrieves installer coordinates for a given installer
      async getInstallerCoordinates(installer) {
        const postcodeData = Object.values(installer)[0].postcode;
        const coordinates = [];

        if (Array.isArray(postcodeData)) {
          for (const data of postcodeData) {
            const postcode = data.code;

            try {
              const position = await this.geocodePostcode(postcode);
              if (position && position.lat && position.lng) {
                coordinates.push({ lat: position.lat, lng: position.lng });
              }
            } catch (error) {
              console.error('Error getting installer coordinates:', error);
            }
          }
        } else if (typeof postcodeData === 'string') {
          const postcode = postcodeData;
          
          try {
            const position = this.geocodePostcode(postcode);
            
            if (position && position.lat && position.lng) {
              coordinates.push({ lat: position.lat, lng: position.lng });
            }
          } catch (error) {
            console.error('Error getting installer coordinates:', error);
          }
        }

        return coordinates;
      },

     // Geocodes a given postcode and returns its coordinatesfrom maps.googleapis.com
      async geocodePostcode(postcode) {
            const apiKey = 'AIzaSyABDC0dUVtV6uOZjepOYjTd2eKdr4FwtDo';
            const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${apiKey}`;

            try {
              const response = await fetch(geocodingUrl);
              const data = await response.json();
              console.log(data)
              if (data.status === 'OK') {
                const { lat, lng } = data.results[0].geometry.location;
                return { lat, lng };
              } else {
                throw new Error('Unable to geocode postcode');
              }
            } catch (error) {
              console.error('Error geocoding postcode:', error);
            }
      },



      // Transforms position array into Google Maps compatible format
      getPosition(positionArray) {
          if (Array.isArray(positionArray)) {
            return positionArray.map(position => ({
              lat: Number(position.lat),
              lng: Number(position.lng)
            }));
          } else if (positionArray) {
            return {
              lat: Number(positionArray.lat),
              lng: Number(positionArray.lng)
            };
          } else {
            return null;
          }
      },
      
      // Clears all filter options and markers
      clearFilter() {
        this.selectedInstallers = []; 
        this.postcode = '';
        this.radius = ''; 
        this.selectedChargers = []; 
        this.markers = [];
        this.infoWindowOpened = false;
        this.filterInstallers()
        
      }
    },

    watch :{
      selectedInstallers: {
        deep: true,
        handler: 'handleFilterInstallers'
      },
        selectedChargers: {
          deep: true,
          handler: 'handleFilterInstallers'
        },
        postcode: {
          deep: true,
          handler: 'handleFilterInstallers'
        },
        radius: {
          deep: true,
          handler: 'handleFilterInstallers'
        }
    },
    
  };
</script>
<style>
  .input-group-append {
    position: relative;
    display: flex;
  }
  .input-group-text {
    border-radius: 0 4px 4px 0;
    background-color: #f8f9fa;
    border-color: #ced4da;
  }
  .input-group-text i {
    color: #868e96;
  }
  .input-group-text i:before {
    font-size: 16px;
    line-height: 1;
  }

  .dropdown-item:focus,
  .dropdown-item:hover {
   background-color: white;
   color: black;
   border-color: white;
  }
  .dropdown-item:selected {
    background-color: white;
    color: black;
  }
 
 .bg{
  background-color: #ebeff3;
  padding: 20px;
 
 }
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top of everything */
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


</style>