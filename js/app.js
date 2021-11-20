// Global to share the filtered sample
let samples = [];
let metaData = [];

// Function to filter for desired sample based on otuId for Bar plot
function getBarData(otuId) {
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

// Function to filter for desired sample based on otuId for Bubble plot
function getBubbleData(otuId) {
    let sample = samples.filter(sample => sample.id === otuId);
    let xvals = sample[0].otu_ids;
    let yvals = sample[0].sample_values;
    let msize = yvals;
    let mcolours = xvals;
    let txt = sample[0].otu_labels; 

    let bubdata = 
         [{           
             x: xvals,
             y: yvals,
             text: txt, 
             mode: 'markers',
             marker: {
                 size: msize,
                 color: mcolours
             }
         }];       
    
     let lyout = {
        title: `Bubble Chart for Test Subject ID:${sample[0].id}`                      
     };

     let data = {
         trace:bubdata,
         layout:lyout
     }

     return data;
}

// function to return meta data for demographics
function getMetaData(otuId) {
    let demoInfo = metaData.filter(demoInfo => demoInfo.id == otuId);    
    return demoInfo[0];
}

function updateDemographicData(demoData)
{  
    demoDataDiv = d3.select('#sample-metadata');
    demoDataDiv.html("");
    for (const [key, value] of Object.entries(demoData)) {
        var row = demoDataDiv.append("div")            
        row.append("span")
            .style("font-weight", "bold")
            .style("font-size", "80%")
            .style("padding-right", "3px")
            .text(key + ":");
        row.append("span")
            .style("font-size", "80%")
            .style("font-weight", "bold")
            .text(value);
      }
}

// OnChange function for select. Takes in the Test Subject ID to fitler on
function optionChanged(otuId) {  
    let barPlotData = getBarData(otuId);
    Plotly.react('bar', barPlotData.trace, barPlotData.layout); 

    let bubblePlotData = getBubbleData(otuId);
    Plotly.react('bubble', bubblePlotData.trace, bubblePlotData.layout); 

    let metaInfo = getMetaData(otuId);
    updateDemographicData(metaInfo);    
}

// Load the data
d3.json("data/samples.json")
.then(function(data){

    // Parse out the samples section for use
    samples = data.samples;
    metaData = data.metadata;
    //console.log(metaData);

    // Load the select ddl with the ID's to filter on
    d3.select('#selDataset')
    .selectAll('option')
    .data(data.names)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr('value', function (d) { return d; });    

    // Kick-off by pre-filtering on the first value in the select list and plot it. 
    // Can just get the first value of the names array to accomplish...
    let barPlotData = getBarData(data.names[0]);
    Plotly.newPlot('bar', barPlotData.trace, barPlotData.layout);    

    let bubblePlotData = getBubbleData(data.names[0]);
    Plotly.newPlot('bubble', bubblePlotData.trace, bubblePlotData.layout); 

    let metaInfo = getMetaData(data.names[0]);
    updateDemographicData(metaInfo);

});


