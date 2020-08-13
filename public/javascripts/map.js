var map = L.map("map-main").setView([15.434034, -90.618269], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
  foo: "bar",
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
}).addTo(map);

L.marker([14.561911, -90.756502]).addTo(map);
L.marker([16.060376, -91.572516]).addTo(map);

// request asincronico para hacer solicitud a una web
$.ajax({
  datType: "json",
  url: "api/bicicletas",
  success: function (objResult) {
    console.log(objResult);
    objResult.bicicletas.forEach(function(element) {
      L.marker(element.ubicacion, {title: element.id}).addTo(map);
    });
  }
});


