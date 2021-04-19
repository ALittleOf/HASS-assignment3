// Assignment Four (02.526 Interactive Data Visualisation)

let blueScale = d3.scaleLinear()
  .domain([10, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000])
  .range(d3.schemeBlues[9]);

let redScale = d3.scaleLinear()
  .domain([10, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000])
  .range(d3.schemeReds[9]);


let tiles = new L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
  detectRetina: true,
  maxZoom: 19,
  minZoom: 11,
  //Do not remove this attribution
  attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;">' +
               'New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});

let map = new L.Map("map", {
  // center: [1.347833, 103.809357], 
  center: [1.2789, 103.8536], 
  zoom: 11,
  maxBounds: L.latLngBounds(L.latLng(1.1, 103.5), L.latLng(1.5, 104.3))
  })
  .addLayer(tiles);

let svg = d3.select(map.getPanes().overlayPane)
  .append("svg")
    .attr("width", 845)
    .attr("height", 465)
  // .attr("width", window.innerWidth)
  // .attr("height", window.innerHeight)
      .append("g")
      .attr("id","svgLayer")
      .attr("class", "leaflet-zoom-hide");

function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  // streams the projection without saving a copy
  // point.x+20 will offset the overlay
  this.stream.point(point.x, point.y); 
}

let projection = d3.geoTransform({point: projectPoint});
let geopath = d3.geoPath().projection(projection);

function maleMap(male){
  // Load external data and boot (put full GitHub url)
  Promise.all([d3.json("sgmap.json"), d3.csv("popMale2020.csv")]).then(data => {
    let sgmap = data[0]
    let popMale2020 = data[1]
    let geopath = d3.geoPath().projection(projection);

    // adding population to subzone
    for(i=0; i<popMale2020.length; i++){
      // grab subzone name
      var dataSubz = popMale2020[i].Subzone;
      //grab data value, and convert from string to float
      var dataValue = parseFloat(popMale2020[i].Population);
      //find the corresponding state inside the GeoJSON
      for(var n = 0; n < sgmap.features.length; n++){
        // properties name gets the states name
        var jsonSubz = sgmap.features[n].properties.Name;
        // if statment to merge by name of state
        if(dataSubz.toUpperCase() == jsonSubz){
          //Copy the data value into the JSON
          // basically creating a new value column in JSON data
          sgmap.features[n].properties.value = dataValue;
          console.log(dataValue, dataSubz)
          //stop looking through the JSON
          break;
        }
      }
    }
  
  map.on('zoomend', onZoom);
  // zoom in and out
  function onZoom() {
    var bounds = geopath.bounds(data[0]),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    var svg = d3.select(map.getPanes().overlayPane).select("svg");
        
    svg
      .attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[0] - topLeft[0])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[0] + "px");
       
    svg.select("g").attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[0] + ")");
    d3.select("g#districts").selectAll("path")
      .attr("d", geopath);
  }

  svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(sgmap.features)
    .enter()
    .append("path")
    .attr("d", geopath)
    // .classed("district", true) //black base map if commented out
    .classed("leaflet-interactive", true)
    .on("mouseover", (event, d) => {
      if (d.properties.value > 0){
        d3.select(".tooltip")
        .html('<b>' + d.properties.Name + '</b>' +'<br>' +'<br>'+ d.properties.value)
      }
      else {
        d3.select(".tooltip")
        .html('<b>' + d.properties.Name + '</b>' +'<br>' +'<br>'+ "undefined")
      }
    })
    .attr("fill", d => {
      return blueScale(d.properties.value)
    })
    .on("mouseout", (event,d)=> {
      d3.select(".tooltip")
      .text("");
      d3.select(svg.selectAll("path")
      .attr("opacity", 0.93));
      d3.select(event.currentTarget) 
    });
  })
}

function femaleMap(female){
  // Load external data and boot (put full GitHub url)
  Promise.all([d3.json("sgmap.json"), d3.csv("popFemale2020.csv")]).then(data => {
    let sgmap = data[0]
    let popFemale2020 = data[1]
    let geopath = d3.geoPath().projection(projection);

    // adding population to subzone
    for(i=0; i<popFemale2020.length; i++){
      // grab subzone name
      var dataSubzF = popFemale2020[i].Subzone;
      //grab data value, and convert from string to float
      var dataValueF = parseFloat(popFemale2020[i].PopFemale);
      //find the corresponding state inside the GeoJSON
      for(var n = 0; n < sgmap.features.length; n++){
        // properties name gets the states name
        var jsonSubzF = sgmap.features[n].properties.Name;
        // if statment to merge by name of state
        if(dataSubzF.toUpperCase() == jsonSubzF){
          //Copy the data value into the JSON
          // basically creating a new value column in JSON data
          sgmap.features[n].properties.value = dataValueF;
          console.log(dataValueF, dataSubzF)
          //stop looking through the JSON
          break;
        }
      }
    }
  
  map.on('zoomend', onZoom);
  // zoom in and out
  function onZoom() {
    var bounds = geopath.bounds(data[0]),
        topLeft = bounds[0],
        bottomRight = bounds[1];

    var svg = d3.select(map.getPanes().overlayPane).select("svg");
        
    svg
      .attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[0] - topLeft[0])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[0] + "px");
       
    svg.select("g").attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[0] + ")");
    d3.select("g#districts").selectAll("path")
      .attr("d", geopath);
  }

  svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(sgmap.features)
    .enter()
    .append("path")
    .attr("d", geopath)
    // .classed("district", true) //black base map if commented out
    .classed("leaflet-interactive", true)
    .on("mouseover", (event, b) => {
      if (b.properties.value > 0){
        d3.select(".tooltip")
        .html('<u>' + b.properties.Name + '</u>'+ '<br>'+ b.properties.value)
      }
      else {
        d3.select(".tooltip")
        .html('<u>' + b.properties.Name +'</u>' + '<br>' + "undefined")
      }
    })
    .attr("fill", b => {
      return redScale(b.properties.value)
    })
    .on("mouseout", (event,b)=> {
      d3.select(".tooltip")
      .text("");
      d3.select(svg.selectAll("path")
      .attr("opacity", 0.93));
      d3.select(event.currentTarget) 
    });
  })
}


d3.select("#bt1").on("click", function() {
  maleMap("male");
});
d3.select("#bt2").on("click", function() {
  femaleMap("female");
});
maleMap("male");
