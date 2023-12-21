const dataSource = [{
    country: 'USA',
    medals: 110,
}, {
    country: 'China',
    medals: 100,
}, {
    country: 'Russia',
    medals: 72,
}, {
    country: 'Britain',
    medals: 47,
}, {
    country: 'Australia',
    medals: 46,
}, {
    country: 'Germany',
    medals: 41,
}, {
    country: 'France',
    medals: 40,
}, {
    country: 'South Korea',
    medals: 31,
    }];

const dataBar = [
    { age: '13-17', number: 6869661 },
    { age: '18-24', number: 40277957 },
    { age: '25-34', number: 53481235 },
    { age: '35-44', number: 40890002 },
    { age: '45-54', number: 31916371 },
    { age: '55-64', number: 13725406 },
    { age: '65+', number: 16732183 },
];

let dashboard = {
    init: function () {
        $('#pie').dxPieChart({
            palette: 'bright',
            dataSource,
            title: 'Olympic Medals in 2008',
            legend: {
                orientation: 'horizontal',
                itemTextPosition: 'right',
                horizontalAlignment: 'center',
                verticalAlignment: 'bottom',
                columnCount: 4,
            },
            export: {
                enabled: true,
            },
            series: [{
                argumentField: 'country',
                valueField: 'medals',
                label: {
                    visible: true,
                    font: {
                        size: 16,
                    },
                    connector: {
                        visible: true,
                        width: 0.5,
                    },
                    position: 'columns',
                    customizeText(arg) {
                        return `${arg.valueText} (${arg.percentText})`;
                    },
                },
            }],
        });
        $('#chart').dxChart({
            dataSource: dataBar,
            palette: 'soft',
            title: {
                text: 'Age Breakdown of Facebook Users in the U.S.',
                subtitle: 'as of January 2017',
            },
            export: {
                enabled: true,
            },
            commonSeriesSettings: {
                type: 'bar',
                valueField: 'number',
                name: 'Months',
                argumentField: 'age',
                ignoreEmptyPoints: true,
                color: '#5156be'
            },
            seriesTemplate: {
                nameField: 'age',
            },
        });
    }
}