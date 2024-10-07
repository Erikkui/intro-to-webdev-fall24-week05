// Help on passing data to tooltip acquired from here: https://stackoverflow.com/questions/46580213/pass-a-parameter-to-oneachfeature-leaflet

async function createMap() {
    // Fetch map data
    const url = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326"
    const dataPromise = await fetch( url )
    const data = await dataPromise.json()

    const [posData, negData] = await fetchMigrationData()

    console.log(data)

    initializeMap( [data, posData, negData] )
}

function initializeMap(data) { 
    const [mapData, posData, negData] = data
    console.log(posData)
    
    let map = L.map( "map" )
    let OpenStreetMap = L.tileLayer( 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        minZoom: -3,      
        attribution: "© OpenStreetMap",                
    }).addTo( map )

    let geoJSON = L.geoJSON( mapData, {
        weight: 2,
        onEachFeature: municipalityTooltipClosure( posData, negData ),
    }).addTo( map )

    map.fitBounds( geoJSON.getBounds() )
}

function municipalityTooltipClosure( posData, negData ) {
    return function municipalityTooltip( feature, layer ) {
        const id = parseInt ( feature.id.split(".")[1] )
        const muniName = feature.properties.name
        const positiveMigration = posData.dataset.value[id]
        const negativeMigration = negData.dataset.value[id]

        tooltipString = "<b>" + muniName + "</b><br> Positive migration: " + positiveMigration + "<br> Negative migration: " + negativeMigration
        layer.bindTooltip( tooltipString )
    }
}

async function fetchMigrationData() {
    const posURL = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f"
    const negURL = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e"

    const positiveMigrationDataPromise = await fetch( posURL )
    const positiveMigrationData = await positiveMigrationDataPromise.json()

    const negativeMigrationDataPromise = await fetch( negURL )
    const negativeMigrationData = await negativeMigrationDataPromise.json()

    return [ positiveMigrationData, negativeMigrationData ]
}


window.addEventListener( 'load', createMap );