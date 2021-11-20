d3.json("samples.json")
.then(function(data){
    console.log(data.names[0]);
});