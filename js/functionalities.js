const createMap = async () => {
    // Fetch map data
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326"
    const dataPromise = await fetch( url )
    const data = await dataPromise.json()
    console.log(data)
    initializeMap( data )
}

function initializeMap(data) { 
    let map = L.map( "map" )
    let OpenStreetMap = L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        minZoom: -3,                         
    }).addTo( map )

    let geoJSON = L.geoJSON( data, {
        weight: 2,
        onEachFeature: municipalityTooltip,
    }).addTo( map )

    map.fitBounds( geoJSON.getBounds() )
}

const municipalityTooltip = (feature, layer) => {
    const muniName = feature.properties.name
    // console.log(muniName)
    layer.bindTooltip( muniName )
}


window.addEventListener( 'load', createMap );