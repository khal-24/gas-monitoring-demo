function getChart(measurements) {
  msr = [...measurements].reverse();
  tr1 = [];
  tr2 = [];
  tr3 = [];
  tr4 = [];
  tr5 = [];
  for (m of msr) {
    point = {
      x: m.time_create,
      y: m.co2,
      pk: m.pk,
      ps: m.ps,
      tco2: m.tco2,
    };
    switch (m.transmitter) {
      case 1:
        tr1.push(point);
        break;
      case 2:
        tr2.push(point);
        break;
      case 3:
        tr3.push(point);
        break;
      case 4:
        tr4.push(point);
        break;
      case 5:
        tr5.push(point);
        break;
    }
  }
  return Highcharts.chart("char-container", {
    time: {
      useUTC: false,
    },
    title: {
      text: "График показаний",
      align: "left",
    },
    subtitle: {
      text: formatDate(new Date()),
      align: "left",
    },
    yAxis: {
      title: {
        text: "Концентрация CO2",
      },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Время",
      },
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        "<b>Измерение {point.pk}</b><br/>Концентрация CO2: {point.y}<br/> Освещенность: {point.ps}%<br/> Температура: {point.tco2} град",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
        pointStart: msr[0].time_create,
      },
    },
    series: [
      {
        name: "Датчик 1",
        data: tr1,
      },
      {
        name: "Датчик 2",
        data: tr2,
      },
      {
        name: "Датчик 3",
        data: tr3,
      },
      {
        name: "Датчик 4",
        data: tr4,
      },
      {
        name: "Датчик 5",
        data: tr5,
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  });
}
