import apiFetch from './apiFetch';

// TODO: Add support for thai language
// Departments are Fields for Current Report
const departments = [
  'Grocery',
  'Clothing and Accessories',
  'Beauty and Personal Care',
  'Health and Wellness',
  'Household',
];

// Helper function // To set data point to appropriate Department
const setDepDatapoint = (product) => {
  const dataArray = [];
  departments.forEach((dep) => {
    if (product.department.en === dep) {
      dataArray.push(product.count);
    } else {
      dataArray.push(null);
    }
  });
  return dataArray;
};

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// eslint-disable-next-line arrow-body-style
const randShadeHSLA = (hue, alpha) => {
  // hue 0 - 360, sat 50-100%, light 30-60%, a 0.0-1.0
  return `hsla(${hue}, ${rand(50, 100)}%, ${rand(30, 60)}%,${alpha})`;
};

const randShadeByDepartment = (dep) => {
  switch (dep) {
    case departments[0]: // Grocery = Green
      return randShadeHSLA(120, 0.75);
    case departments[1]: // Clothing = Orange
      return randShadeHSLA(30, 0.75);
    case departments[2]: // Personal = Blue
      return randShadeHSLA(210, 0.75);
    case departments[3]: // Health = Red
      return randShadeHSLA(360, 0.75);
    case departments[4]: // House = Purple
      return randShadeHSLA(270, 0.75);
    default:
      throw new Error('Not a valid department');
  }
};

// Generate a chart data for a store return array of data
// Not sure why this is linting
// eslint-disable-next-line consistent-return
export const genStoreCurrentReport = async (storeID) => {
  try {
    const res = await apiFetch(
      `/products/mgt?store=${storeID}&sort=product.name.en`,
      'GET',
    );
    const data = {
      avgCount: 0,
      labels: departments,
    };
    // Sorted by name for quick ID between stores.
    data.datasets = res.data.products.map((product) => {
      data.avgCount += product.count;
      let prodName = product.name.en;
      if (product.size) prodName += ` ${product.size}`;
      return {
        label: prodName,
        data: setDepDatapoint(product),
        backgroundColor: [randShadeByDepartment(product.department.en)],
        borderWidth: 0.5,
      };
    });
    data.avgCount /= res.data.products.length;
    return data;
  } catch (err) {
    // TODO: Implement better error handle
    console.log(err);
  }
};

export const populateCharts = async (htmlCollection) => {
  try {
    const charts = [];
    let chartAvgs = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const el of htmlCollection) {
      // eslint-disable-next-line no-await-in-loop
      const { avgCount, ...data } = await genStoreCurrentReport(el.children[1].id);
      chartAvgs += avgCount;
      // eslint-disable-next-line no-undef
      const chart = new Chart(el.children[1], {
        type: 'bar',
        data,
        options: {
          datasets: { bar: { skipNull: true } },
          plugins: { legend: { display: false } },
        },
      });
      charts.push(chart);
    }
    chartAvgs = Math.round(chartAvgs / htmlCollection.length);
    charts.forEach((chart) => {
      // eslint-disable-next-line no-param-reassign
      chart.options.scales.y.max = chartAvgs * 2; // puts most halfway
      chart.update();
    });
  } catch (err) {
    console.log(err);
  }
};

export default populateCharts;
