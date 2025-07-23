import React, { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';

const Pie = (props) => {
  const { height = 300, width = 300, data, labels: showLabels = true } = props;
  const [infor, setInfor] = useState();

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const top10 = data.slice(0, 5); // Pega os 10 primeiros

      const valores = top10.map((item) => parseFloat(item.valor));
      const nomes = top10.map((item) => item.nome);

      setInfor({
        series: valores,
        options: {
          chart: {
            type: 'pie',
            height: height,
            width: width,
            toolbar: {
              show: false
            },
            dropShadow: {
              enabled: true,
              color: '#000',
              top: 8,
              left: 5,
              blur: 6,
              opacity: 0.1
            }
          },
          dataLabels: {
            enabled: showLabels,
            formatter: (val, opts) => {
              const value = opts.w.config.series[opts.seriesIndex];
              return parseFloat(value).toFixed(2);
            },
            style: {
              fontSize: '12px'
            }
          },
          legend: {
            show: false
          },
          labels: nomes,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 250
                }
              }
            }
          ]
        }
      });
    }
  }, [data, showLabels, height, width]);

  return (
    <div style={{ width: width, height: height }}>
      <Row id="chart">
        {infor ? <ReactApexChart options={infor.options} series={infor.series} type="pie" height={height} width={width} /> : null}
      </Row>
    </div>
  );
};

export default Pie;
