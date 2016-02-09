//Array of projections used in animation
var options = [
  {name: "Conic Equidistant", projection: d3.geo.conicEquidistant().scale(128)},
  {name: "Aitoff", projection: d3.geo.aitoff()},
  {name: "Albers", projection: d3.geo.albers().scale(150).parallels([20, 50])},
  {name: "August", projection: d3.geo.august().scale(65)},
  {name: "Baker", projection: d3.geo.baker().scale(110)},
  {name: "Boggs", projection: d3.geo.boggs().scale(160)},
  {name: "Bonne", projection: d3.geo.bonne().scale(120)},
  {name: "Bromley", projection: d3.geo.bromley().scale(160)},
  {name: "Collignon", projection: d3.geo.collignon().scale(110)},
  {name: "Craster Parabolic", projection: d3.geo.craster()},
  {name: "Eckert I", projection: d3.geo.eckert1().scale(165)},
  {name: "Eckert II", projection: d3.geo.eckert2().scale(165)},
  {name: "Eckert III", projection: d3.geo.eckert3().scale(180)},
  {name: "Eckert IV", projection: d3.geo.eckert4().scale(180)},
  {name: "Eckert V", projection: d3.geo.eckert5().scale(170)},
  {name: "Eckert VI", projection: d3.geo.eckert6().scale(170)},
  {name: "Eisenlohr", projection: d3.geo.eisenlohr().scale(60)},
  {name: "Equirectangular (Plate Carrée)", projection: d3.geo.equirectangular()},
  {name: "Fahey", projection: d3.geo.fahey().scale(135)},
  {name: "Gall Stereographic", projection: d3.geo.cylindricalStereographic().parallel(45).scale(140)},
  {name: "Ginzburg IV", projection: d3.geo.ginzburg4().scale(145)},
  {name: "Gringorten Equal-Area", projection: d3.geo.gringorten().scale(241)},
  {name: "Guyou", projection: d3.geo.guyou().scale(152)},
  {name: "Hammer", projection: d3.geo.hammer().scale(170)},
  {name: "Hill", projection: d3.geo.hill().scale(150)},
  {name: "Uninterrupted Goode Homolosine", projection: d3.geo.homolosine().scale(165)},
  {name: "Kavrayskiy VII", projection: d3.geo.kavrayskiy7()},
  {name: "Lambert cylindrical equal-area", projection: d3.geo.cylindricalEqualArea().scale(160)},
  {name: "Lagrange", projection: d3.geo.lagrange().scale(120)},
  {name: "Larrivée", projection: d3.geo.larrivee().scale(95)},
  {name: "Laskowski", projection: d3.geo.laskowski().scale(130)},
  {name: "Loximuthal", projection: d3.geo.loximuthal()},
  {name: "Miller", projection: d3.geo.miller().scale(100)},
  {name: "McBryde–Thomas Flat-Polar Parabolic", projection: d3.geo.mtFlatPolarParabolic().scale(160)},
  {name: "McBryde–Thomas Flat-Polar Quartic", projection: d3.geo.mtFlatPolarQuartic().scale(170)},
  {name: "McBryde–Thomas Flat-Polar Sinusoidal", projection: d3.geo.mtFlatPolarSinusoidal()},
  {name: "Mollweide", projection: d3.geo.mollweide().scale(165)},
  {name: "Natural Earth", projection: d3.geo.naturalEarth().scale(160)},
  {name: "Nell–Hammer", projection: d3.geo.nellHammer().scale(160)},
  {name: "Polyconic", projection: d3.geo.polyconic().scale(100)},
  {name: "Rectangular Polyconic", projection: d3.geo.rectangularPolyconic().rotate([100, 0]).scale(125)},
  {name: "Robinson", projection: d3.geo.robinson()},
  {name: "Sinusoidal", projection: d3.geo.sinusoidal()},
  {name: "Sinu-Mollweide", projection: d3.geo.sinuMollweide()},
  {name: "Van der Grinten I", projection: d3.geo.vanDerGrinten().scale(75)},
  {name: "Times", projection: d3.geo.times().scale(135)},
  {name: "Tobler World-in-a-Square", projection: d3.geo.cylindricalEqualArea().parallel(55.6539665).scale(135)},
  {name: "Van der Grinten IV", projection: d3.geo.vanDerGrinten4().scale(120)},
  {name: "Wagner IV", projection: d3.geo.wagner4().scale(170)},
  {name: "Wagner VI", projection: d3.geo.wagner6()},
  {name: "Wagner VII", projection: d3.geo.wagner7().scale(160)},
  {name: "Winkel Tripel", projection: d3.geo.winkel3()}
];

