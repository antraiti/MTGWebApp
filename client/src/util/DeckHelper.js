//Converts picture scale and pos data to picpos formatting
export function GeneratePicpos(crop, zoom) {
    return (Math.ceil(crop.x*100)/100)
        + "," + (Math.ceil(crop.y*100)/100)
        + "," + (Math.ceil(zoom*100)/100);
}

//Converts picpos data to picture scale and pos data
export function ParsePicpos(picpos) {
    if(!picpos || picpos == null) return null;
    var splits = picpos.split(",");
    if(splits.length < 3) return null;
    return {crop: {x: splits[0], y: splits[1]}, zoom: splits[2]};
}