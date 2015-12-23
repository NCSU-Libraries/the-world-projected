var width = parseInt(d3.select(".map").style("width")),
    height = parseInt(d3.select(".map").style("height")),
    linScale = d3.scale.linear().domain([375, 5706]).range([0.3,4]),
    scale = width === 5760 * 12 / 15 ? 4 : linScale(width),
    globeWidth = parseInt(d3.select(".globe").style("width")),
    globeHeight = parseInt(d3.select(".globe").style("height")),
    globe = false;

var options = [
  {name: "Conic Equidistant", projection: d3.geo.conicEquidistant().scale(128)},
  {name: "Aitoff", projection: d3.geo.aitoff()},
  {name: "Albers", projection: d3.geo.albers().scale(150).parallels([20, 50])},
  {name: "August", projection: d3.geo.august().scale(65)},
  {name: "Baker", projection: d3.geo.baker().scale(105)},
  {name: "Boggs", projection: d3.geo.boggs().scale(155)},
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
  {name: "Hammer", projection: d3.geo.hammer().scale(165)},
  {name: "Hill", projection: d3.geo.hill().scale(130)},
  {name: "Uninterrupted Goode Homolosine", projection: d3.geo.homolosine().scale(160)},
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
  {name: "Rectangular Polyconic", projection: d3.geo.rectangularPolyconic().rotate([100, 0]).scale(130)},
  {name: "Robinson", projection: d3.geo.robinson()},
  {name: "Sinusoidal", projection: d3.geo.sinusoidal()},
  {name: "Sinu-Mollweide", projection: d3.geo.sinuMollweide()},
  {name: "Van der Grinten I", projection: d3.geo.vanDerGrinten().scale(75)},
  {name: "Times", projection: d3.geo.times().scale(135)},
  {name: "Tobler World-in-a-Square", projection: d3.geo.cylindricalEqualArea().parallel(55.6539665).scale(140)},
  {name: "Van der Grinten IV", projection: d3.geo.vanDerGrinten4().scale(120)},
  {name: "Wagner IV", projection: d3.geo.wagner4().scale(170)},
  {name: "Wagner VI", projection: d3.geo.wagner6()},
  {name: "Wagner VII", projection: d3.geo.wagner7().scale(160)},
  {name: "Winkel Tripel", projection: d3.geo.winkel3()}
];

options.forEach(function(o) {
  o.projection.rotate([0, 0]).center([0, 0]);
});

var projection = options[35].projection;

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

var svgGlobe = d3.select(".globe").append("svg")
    .attr("width", globeWidth)
    .attr("height", globeHeight);

var globeProjection = d3.geo.orthographic()
  .scale(550)
  .translate([globeWidth / 2, globeHeight / 2])
  .clipAngle(90);

var globePath = d3.geo.path()
  .projection(globeProjection);

// var raleighToX = [
//   [-78.6389, 35.7806],
//   [0.1275, 51.5072]
// ];

d3.json("./js/world-110m.json", function(error, world) {
  if (error) throw error;

  var graticule = d3.geo.graticule();

  //Make parts for a globe
  function makeGlobe() {
    globe = true;
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

    // svgGlobe.append("path")
    //   .datum({type: "LineString", coordinates: raleighToX})
    //   .attr({
    //     "class": "route",
    //     "d": globePath
    //   })
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

    // svg.append("path")
    //   .datum({type: "LineString", coordinates: raleighToX})
    //   .attr("class", "route")
    //   .attr("d", path)
  }

  makeGlobe();
  makeProjectionMap();
  svgGlobe.selectAll("path").attr("transform", sizeGlobe("grat-globe"));

  update(options[35]);
});

//FOF TESTING
// var c1 = 0;
// svg.on("mousedown", function() {
//   update(options[c1]);
//   c1++;
// });

//Create interval to run through projections
var interval = setInterval(loop, 100),
    n = options.length - 1,
    iter = 0;

//Function to run update on each interval tick
function loop() {
  //Change the projection every 5 secs.
  if (iter !== 0 && iter % 50 === 0) {
    var j = Math.floor(Math.random() * n);
    update(options[j]);
  }

  //spin globe if globe is drawn
  if (globe) {
    globeProjection.rotate([iter / 10, 0]);
    svgGlobe.selectAll("path").attr("d", globePath);
  }

  iter += 1;
}

function update(option) {
  d3.select(".viz-info").text(option.name);

  svg.selectAll("path").transition()
    .duration(1000)
    .attrTween("d", projectionTween(projection, projection = option.projection))
    .attrTween("transform", scaleAndCenterTween());
}

function projectionTween(projection0, projection1) {
  return function(d) {
    var t = 0;

    var projection = d3.geo.projection(project)
      .scale(scale)
      .translate([width / 2, height / 2]);

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

function scaleAndCenterTween() {
  return function() {
    return function() {
      return sizeGlobe("grat-proj");
      // var sphereBounds = d3.select("#sphere").node().getBBox();
      // // var sphereHeightMid = sphereBounds.y + sphereBounds.height / 2;
      // var widthScale = width / sphereBounds.width;
      // var heightScale = height / sphereBounds.height;
      // var scaleFactor = Math.min(widthScale, heightScale) * 0.9;
      // var xShift = (sphereBounds.x + sphereBounds.width / 2);
      // var yShift = (sphereBounds.y + sphereBounds.height / 2);
      //
      // // return "translate(0," + Math.round(height / 2 - sphereHeightMid) + ")";
      // return "translate(" + (-xShift * scaleFactor + width / 2) + "," +
      // (-yShift * scaleFactor + height / 2) + "),scale(" + (1 * scaleFactor) +
      // ")";
    };
  };
}

window.onresize = resizeSVG;

function resizeSVG() {
  width = parseInt(d3.select(".map").style("width"));
  height = parseInt(d3.select(".map").style("height"));
  linScale = d3.scale.linear().domain([375, 5706]).range([0.3,4]);
  scale = height === 2304 ? 4 : linScale(width);
  globeWidth = parseInt(d3.select(".globe").style("width"));
  globeHeight = parseInt(d3.select(".globe").style("height"));

  svg.attr("width", width)
    .attr("height", height);

  svgGlobe.attr("width", globeWidth)
    .attr("height", globeHeight);

  svg.selectAll("path").attr("transform", sizeGlobe("grat-proj"));
  svgGlobe.selectAll("path").attr("transform", sizeGlobe("grat-globe"));
}

function sizeGlobe(objRef) {
  var dimensions = objRef === "grat-proj" ?
    [width, height] : [globeWidth, globeHeight];
  var sphereBounds = d3.select("." + objRef).node().getBBox();
  var widthScale = dimensions[0] / sphereBounds.width;
  var heightScale = dimensions[1] / sphereBounds.height;
  var scaleFactor = Math.min(widthScale, heightScale) * 0.9;
  var xShift = (sphereBounds.x + sphereBounds.width / 2);
  var yShift = (sphereBounds.y + sphereBounds.height / 2);

return "translate(" +
  (-xShift * scaleFactor + dimensions[0] / 2) + "," +
  (-yShift * scaleFactor + dimensions[1] / 2) +
  "),scale(" + (1 * scaleFactor) + ")";
}
