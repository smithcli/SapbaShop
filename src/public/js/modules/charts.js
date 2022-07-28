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
  for (const dep of departments) {
    if (product.department.en === dep) {
      dataArray.push(product.count);
    } else {
      dataArray.push(null);
    }
  }
  return dataArray;
};

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
      break;
  }
};

// Generate a chart data for a store return array of data
export const genStoreCurrentReport = async (storeID) => {
  const data = {
    avgCount: 0,
    labels: departments,
    datasets: [],
  };
  try {
    // Sorted by name for quick ID between stores.
    const res = await apiFetch(
      `/products/mgt?store=${storeID}&sort=product.name.en`,
      'GET'
    );
    for (const product of res.data.products) {
      let prodName = product.name.en;
      if (product.size) prodName += ` ${product.size}`;
      const prodData = {
        label: prodName,
        data: setDepDatapoint(product),
        backgroundColor: [randShadeByDepartment(product.department.en)],
        borderWidth: 0.5,
      };
      data.avgCount += product.count;
      data.datasets.push(prodData);
    }
    data.avgCount = data.avgCount / res.data.products.length;
    return data;
  } catch (err) {
    // TODO: Implement better error handle
    console.log(err);
  }
};

export const populateCharts = async (htmlCollection) => {
  const charts = [];
  let chartAvgs = 0;
  try {
    for (const div of htmlCollection) {
      const { avgCount, ...data } = await genStoreCurrentReport(
        div.children[0].id
      );
      chartAvgs += avgCount;
      const chart = new Chart(div.children[0], {
        type: 'bar',
        data,
        options: {
          datasets: { bar: { skipNull: true } },
          plugins: { legend: { display: false } },
        },
      });
      charts.push(chart);
    }
    chartAvgs = Math.round(chartAvgs / htmlCollection.length)
    for (const chart of charts) {
      chart.options.scales.y.max = chartAvgs * 2; // puts most halfway
      chart.update();
    }
  } catch (err) {
    console.log(err);
  }
};

export default populateCharts;
