Date.prototype.daysInMonth = function() {
  return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

function sortFunc(a, b){
	if(a.day > b.day){
		return 1;
	} 
	if(a.day < b.day){
		return -1;
	}
	return 0;
}


var data_month = [];
var type_date = 'personnel_units';

var date_start = new Date('2022-02-24');
var today = new Date(Date.now());
var loop_count = (today.getYear() - date_start.getYear())*12 + (today.getMonth() - date_start.getMonth());
var chart;

function loadData() {
return new Promise(function(resolve, reject) {
for(i = 1; i <= loop_count; i++){
	
	year = date_start.getFullYear()
	month = '' + (date_start.getMonth()+1);
	day = date_start.daysInMonth();
	if(month.length < 2){
		month='0'+month
	}
	let a;
	date = [year, month, day].join('-')
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `https://russianwarship.rip/api/v1/statistics/${date}`, true);
	xhr.onload = () => {
    if (xhr.status == 200) {               
        var a = JSON.parse(xhr.responseText);
		data_month.push(a.data);
		if(data_month.length > 12){
			resolve();
		}
		//console.log(data_month);
    } else {                                
        console.log("Server response: ", xhr.statusText);
    }
	};
	
	xhr.send();
	date_start.setMonth(date_start.getMonth() + 1);
	
}
	
});
}

loadData().then(() => {
	console.log(data_month);
    data_month.sort((a,b) => b.day - a.day).reverse()
	var month = [];
	var vtr = [];
	for(i = 0; i < data_month.length; i++){
		month.push(data_month[i].date);
		if(i == 0){
			vtr.push(data_month[i].stats[type_date])
		}else{
			vtr.push(data_month[i].stats[type_date] - data_month[i-1].stats[type_date])
		}
	}
	const ctx = document.getElementById('myChart');
	chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: month,
      datasets: [{
        label: 'Months',
        data: vtr,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
	  onClick: handleClick
    }
	
  });
  })
  .catch((error) => {
    console.error(error);
  });







var data_ = [];
function loadDataDays(year_ = 2022, month_ = 1) {
	data_ = [];
	return new Promise(function(resolve, reject) {
		var day_ = 1;
		if(year_ == 2022 && month_ == 1){
			day_ = 27;
		}
		var date_for_days = new Date(year_, month_, day_);
		while (date_for_days.getDate() != (date_for_days.daysInMonth()+1)){
			year_ = date_for_days.getFullYear()
			month_str = '' + (date_for_days.getMonth()+1);
			day_str = '' + date_for_days.getDate();
			if(day_str.length < 2){
				day_str='0'+day_str
			}
			if(month_str.length < 2){
				month_str='0'+month_str
			}
			let a;
			date_for_days_str = [year_, month_str, day_str].join('-');
			const xhr = new XMLHttpRequest();
			xhr.open("GET", `https://russianwarship.rip/api/v1/statistics/${date_for_days_str}`, true);
			xhr.onload = () => {
				if (xhr.status == 200) {               
					var a = JSON.parse(xhr.responseText);
					data_.push(a.data);
					if(year_ == 2022 && month_ == 1 && data_.length >= 2){
						resolve();
					}else if(data_.length >= date_for_days.daysInMonth()){
						resolve();
					}
				} else {                                
					console.log("Server response: ", xhr.statusText);
				}
			};
	
			xhr.send();
			
			
			if(date_for_days.getDate() >= date_for_days.daysInMonth()){
				break;
			}
			date_for_days.setDate(date_for_days.getDate() + 1);
		}
	
	});
}

var chart2;