//Apply the same rotation and center to all projections
options.forEach(function(o) {
  o.projection.rotate([0, 0]).center([0, 0]);
});

//Sizing variables
var mapWidth = parseInt(d3.select(".map").style("width")),
    mapHeight = parseInt(d3.select(".map").style("height")),
    globeWidth = parseInt(d3.select(".globe").style("width")),
    globeHeight = parseInt(d3.select(".globe").style("height"));

//Set an initial projection for map
var projection = options[0].projection;

//Create the main svg canvas
var svg = d3.select(".map").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

//Create the svg canvas for 3D spinning globe
var svgGlobe = d3.select(".globe").append("svg")
    .attr("width", globeWidth)
    .attr("height", globeHeight);

//Set up the orthographic projection for the globe
var globeProjection = d3.geo.orthographic()
  .scale(550)
  .translate([globeWidth / 2, globeHeight / 2])
  .clipAngle(90);

var globePath = d3.geo.path()
  .projection(globeProjection);

//Load the geo data and draw the globe and map
d3.json("./js/world-110m.json", function(error, world) {
  if (error) throw error;

  var graticule = d3.geo.graticule();

  //Make parts for a globe
  function makeGlobe() {
    svgGlobe.append("use")
      .attr("class", "water")
      .attr("xlink:href", "#sphere2");

    svgGlobe.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere2")
      .attr("d", globePath);

    svgGlobe.append("path")
      .datum(topojson.feature(world, world.objects.countries))
      .attr("class", "land")
      .attr("d", globePath);

    svgGlobe.append("path")
      .datum(graticule)
      .attr("class", "graticule grat-globe")
      .attr("d", globePath);
  }

  //Make parts for the projection map
  function makeProjectionMap() {
    var path = d3.geo.path()
        .projection(projection);

    svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

    svg.append("use")
      .attr("class", "water")
      .attr("xlink:href", "#sphere");

    svg.append("path")
        .datum(topojson.feature(world, world.objects.countries))
        .attr("class", "land")
        .attr("d", path);

    svg.append("path")
      .datum(graticule)
      .attr("class", "graticule grat-proj")
      .attr("d", path);
  }

  makeGlobe();
  makeProjectionMap();
});

//Create interval to run through projections
var interval = setInterval(loop, 100),
    n = options.length - 1,
    iter = 0;

//Function to run update on each interval tick
function loop() {
  //Change the projection every 5 secs.
  if (iter % 50 === 0) {
    d3_timer.timerOnce(changeProjection);
  }

  d3_timer.timerOnce(function() {
    //Spin globe
    globeProjection.rotate([iter / 10, 0]);
    svgGlobe.selectAll("path").attr("d", globePath);
  });

  iter += 1;
}

function changeProjection() {
  var j = Math.floor(Math.random() * n);
  update(options[j]);
}

//Function to update and run animation on map projections
function update(option) {
  d3.select(".viz-info").text(option.name);

  svg.selectAll("path").transition()
    .duration(1000)
    .attrTween("d", projectionTween(projection, projection = option.projection))
    .attrTween("transform", centerTween(d3.select("#sphere").node()));
}

//Function for pretty transition between projections
function projectionTween(projection0, projection1) {
  return function(d) {
    var t = 0;

    var projection = d3.geo.projection(project)
      .scale(4)
      .translate([mapWidth / 2, 0]);

    var path = d3.geo.path()
      .projection(projection);

    function project(λ, φ) {
      λ *= 180 / Math.PI;
      φ *= 180 / Math.PI;
      var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
      return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
    }

    return function(_) {
      t = _;
      return path(d);
    };
  };
}

//Function to return centering function during update of the map
function centerTween(sphereNode) {
  return function() {
    return function() {
      var sphereBounds = sphereNode.getBBox();
      var sphereHeightMid = sphereBounds.y + sphereBounds.height / 2;

    return "translate(0," + Math.round(mapHeight / 2 - sphereHeightMid) + ")";
    };
  };
}

//FOF TESTING
// var c1 = 0;
// svg.on("mousedown", function() {
//   update(options[c1]);
//   c1++;
// });
