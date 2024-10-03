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
        attribution: "© OpenStreetMap",                
    }).addTo( map )

    let geoJSON = L.geoJSON( data, {
        weight: 2,
        onEachFeature: municipalityTooltip,
    }).addTo( map )

    map.fitBounds( geoJSON.getBounds() )
}

const municipalityTooltip = (feature, layer) => {
    const muniName = feature.properties.name


    layer.bindTooltip( muniName )
}

async function fetchMigrationData() {
    const posURL = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f"
    const negURL = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e"

    const positiveMigrationData = await fetch( posURL ).json()
    const negativeMigrationData = await fetch( negURL ).json()

    return positiveMigrationData, negativeMigrationData
}


window.addEventListener( 'load', createMap );