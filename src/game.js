Scotland.NUMBER_OF_JUNCTIONS = 200
Scotland.thief = PIXI.Sprite.from('../assets/thief-mask.png');
Scotland.cop1 = PIXI.Sprite.from('../assets/cop-hat.png');
Scotland.cop2 = PIXI.Sprite.from('../assets/cop-hat.png');
Scotland.cop3 = PIXI.Sprite.from('../assets/cop-hat.png');
Scotland.cop4 = PIXI.Sprite.from('../assets/cop-hat.png');
Scotland.cop5 = PIXI.Sprite.from('../assets/cop-hat.png');
Scotland.map = PIXI.Sprite.from('../assets/map.png');

let text = new PIXI.Text('Cop1',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
text.x = 800
Scotland.cop1.width = 30
Scotland.cop1.height = 25
Scotland.cop1.alpha = .6
Scotland.thief.width = 30
Scotland.thief.height = 20
Scotland.thief.alpha = .6
app.stage.addChild(Scotland.map);
app.stage.addChild(Scotland.cop1);
app.stage.addChild(Scotland.thief);

app.stage.addChild(text);
class Junction {
    constructor(number,x,y) {
        this.hasTaxiStop = true
        this.hasBusStop = false
        this.hasUnderGround = false;
        this.hasRiverWay = false;
        this.number = number;
        this.taxiRoutes = []
        this.busRoutes = []
        this.undergroundRoutes = []
        this.riverWayRoutes = []
        this.point = new PIXI.Point(x,y);
    }

    addTaxiRoute(other){
        if (this.taxiRoutes.indexOf(other) < 0 ) {
        this.taxiRoutes.push(other)
        other.taxiRoutes.push(this)
        }
    }
    addBusRoute(other){
        if (this.busRoutes.indexOf(other) < 0 ) {
        this.busRoutes.push(other)
        other.busRoutes.push(this)
        }
    }addUndergroundRoute(other){
        if (this.undergroundRoutes.indexOf(other) < 0 ) {
        this.undergroundRoutes.push(other)
        other.undergroundRoutes.push(this)
        }
    }
}

Scotland.junctions = []

Scotland.addRoute =  (type, a, b) => {

    switch (type){
        case 0:
            Scotland.junctions[a].addTaxiRoute(Scotland.junctions[b]);
            break;
        case 1:
            Scotland.junctions[a].addBusRoute(Scotland.junctions[b]);
            break;
        case 2:
            Scotland.junctions[a].addUndergroundRoute(Scotland.junctions[b]);
            break;
    }
}

Scotland.initJunctions = async () =>{
    
    for (let i = 0 ; i < Scotland.NUMBER_OF_JUNCTIONS+1; i++){
        Scotland.junctions.push(new Junction(i,10*i,10*i))
    }
    let mapDataResp = await fetch("../assets/map-info.csv")
    let rawData = await mapDataResp.text()
    Scotland.mapData = rawData.split("\n")

    for(let i =0; i< Scotland.mapData.length ; i++){
        let juncData = Scotland.mapData[i].split(",")
        let junNumber = Number(juncData[0])
        let junction = Scotland.junctions[junNumber]
        junction.point.x = juncData[1]
        junction.point.y = juncData[2]
        junction.hasTaxiStop = juncData[3].indexOf("T")>=0
        junction.hasBusStop = juncData[3].indexOf("B")>=0
        junction.hasUnderGround = juncData[3].indexOf("U")>=0

        juncData[4].split("-").forEach(t => {
           Scotland.addRoute(0,junNumber,Number(t)) 
        });

        juncData[5].split("-").forEach(t => {
           Scotland.addRoute(1,junNumber,Number(t)) 
        });
        juncData[6].split("-").forEach(t => {
           Scotland.addRoute(2,junNumber,Number(t)) 
        });
    }

}

Scotland.initJunctions();

Scotland.moveCop = (junction) => {

}

 // Add a ticker callback to move the sprite back and forth
 let elapsed = 0.0;
 app.ticker.add((delta) => {
   elapsed += delta;
   Scotland.cop1.x =  Scotland.junctions[(elapsed / 100).toFixed(0) % 200].point.x
   Scotland.cop1.y =  Scotland.junctions[(elapsed / 100).toFixed(0) % 200].point.y
   Scotland.thief.x =  Scotland.junctions[(elapsed / 100).toFixed(0) % 200 + 2].point.x
   Scotland.thief.y =  Scotland.junctions[(elapsed / 100).toFixed(0) % 200 + 2].point.y

 });
console.log(Scotland);