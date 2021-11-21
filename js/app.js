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
        title: `<b>Top 10 OTUs for Test Subject ID:${sample[0].id}</b>`                      
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
        title: `<b>Bubble Chart for Test Subject ID:${sample[0].id}</b>`                      
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

// BONUS - function to return gauge data
function getGaugeData(otuId) {
    let demoInfo = getMetaData(otuId);  
    
    // pie chart converted to gauge chart
    let gaugeData = {
        type: 'pie',        
        hole: 0.5,
        rotation: 90,
        direction: 'clockwise',
        values: [180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180/9, 180],
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],        
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['#F8F3EC','#F4F1E5','#E9E6CA','#E2E4B1','#D5E49D','#B7CC92','#8CBF88','#8ABB8F','#85B48A','transparent'],
            labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','']              
        },
        hoverinfo: "skip",
        showlegend: false
    }

    // the dot for the needle 
    let needleDot = {
        type: 'scatter', // this is the smoothest animation for the needle movement
        x: [0],
        y: [0],
        marker: {
            size: 20,
            color:'#830308'
        },
        hoverinfo: "skip",
        showlegend: false        
    }

     // offsets for the degree calculation to update the needle
    let offset = 0;  
    switch(demoInfo.wfreq) 
    {
        case 2:
        case 3:
            offset = 3;
            break;
        case 4:
            offset = 1;
            break;
        case 5:
            offset = -.5;
            break;
        case 6:
            offset = -2;
            break;
        case 7:
            offset = -3;
            break;
        default:
            offset = 0;
    }   

    // build the triangle needle
    let degrees = 180-(20 * demoInfo.wfreq + offset); 
    let radius = .5;
    let radians = degrees * Math.PI / 180;

    let x1 = 0.025 * Math.cos((radians) * Math.PI / 180);
    let y1 = 0.025 * Math.sin((radians) * Math.PI / 180);
    let x2 = -0.025 * Math.cos((radians) * Math.PI / 180);
    let y2 = -0.025 * Math.sin((radians) * Math.PI / 180);
    let x3 = radius * Math.cos(radians);
    let y3 = radius * Math.sin(radians);

    // build the SVG path string (m = moveto, L = linetos, z = closepath) 
    let pth = 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2 + ' L ' + x3 + ' ' + y3 + ' Z';

    // layout
    let gaugeLayout = {
        title: `<b>Belly Button Washing Frequency</b><br>Scrubs per Week for <b>Test Subject ID:${otuId}</b>`,
        shapes:[{
            type: 'path',
            path: pth,
            fillcolor: '#830308',
            line: {
                color: '#830308'
            }
        }],
        xaxis: {
            zeroline:false, 
            showticklabels:false,
            showgrid: false, 
            range: [-1, 1]            
        },
        yaxis: {
            zeroline:false, 
            showticklabels:false,
            showgrid: false, 
            range: [-1, 1]           
        }
    };
  
    let data = {
        trace:[gaugeData, needleDot],
        layout:gaugeLayout
    }

    return data;
}

//function to update the Demographic Info panel
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
    
    let gaugePlotData = getGaugeData(otuId);
    Plotly.react('gauge', gaugePlotData.trace, gaugePlotData.layout); 
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

    let gaugePlotData = getGaugeData(data.names[0]);
    Plotly.newPlot('gauge', gaugePlotData.trace, gaugePlotData.layout);   
});