loadDataDays(2022, 1).then(() => {
	data_.sort((a,b) => b.day - a.day).reverse();
	var date_diagr = [];
	var vtr_diagr = [];
	for(i = 0; i < data_.length; i++){
		date_diagr.push(data_[i].date);
		if(i == 0){
			vtr_diagr.push(data_[i].stats.personnel_units)
		}else{
			vtr_diagr.push(data_[i].stats.personnel_units - data_[i-1].stats.personnel_units)
		}
	}
	console.log(date_diagr);
	console.log(vtr_diagr);
	const ctx2 = document.getElementById('myChart2');
	chart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: date_diagr,
      datasets: [{
        label: 'Days',
        data: vtr_diagr,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
    }
	
  });

  })
  .catch((error) => {
    console.error(error);
  });

var index = 0;
function handleClick(evt)
{
	index = chart.getActiveElements()[0]['index'];
	
	console.log(chart);
	
	//chart.getActiveElements()[0].element.options.backgroundColor = '#ff0000';
	
	var year_diagram = data_month[index]['date'].slice(0,4);
	var month_diagram = data_month[index]['date'].slice(5,7);

	
	year_date = parseInt(year_diagram);
	month_date = parseInt(month_diagram) - 1;
	
	var prev_data = 0;
	
	if(year_date != 2022 || month_date != 1){
		prev_data = data_month[index-1].stats.personnel_units;
		console.log(prev_data);
	}
	
	loadDataDays(year_date, month_date).then(() => {
	data_.sort((a,b) => b.day - a.day).reverse();
	var date_diagr = [];
	var vtr_diagr = [];
	for(i = 0; i < data_.length; i++){
		date_diagr.push(data_[i].date);
		if(i == 0){
			vtr_diagr.push(data_[i][type_date] - prev_data);
		}else{
			if(data_[i].stats[type_date] - data_[i-1].stats[type_date] < 0){ 
				vtr_diagr.push(0);
			} else{
				vtr_diagr.push(data_[i].stats[type_date] - data_[i-1].stats[type_date]);
			}
		}
	}
	console.log(date_diagr);
	
	chart2.config.data.labels = date_diagr;
	chart2.data.datasets[0]['data'] = vtr_diagr;
	chart2.update();
	
	
  })
  .catch((error) => {
    console.error(error);
  });
}
document.getElementsByClassName('image_block')[0].style.backgroundColor = '#ffffff61';
function changeDataSet(date_type, tag){
	image_blocks = document.getElementsByClassName('image_block');
	for(var i = 0; i < image_blocks.length; i++){
		image_blocks[i].style.backgroundColor = '';
	}
	tag.style.backgroundColor = '#ffffff61';
	type_date = date_type;
	
	data_month.sort((a,b) => b.day - a.day).reverse()
	var month = [];
	var vtr = [];
	for(i = 0; i < data_month.length; i++){
		month.push(data_month[i].date);
		if(i == 0){
			vtr.push(data_month[i].stats[type_date])
		}else{
			vtr.push(data_month[i].stats[type_date] - data_month[i-1].stats[type_date])
		}
	}
	
	
	chart.config.data.labels = month;
	chart.data.datasets[0]['data'] = vtr;
	chart.update();
	
	
	loadDataDays(year_date, month_date).then(() => {
	data_.sort((a,b) => b.day - a.day).reverse();
	var date_diagr = [];
	var vtr_diagr = [];
	
	if(year_date != 2022 || month_date != 1){
		prev_data = data_month[index-1].stats.personnel_units;
		console.log(prev_data);
	}
	
	for(i = 0; i < data_.length; i++){
		date_diagr.push(data_[i].date);
		if(i == 0){
			vtr_diagr.push(data_[i][type_date] - prev_data);
		}else{
			if(data_[i].stats[type_date] - data_[i-1].stats[type_date] < 0){ 
				vtr_diagr.push(0);
			} else{
				vtr_diagr.push(data_[i].stats[type_date] - data_[i-1].stats[type_date]);
			}
		}
	}
	console.log(date_diagr);
	
	chart2.config.data.labels = date_diagr;
	chart2.data.datasets[0]['data'] = vtr_diagr;
	chart2.update();
	})
}


