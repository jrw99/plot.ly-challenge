// Global to share the filtered sample
let samples = [];

// OnChange function for select. Takes in the Test Subject ID to fitler on
function optionChanged(otuId) {   
    let sample = samples.filter(sample => sample.id === otuId);
    let vals = sample[0].sample_values.slice(0,10).reverse();
    let lbls = sample[0].otu_ids.slice(0,10).reverse();
    lbls = lbls.map(lbl => "OTU " + lbl);
    let txt = sample[0].otu_labels.slice(0,10).reverse();    

    let newTop10OTU = 
         [{           
             x: vals,
             y: lbls,
             text: txt, 
             type: 'bar',
             orientation: 'h'
         }];       
    
     var layout = {
        title: `Top 10 OTUs for Test Subject ID:${sample[0].id}`                      
     };

     Plotly.react('bar', newTop10OTU, layout); 
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


    // Kick-off by pre-filter on the first value
    let sample = samples.filter(sample => sample.id === '940'); 
    
    // The data is sorted in descending order by the samples_values so we just need 
    // to splice the first 10 from each set within, but still need to call reverse
    let vals = sample[0].sample_values.slice(0,10).reverse();
    let lbls = sample[0].otu_ids.slice(0,10).reverse();
    lbls = lbls.map(lbl => "OTU " + lbl);
    let txt = sample[0].otu_labels.slice(0,10).reverse();

    let top10OTU = 
         [{           
             x: vals,
             y: lbls,
             text: txt, 
             type: 'bar',
             orientation: 'h'
         }];       
    
     var layout = {
         title: `Top 10 OTUs for Test Subject ID:${sample[0].id}`                 
     };

     Plotly.newPlot('bar', top10OTU, layout);    
});


