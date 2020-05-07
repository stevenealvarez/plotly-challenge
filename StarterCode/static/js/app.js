// create function for data

function getPlot(id){
    d3.json("Data/samples.json").then((data) => {
        console.log(data)

        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)

        //filter values
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        console.log(samples);

        //top 10
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        var otu_top= (samples.otu_ids.slice(0, 10)).reverse();

        //otu_id
        var otu_id= otu_top.map(d => "OTU" + d)

        //otu_labels
        var otu_labels= samples.otu_labels.slice(0, 10);

        //trace variables
        var trace = {
            x: sampledata,
            y: otu_id,
            text: otu_labels,
            marker: {
                color: 'rgb(142,124,195)'},
            type: "bar",
            orientation: "h",
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30,
            }
        };

        //bar chart

        Plotly.newPlot("bar", data, layout);

        // 3. create a bubble chart that displays each sample

        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };

        var layout1= {
            xaxis:{title: "otu_ids"},
            height: 600,
            width: 1000
        };

        var data1= [trace1];

        Plotly.newPlot("bubble", data1, layout1);

        // Display the sample metadata, i.e., an individual's demographic information.
        //Display each key-value pair from the metadata JSON object somewhere on the page.
        function getInfo(id) {
            d3.json("Data/samples.json").then((data) => {

                var metadata = data.metadata;

                console.log(metadata)

                var results = metadata.filter(meta => meta.id.toString() === id)[0];

                var demoInfo = d3.select("#sample-metadata");

                demoInfo.html("");

                Object.defineProperties(results).forEach((key) => {
                    demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
                });
            });
        }
        function optionChanged(id){
            getPlot(id);
            getInfo(id);
        }
        function init() {
            var dropdown = d3.select("#selDataset");

            d3.json("Data/sample.json").then((data) => {
                console.log(data)

                data.names.forEach(function(name){
                    dropdown.append("option").text(name).property("value");
                });
                getPlot(data.names[0]);
                getInfo(data.names[0]);
            });
        }
    })
}

init();