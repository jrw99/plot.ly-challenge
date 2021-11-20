// Global to share the filtered sample
let samples = [];

function getData(otuId) {
    let sample = samples.filter(sample => sample.id === otuId);
    let vals = sample[0].sample_values.slice(0,10).reverse();
    let lbls = sample[0].otu_ids.slice(0,10).reverse();
    lbls = lbls.map(lbl => "OTU " + lbl);
    let txt = sample[0].otu_labels.slice(0,10).reverse();    

    let Top10OTU = 
         [{           
             x: vals,
             y: lbls,
             text: txt, 
             type: 'bar',
             orientation: 'h'
         }];       
    
     let lyout = {
        title: `Top 10 OTUs for Test Subject ID:${sample[0].id}`                      
     };

     let data = {
         trace:Top10OTU,
         layout:lyout
     }

     return data;
}

// OnChange function for select. Takes in the Test Subject ID to fitler on
function optionChanged(otuId) {  
    let data = getData(otuId);
    Plotly.react('bar', data.trace, data.layout); 
}

// Load the data
d3.json("data/samples.json")
.then(function(data){

    // Parse out the samples section for use
    samples = data.samples;

    // Load the select ddl with the ID's to filter on
    d3.select('#selDataset')
    .selectAll('option')
    .data(data.names)
    .enter()
    .append('option')
    .text(function (d) { return d;})
    .attr('value', function (d) {return d;});    

    // Kick-off by pre-filtering on the first value in the select list and plot it. 
    // Can just get the first value of the names array to accomplish...
    let plotdata = getData(data.names[0]);
     Plotly.newPlot('bar', plotdata.trace, plotdata.layout);    
});


